import { Router } from "express";
import { merchantController } from "../controllers/merchant.controller";
import { reservasiRoutes } from "./reservasi.routes";
import { barangController } from "../controllers/barang.controller";

export const merchantRoutes = Router();

merchantRoutes.post("/register", merchantController.register);
merchantRoutes.get("/status", merchantController.getStatusByEmail);
merchantRoutes.get("/nearby", merchantController.listNearby);
merchantRoutes.get("/:mitraId", merchantController.getProfile);
merchantRoutes.patch("/:mitraId", merchantController.updateProfile);
merchantRoutes.get("/:mitraId/dashboard", merchantController.getDashboardSummary);
merchantRoutes.post("/:mitraId/products", barangController.create);
merchantRoutes.get("/:mitraId/products", barangController.listByMitra);
merchantRoutes.get("/:mitraId/products/:barangId", barangController.getDetail);
merchantRoutes.patch("/:mitraId/products/:barangId", barangController.update);
merchantRoutes.delete("/:mitraId/products/:barangId", barangController.delete);
merchantRoutes.use("/:mitraId/reservasi", reservasiRoutes);