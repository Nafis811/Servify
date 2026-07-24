import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export interface RegisterMerchantInput {
  namaToko: string;
  pemilik: string;
  email: string;
  password: string;
  alamat: string;
  noHp: string;
  jenisBadanUsaha?: string;
  nomorIzinUsaha?: string;
}

export interface UpdateMerchantProfileInput {
  namaToko?: string;
  alamat?: string;
  noHp?: string;
  jamOperasional?: string;
  fotoTokoUrl?: string;
  latitude?: number;
  longitude?: number;
}

export const merchantService = {
  async register(data: RegisterMerchantInput) {
    const existing = await prisma.mitraPenyediaJasa.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError("Email sudah terdaftar sebagai mitra", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const mitra = await prisma.mitraPenyediaJasa.create({
      data: {
        ...data,
        password: hashedPassword,
        statusVerifikasi: "MENUNGGU",
      },
    });

    const { password, ...mitraTanpaPassword } = mitra;
    return mitraTanpaPassword;
  },

  async getProfile(mitraId: string) {
    const mitra = await prisma.mitraPenyediaJasa.findUnique({
      where: { id: mitraId },
      select: {
        id: true,
        namaToko: true,
        pemilik: true,
        email: true,
        alamat: true,
        noHp: true,
        jamOperasional: true,
        fotoTokoUrl: true,
        latitude: true,
        longitude: true,
        statusVerifikasi: true,
        createdAt: true,
      },
    });

    if (!mitra) throw new AppError("Mitra tidak ditemukan", 404);
    return mitra;
  },

  async updateProfile(mitraId: string, data: UpdateMerchantProfileInput) {
    await this.getProfile(mitraId);

    const updated = await prisma.mitraPenyediaJasa.update({
      where: { id: mitraId },
      data,
    });

    const { password, ...updatedTanpaPassword } = updated;
    return updatedTanpaPassword;
  },

  async getDashboardSummary(mitraId: string) {
    const [totalProduk, reservasiPending, totalTerjual] = await Promise.all([
      prisma.barang.count({ where: { mitraId } }),
      prisma.reservasiServis.count({ where: { mitraId, statusServis: "PENDING" } }),
      prisma.pembelianBarang.count({
        where: { barang: { mitraId }, statusPembelian: "SELESAI" },
      }),
    ]);

    return { totalProduk, reservasiPending, totalTerjual };
  },
};
