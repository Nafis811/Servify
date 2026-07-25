import type { RequestHandler } from "express";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { ApiError } from "../errors/api-error";
import type { AuthenticatedUser } from "../types/express";

export const authGuard: RequestHandler = async (req, _res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    next(new ApiError(401, "Unauthorized"));
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    // Supabase yang validasi token ini (cek tanda tangan, expiry, dll) di server mereka.
    // Kita gak perlu tau algoritma/secret apa yang mereka pakai — ini yang bikin
    // pendekatan ini jauh lebih robust dibanding jwt.verify manual.
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      next(new ApiError(401, "Invalid or expired token"));
      return;
    }

    const metadata = data.user.user_metadata ?? {};
    const role: AuthenticatedUser["role"] = metadata.role === "admin" ? "admin" : "customer";

    req.user = {
      id: data.user.id,
      email: data.user.email ?? "",
      role,
      name: typeof metadata.name === "string" ? metadata.name : undefined,
      phone: typeof metadata.phone === "string" ? metadata.phone : undefined,
    };

    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
