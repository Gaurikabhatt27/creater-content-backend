import express from "express";
import { createOrder, getPlans, verifyPayment } from "../controllers/paymentController.js";
import protect from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/plans", protect, getPlans);
router.post("/createOrder", protect, createOrder);
router.post("/verifyPayment", protect, verifyPayment);
export default router;