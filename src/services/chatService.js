import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

export const createConversation = async (senderId, receiverId) => {
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
        conversation = new Conversation({
            participants: [senderId, receiverId]
        });
        await conversation.save();
    }

    return conversation;
};

export const getConversation = async (userId) => {
    return await Conversation.find({
        participants: { $in: [userId] }
    })
        .populate("participants", "name email")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });
};

export const getMessages = async (conversationId) => {
    return await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
};

export const sendMessage = async (conversationId, senderId, receiverId, text) => {
    const message = new Message({
        conversation: conversationId,
        sender: senderId,
        receiver: receiverId,
        text
    });

    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id
    });

    return message;
};
