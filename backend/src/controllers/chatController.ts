import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../middleware/auth";
import { Chat } from "../models/Chat";
import { Types } from "mongoose";

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    // get chats for THIS user from the Chat model
    try {
        // find the user from req object
        const userId = req.userId;
        const chats = await Chat.find({ participants: userId }).
            sort({ lastMessageAt: -1 }).
            populate("participants", "name email avatar");

        // format chats to only include the other participant
        const formattedChats = chats.map(chat => {
            const otherParticipant = chat.participants.find(participant => participant._id.toString() !== userId);
            return {
                _id: chat._id,
                participant: otherParticipant ?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt
            }
        });

        res.json(formattedChats);

    } catch(error) {
        res.status(500); 
        next(error);
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;
        const participantId = req.params.participantId;

        if (!participantId) {
            return res.status(400).json({ message: "Participant ID is required" });
        }

        // if (!Types.ObjectId.isValid(participantId)) {
        //     return res.status(400).json({ message: "Invalid Participant ID" });
        // }

        if (participantId === userId) {
            return res.status(400).json({ message: "Cannot create chat with yourself" });
        }
        
        // Check if a chat already exists between the two users
        let chat = await Chat.findOne({ participants: { $all: [userId, participantId] } }).
            populate("participants", "name email avatar");

        if (!chat) {
            // If no chat exists, create a new one
            chat = new Chat({
                participants: [userId, participantId]
            });
            await chat.save();
            chat = await chat.populate("participants", "name email avatar");
        }

        const otherParticipant = chat.participants.find(participant => participant._id.toString() !== userId);
        
        res.json({
            _id: chat._id,
            participant: otherParticipant ?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt
        });

    } catch(error) {
        res.status(500);
        next(error);
    }
}