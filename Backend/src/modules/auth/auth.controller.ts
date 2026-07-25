import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { authService } from "./auth.service";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const session = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: session,
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const session = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: session,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    await authService.logout(req.user.id);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const user = await authService.me(req.user.id);

    res.status(200).json({
      success: true,
      message: "Current session",
      data: user,
    });
  });
}

export const authController = new AuthController();

