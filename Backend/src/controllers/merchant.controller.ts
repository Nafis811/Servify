import { Request, Response } from "express";
import { merchantService } from "../services/merchant.service";
import { asyncHandler } from "../utils/asyncHandler";

export const merchantController = {
  // POST /api/merchant/register
  register: asyncHandler(async (req: Request, res: Response) => {
    const mitra = await merchantService.register(req.body);
    res.status(201).json({ success: true, data: mitra });
  }),

  // GET /api/merchant/:mitraId
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const { mitraId } = req.params;
    const mitra = await merchantService.getProfile(mitraId);
    res.status(200).json({ success: true, data: mitra });
  }),

  // PATCH /api/merchant/:mitraId
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const { mitraId } = req.params;
    const updated = await merchantService.updateProfile(mitraId, req.body);
    res.status(200).json({ success: true, data: updated });
  }),

  // GET /api/merchant/:mitraId/dashboard
  getDashboardSummary: asyncHandler(async (req: Request, res: Response) => {
    const { mitraId } = req.params;
    const summary = await merchantService.getDashboardSummary(mitraId);
    res.status(200).json({ success: true, data: summary });
  }),
};
