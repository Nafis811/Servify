import { Router } from "express";
import { customerController } from "../controllers/customer.controller";
import { authGuard } from "../shared/middlewares/auth-guard";

export const customerRoutes = Router();

customerRoutes.post("/sync", authGuard, customerController.sync);
