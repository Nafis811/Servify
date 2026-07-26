import { Request, Response } from "express";
import { merchantService } from "../services/merchant.service";
import { asyncHandler } from "../utils/asyncHandler";

export const merchantController = {
  // POST /api/merchant/register
  register: asyncHandler(async (req: Request, res: Response) => {
    const mitra = await merchantService.register(req.body);
    res.status(201).json({ success: true, data: mitra });
  }),

  // GET /api/merchant/status?email=...
  getStatusByEmail: asyncHandler(async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).json({ success: false, message: "Parameter email wajib diisi" });
      return;
    }
    const mitra = await merchantService.getByEmail(email);
    res.status(200).json({ success: true, data: mitra });
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

  // GET /api/merchant/nearby?lat=...&lng=...
  listNearby: asyncHandler(async (req: Request, res: Response) => {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = req.query.radius ? parseFloat(req.query.radius as string) : undefined;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      res.status(400).json({ success: false, message: "Parameter lat & lng wajib diisi angka" });
      return;
    }

    const data = await merchantService.listNearby(lat, lng, radius);
    res.status(200).json({ success: true, data });
  }),
};
