import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { ApiError } from "../errors/api-error";
import type { AuthenticatedUser } from "../types/express";

interface AccessTokenPayload {
  sub: string;
  email: string;
  role: AuthenticatedUser["role"];
  tokenType: "access";
}

export const authGuard: RequestHandler = (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new ApiError(401, "Unauthorized"));
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

