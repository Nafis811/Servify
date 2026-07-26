import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export const adminService = {
  async ensureDefaultAdmin() {
    try {
      const adminCount = await prisma.administrator.count();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const now = new Date();
        await prisma.administrator.create({
          data: {
            id: randomUUID(),
            nama: "Super Admin Servify",
            email: "admin@servify.com",
            password: hashedPassword,
            updatedAt: now,
          },
        });
        console.log("✓ Default Admin created: admin@servify.com / admin123");
      }
    } catch (err) {
      console.warn("Could not seed default admin:", err);
    }
  },

  async getPendingMerchants() {
    try {
      const pendingMerchants = await prisma.mitraPenyediaJasa.findMany({
        where: { statusVerifikasi: "MENUNGGU" },
        orderBy: { createdAt: "desc" },
      });
      return pendingMerchants;
    } catch (err) {
      console.error("Error fetching pending merchants from Prisma:", err);
      return [];
    }
  },

  async getAllMerchants() {
    try {
      return await prisma.mitraPenyediaJasa.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.error("Error fetching merchants from Prisma:", err);
      return [];
    }
  },

  async approveMerchant(mitraId: string) {
    try {
      const merchant = await prisma.mitraPenyediaJasa.findUnique({
        where: { id: mitraId },
      });

      if (!merchant) {
        throw new AppError("Merchant tidak ditemukan", 404);
      }

      const updated = await prisma.mitraPenyediaJasa.update({
        where: { id: mitraId },
        data: { statusVerifikasi: "TERVERIFIKASI" },
      });

      // Also update matching customer if exists
      try {
        const customer = await prisma.customer.findUnique({
          where: { email: merchant.email },
        });
        if (customer) {
          await prisma.customer.update({
            where: { id: customer.id },
            data: { statusVerifikasi: "TERVERIFIKASI" },
          });
        }
      } catch (custErr) {
        console.warn("Could not sync customer verification status:", custErr);
      }

      return updated;
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(err.message || "Gagal menyetujui merchant", 500);
    }
  },

  async rejectMerchant(mitraId: string) {
    try {
      const merchant = await prisma.mitraPenyediaJasa.findUnique({
        where: { id: mitraId },
      });

      if (!merchant) {
        throw new AppError("Merchant tidak ditemukan", 404);
      }

      const updated = await prisma.mitraPenyediaJasa.update({
        where: { id: mitraId },
        data: { statusVerifikasi: "DITOLAK" },
      });

      return updated;
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError(err.message || "Gagal menolak merchant", 500);
    }
  },
};

