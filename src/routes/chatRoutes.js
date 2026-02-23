import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    getConversation,
    getMessages,
    createConversation,
    sendMessage
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", protect, getConversation);
router.post("/message", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.post("/conversation", protect, createConversation);

export default router;