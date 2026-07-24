import { Request, Response } from "express";
import { chatbotService } from "../services/chatbot.service";
import { asyncHandler } from "../utils/asyncHandler";

export const chatbotController = {
  // POST /api/customer/:customerId/chatbot
  // body: { pesan: string, lokasi?: { latitude: number, longitude: number } }
  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const { pesan, lokasi } = req.body;

    const hasil = await chatbotService.sendMessage(customerId, pesan, lokasi);
    res.status(200).json({ success: true, data: hasil });
  }),
};