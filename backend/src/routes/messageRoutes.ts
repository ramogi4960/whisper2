import { Router } from "express";
import { getMessages } from "../controllers/messageController.ts";


const router = Router();

// get messages belonging to a certain chat
router.get("/chat:chatId", getMessages);

export default router;