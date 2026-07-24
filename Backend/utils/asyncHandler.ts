import { Request, Response, NextFunction, RequestHandler } from "express";

// Wrapper generik: bungkus fungsi controller yang async,
// otomatis tangkep kalau ada Promise yang reject (error),
// terus lempar ke next(err) -> ditangkep errorHandler.ts.
// Tanpa ini, tiap controller harus nulis try/catch manual satu-satu.
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}