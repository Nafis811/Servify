import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { asyncHandler } from "../utils/asyncHandler";

export const adminController = {
  // GET /api/admin/pending-merchants
  getPendingMerchants: asyncHandler(async (_req: Request, res: Response) => {
    const merchants = await adminService.getPendingMerchants();
    res.status(200).json({ success: true, data: merchants });
  }),

  // GET /api/admin/merchants
  getAllMerchants: asyncHandler(async (_req: Request, res: Response) => {
    const merchants = await adminService.getAllMerchants();
    res.status(200).json({ success: true, data: merchants });
  }),

  // POST /api/admin/merchants/:id/approve
  approveMerchant: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.approveMerchant(id);
    res.status(200).json({
      success: true,
      message: "Merchant berhasil disetujui.",
      data: result,
    });
  }),

  // POST /api/admin/merchants/:id/reject
  rejectMerchant: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.rejectMerchant(id);
    res.status(200).json({
      success: true,
      message: "Permintaan merchant ditolak.",
      data: result,
    });
  }),
};
