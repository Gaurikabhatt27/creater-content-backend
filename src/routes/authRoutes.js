import express from "express";
import { signup, login, logout, sendOtpController, verifyOtpController, getMe, getAllUsers } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/send-otp", sendOtpController);
router.post("/verify-otp", verifyOtpController);
router.get("/me", getMe, protect);
router.get("/users", protect, getAllUsers);

export default router;