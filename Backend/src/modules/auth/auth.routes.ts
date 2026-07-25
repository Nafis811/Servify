import { Router } from "express";
import { authGuard } from "../../shared/middlewares/auth-guard";
import { authController } from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", authGuard, authController.logout);
authRoutes.get("/me", authGuard, authController.me);

