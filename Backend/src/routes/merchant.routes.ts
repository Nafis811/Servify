 import { Router } from "express";
import { merchantController } from "../controllers/merchant.controller";
import { reservasiRoutes } from "./reservasi.routes";

export const merchantRoutes = Router();

// POST /api/merchant/register
merchantRoutes.post("/register", merchantController.register);

// GET /api/merchant/:mitraId
merchantRoutes.get("/:mitraId", merchantController.getProfile);

// PATCH /api/merchant/:mitraId
merchantRoutes.patch("/:mitraId", merchantController.updateProfile);

// GET /api/merchant/:mitraId/dashboard
merchantRoutes.get("/:mitraId/dashboard", merchantController.getDashboardSummary);

// Semua route reservasi ditempel di sini — jadi otomatis jadi
// /api/merchant/:mitraId/reservasi/... tanpa perlu ditulis ulang path-nya
merchantRoutes.use("/:mitraId/reservasi", reservasiRoutes);