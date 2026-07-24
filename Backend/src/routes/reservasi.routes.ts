import { Router } from "express";
import { reservasiController } from "../controllers/reservasi.controller";

// mergeParams: true — WAJIB di sini, karena router ini nanti "ditempel"
// ke dalam merchant.routes.ts di path /:mitraId/reservasi.
// Tanpa ini, req.params.mitraId bakal undefined pas diakses dari controller,
// soalnya secara default tiap Router() punya scope params sendiri-sendiri.
export const reservasiRoutes = Router({ mergeParams: true });

// GET /api/merchant/:mitraId/reservasi
// GET /api/merchant/:mitraId/reservasi?status=PENDING
reservasiRoutes.get("/", reservasiController.getReservasiByMitra);

// GET /api/merchant/:mitraId/reservasi/:reservasiId
reservasiRoutes.get("/:reservasiId", reservasiController.getReservasiDetail);

// PATCH /api/merchant/:mitraId/reservasi/:reservasiId/status
reservasiRoutes.patch("/:reservasiId/status", reservasiController.updateStatusReservasi);