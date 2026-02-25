import crypto from "crypto";
import User from "../models/User";
import Order from "../models/Order";
import { sendEmail } from "../sendEmail";
import message from "../models/message";

export const handleWebhook = async (req, res) => {
    try{
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        const signature = req.header["x-razorpay-signature"];

        const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(req.body).digest("hex");

        if(signature !== expectedSignature){
            return res.status(400).json({message: "Invalid webhook signature"});
        }

        const event = JSON.parse(req.body.toString());

        if(event.event === "payment.captured"){
            const payment = event.payload.payment.entity;

            const order = await Order.findOne({
                razorpay_order_id: payment.order_id
            });

            if(!order || order.status === "paid") return;

            order.status = "paid";
            order.razorpay_payment_id = payment.id;
            await order.save();

            const user = await User.findById(order.user);
            user.token += order.tokens;
            await user.save();
        }
        res.status(200).json({status: "Webhook processed"});
    }catch(error){
        console.error(error);
        res.status(500).json({message: error.message});
    }
};