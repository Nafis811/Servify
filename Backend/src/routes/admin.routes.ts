import { Router } from "express";
import { adminController } from "../controllers/admin.controller";

export const adminRoutes = Router();

adminRoutes.get("/pending-merchants", adminController.getPendingMerchants);
adminRoutes.get("/merchants", adminController.getAllMerchants);
adminRoutes.post("/merchants/:id/approve", adminController.approveMerchant);
adminRoutes.post("/merchants/:id/reject", adminController.rejectMerchant);
