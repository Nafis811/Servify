import { NextFunction, Request, Response } from "express";
import { barangService } from "../services/barang.service";

export const barangController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { mitraId } = req.params;
      const barang = await barangService.create(mitraId, req.body);
      res.status(201).json({ success: true, data: barang });
    } catch (err) {
      next(err);
    }
  },

  async listByMitra(req: Request, res: Response, next: NextFunction) {
    try {
      const { mitraId } = req.params;
      const data = await barangService.listByMitra(mitraId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { mitraId, barangId } = req.params;
      const data = await barangService.getDetail(barangId, mitraId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { mitraId, barangId } = req.params;
      const data = await barangService.update(barangId, mitraId, req.body);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { mitraId, barangId } = req.params;
      await barangService.delete(barangId, mitraId);
      res.json({ success: true, message: "Produk berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },
};