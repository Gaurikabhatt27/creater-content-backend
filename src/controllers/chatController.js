import {
    getConversation as getConversationService,
    getMessages as getMessagesService,
    createConversation as createConversationService,
    sendMessage as sendMessageService
} from "../services/chatService.js";

export const createConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).json({ success: false });
        }
        const conversation = await createConversationService(senderId, receiverId);
        res.status(200).json({ success: true, conversation });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const getConversation = async (req, res) => {
    try {
        const userId = req.user?._id || req.query.userId;
        if (!userId) {
            return res.status(400).json({ success: false });
        }
        const conversations = await getConversationService(userId);
        res.status(200).json({ success: true, conversations });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId) {
            return res.status(400).json({ success: false });
        }
        const messages = await getMessagesService(conversationId);
        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, senderId, receiverId, text } = req.body;
        if (!conversationId || !senderId || !receiverId || !text) {
            return res.status(400).json({ success: false });
        }
        const message = await sendMessageService(conversationId, senderId, receiverId, text);
        res.status(200).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};

export const sendMediaMessage = async (req, res) => {
    try {
        const { conversationId, senderId, receiverId, text } = req.body;

        if (!conversationId || !senderId || !receiverId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const message = await import("../services/chatService.js").then(m => m.sendMediaMessage(
            req.file,
            conversationId,
            senderId,
            receiverId,
            text
        ));

        res.status(200).json({ success: true, message });
    } catch (error) {
        console.error("sendMediaMessage error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
