import { Request, Response } from "express";
import { customerService } from "../services/customer.service";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../shared/errors/api-error";

export const customerController = {
  // POST /api/customer/sync
  // req.user di-set oleh authGuard, jadi kita PERCAYA id/email dari situ
  // (udah tervalidasi lewat token Supabase), bukan dari body request mentah.
  sync: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const customer = await customerService.syncFromAuth(req.user);
    res.status(200).json({ success: true, data: customer });
  }),
};
