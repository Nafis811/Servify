import { Request, Response } from "express";
import { reservasiService } from "../services/reservasi.service";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusServis } from "@prisma/client";

export const reservasiController = {
  // GET /api/merchant/:mitraId/reservasi
  // GET /api/merchant/:mitraId/reservasi?status=PENDING
  getReservasiByMitra: asyncHandler(async (req: Request, res: Response) => {
    const { mitraId } = req.params;
    const status = req.query.status as StatusServis | undefined;

    const reservasi = await reservasiService.getReservasiByMitra(mitraId, {
      status,
    });
    res.status(200).json({ success: true, data: reservasi });
  }),

  // GET /api/merchant/:mitraId/reservasi/:reservasiId
  getReservasiDetail: asyncHandler(async (req: Request, res: Response) => {
    const { mitraId, reservasiId } = req.params;

    const reservasi = await reservasiService.getReservasiDetail(mitraId, reservasiId);
    res.status(200).json({ success: true, data: reservasi });
  }),

  // PATCH /api/merchant/:mitraId/reservasi/:reservasiId/status
  updateStatusReservasi: asyncHandler(async (req: Request, res: Response) => {
    const { mitraId, reservasiId } = req.params;
    const { statusBaru, catatan } = req.body;

    const updated = await reservasiService.updateStatusReservasi(mitraId, reservasiId, {
      statusBaru,
      catatan,
    });
    res.status(200).json({ success: true, data: updated });
  }),
};
