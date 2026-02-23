import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    getConversation,
    getMessages,
    createConversation,
    sendMessage
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getConversation);
router.post("/message", sendMessage);
router.get("/:conversationId", getMessages);
router.post("/conversation", createConversation);

export default router;