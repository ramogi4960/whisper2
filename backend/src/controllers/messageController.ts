import type { Response, NextFunction } from "express";
import { type AuthRequest } from "../middleware/auth";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const { chatId } = req.params;
        const userId = req.userId;
        const chat = await Chat.findOne({ _id: chatId, participants: userId });
        if (!chat) {
            return res.status(400).json({ message: "Chat not found" });
        }
        const messages = await Message.find({ chat: chatId }).populate("sender", "name email avatar").sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        next(error);
    }
}