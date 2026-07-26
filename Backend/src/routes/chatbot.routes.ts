import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller";

export const chatbotRoutes = Router();

// POST /api/chatbot/:customerId
chatbotRoutes.post("/:customerId", chatbotController.sendMessage);