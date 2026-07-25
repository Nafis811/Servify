import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { landingService } from "./landing.service";

export class LandingController {
  home = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Landing page content loaded",
      data: landingService.getHomePage(),
    });
  });

  navbar = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Navbar content loaded",
      data: landingService.getNavbar(),
    });
  });
}

export const landingController = new LandingController();

