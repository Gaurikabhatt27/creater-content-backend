import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    getConversation,
    getMessages,
    createConversation
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getConversation);
router.get("/:conversationId", getMessages);
router.post("/conversation", createConversation);

export default router;