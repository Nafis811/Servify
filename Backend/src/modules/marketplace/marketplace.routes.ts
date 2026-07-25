import { Router } from "express";
import { marketplaceController } from "./marketplace.controller";

export const marketplaceRoutes = Router();

marketplaceRoutes.get("/products", marketplaceController.index);
marketplaceRoutes.get("/products/:slug", marketplaceController.show);
marketplaceRoutes.get("/categories", marketplaceController.categories);

