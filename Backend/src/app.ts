import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { authRoutes } from "./modules/auth/auth.routes";
import { landingRoutes } from "./modules/landing/landing.routes";
import { marketplaceRoutes } from "./modules/marketplace/marketplace.routes";
import { errorHandler } from "./shared/middlewares/error-handler";
import { notFound } from "./shared/middlewares/not-found";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Servify API is running",
    data: {
      nodeEnv: env.nodeEnv,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/landing", landingRoutes);

app.use(notFound);
app.use(errorHandler);

