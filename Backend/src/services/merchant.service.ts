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

  async listNearby(lat: number, lng: number, radiusKm = 10) {
    const mitraTerverifikasi = await prisma.mitraPenyediaJasa.findMany({
      where: {
        statusVerifikasi: "TERVERIFIKASI",
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        namaToko: true,
        pemilik: true,
        alamat: true,
        noHp: true,
        latitude: true,
        longitude: true,
        jamOperasional: true,
        fotoTokoUrl: true,
        statusVerifikasi: true,
      },
    });

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    return mitraTerverifikasi
      .map((m) => ({
        ...m,
        jarakKm: haversine(lat, lng, m.latitude!, m.longitude!),
      }))
      .filter((m) => m.jarakKm <= radiusKm)
      .sort((a, b) => a.jarakKm - b.jarakKm);
  },
};
