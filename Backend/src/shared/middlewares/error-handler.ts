import type { ErrorRequestHandler } from "express";
import { ApiError } from "../errors/api-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.details,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

