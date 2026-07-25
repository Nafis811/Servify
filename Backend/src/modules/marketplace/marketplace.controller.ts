import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/async-handler";
import { marketplaceService } from "./marketplace.service";
import { normalizeMarketplaceQuery } from "./marketplace.validation";

export class MarketplaceController {
  index = asyncHandler(async (req: Request, res: Response) => {
    const listing = marketplaceService.listProducts(normalizeMarketplaceQuery(req.query as Record<string, unknown>));

    res.status(200).json({
      success: true,
      message: "Marketplace products loaded",
      data: listing,
    });
  });

  show = asyncHandler(async (req: Request, res: Response) => {
    const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

    if (!slug) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    const product = marketplaceService.getProductBySlug(slug);

    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Product loaded",
      data: product,
    });
  });

  categories = asyncHandler(async (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Marketplace categories loaded",
      data: marketplaceService.getCategories(),
    });
  });
}

export const marketplaceController = new MarketplaceController();
