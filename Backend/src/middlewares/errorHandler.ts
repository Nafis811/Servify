import { NextFunction, Request, Response } from "express";

// Class khusus buat error yang kita "sengaja" lempar (misal: "Mitra tidak ditemukan")
// Bedanya sama Error biasa: ada statusCode, jadi controller/middleware tau
// harus balikin response HTTP apa (404, 400, dll) bukan cuma 500 generic.
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware ini dipasang PALING TERAKHIR di index.ts.
// Setiap kali ada controller yang manggil next(err), request bakal
// "dilempar" ke sini, bukan lanjut ke middleware/route berikutnya.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
}

// Middleware ini nangkep request ke endpoint yang gak ke-daftar di routes manapun
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
}