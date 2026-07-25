import { Router } from "express";
import { landingController } from "./landing.controller";

export const landingRoutes = Router();

landingRoutes.get("/home", landingController.home);
landingRoutes.get("/navbar", landingController.navbar);

