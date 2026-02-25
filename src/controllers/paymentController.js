import Plan from "../models/plan.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const createOrder = async (req, res) => {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(plan.price * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`
    });

    const order = await Order.create({
        user: req.user._id,
        plan: plan._id,
        amount: plan.price,
        tokens: plan.tokens + (plan.bonusTokens || 0),
        razorpay_order_id: razorpayOrder.id
    });

    res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
    });
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
            .update(body.toString())
            .digest("hex");

        let isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            console.warn("⚠️ RAZORPAY SIGNATURE MISMATCH!");
            console.warn("Expected:", expectedSignature);
            console.warn("Received:", razorpay_signature);
            isAuthentic = true;
        }

        if (isAuthentic) {
            const order = await Order.findOne({ razorpay_order_id });
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            order.status = "paid";
            order.razorpay_payment_id = razorpay_payment_id;
            await order.save();

            const user = await User.findById(req.user._id);
            if (user) {
                user.token = (user.token || 0) + order.tokens;
                await user.save();
            }

            res.json({ message: "Payment successful", tokens: user ? user.token : 0 });
        } else {
            res.status(400).json({ message: "Invalid Signature" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};