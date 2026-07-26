import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";
import { uploadToCloudinary } from "../utils/cloudinary";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export interface RegisterMerchantInput {
  namaToko?: string;
  business_name?: string;
  pemilik?: string;
  email: string;
  password?: string;
  alamat?: string;
  address?: string;
  noHp?: string;
  phone?: string;
  jenisBadanUsaha?: string;
  business_type?: string;
  nomorIzinUsaha?: string;
  license_number?: string;
  fotoKtp?: string;
  fotoKtpUrl?: string;
}

export interface UpdateMerchantProfileInput {
  namaToko?: string;
  alamat?: string;
  noHp?: string;
  jamOperasional?: string;
  fotoTokoUrl?: string;
  fotoKtpUrl?: string;
  latitude?: number;
  longitude?: number;
}

export const merchantService = {
  async register(data: RegisterMerchantInput) {
    const email = data.email.trim().toLowerCase();
    const namaToko = data.namaToko || data.business_name;
    const alamat = data.alamat || data.address;
    const noHp = data.noHp || data.phone;
    const jenisBadanUsaha = data.jenisBadanUsaha || data.business_type;
    const nomorIzinUsaha = data.nomorIzinUsaha || data.license_number;
    const rawFotoKtp = data.fotoKtp || data.fotoKtpUrl;

    if (!namaToko) {
      throw new AppError("Nama usaha wajib diisi", 400);
    }
    if (!alamat) {
      throw new AppError("Alamat usaha wajib diisi", 400);
    }
    if (!noHp) {
      throw new AppError("Nomor telepon wajib diisi", 400);
    }
    if (!rawFotoKtp) {
      throw new AppError("Foto KTP wajib diunggah", 400);
    }

    // Check if email already registered as merchant
    try {
      const existing = await prisma.mitraPenyediaJasa.findUnique({
        where: { email },
      });

      if (existing) {
        throw new AppError("Anda sudah terdaftar sebagai merchant atau sedang dalam verifikasi.", 409);
      }

      // Upload KTP to Cloudinary
      const uploadedKtpUrl = await uploadToCloudinary(rawFotoKtp, "servify/ktp");

      const hashedPassword = data.password ? await bcrypt.hash(data.password, SALT_ROUNDS) : null;

      const mitra = await prisma.mitraPenyediaJasa.create({
        data: {
          namaToko,
          pemilik: data.pemilik || namaToko,
          email,
          password: hashedPassword,
          alamat,
          noHp,
          jenisBadanUsaha,
          nomorIzinUsaha,
          fotoKtpUrl: uploadedKtpUrl,
          statusVerifikasi: "MENUNGGU",
        },
      });

      const { password, ...mitraClean } = mitra;
      return mitraClean;
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      console.error("Prisma error in merchant register, using in-memory fallback if needed:", err);
      throw new AppError(err.message || "Gagal memproses pendaftaran merchant", 500);
    }
  },

  async getProfile(mitraId: string) {
    try {
      const mitra = await prisma.mitraPenyediaJasa.findUnique({
        where: { id: mitraId },
      });

      if (!mitra) throw new AppError("Mitra tidak ditemukan", 404);
      const { password, ...clean } = mitra;
      return clean;
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw new AppError("Mitra tidak ditemukan", 404);
    }
  },

  async getByEmail(email: string) {
    try {
      const mitra = await prisma.mitraPenyediaJasa.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!mitra) return null;
      const { password, ...clean } = mitra;
      return clean;
    } catch (err) {
      return null;
    }
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
    try {
      const [totalProduk, reservasiPending, totalTerjual] = await Promise.all([
        prisma.barang.count({ where: { mitraId } }),
        prisma.reservasiServis.count({ where: { mitraId, statusServis: "PENDING" } }),
        prisma.pembelianBarang.count({
          where: { barang: { mitraId }, statusPembelian: "SELESAI" },
        }),
      ]);

      return { totalProduk, reservasiPending, totalTerjual };
    } catch (err) {
      return { totalProduk: 0, reservasiPending: 0, totalTerjual: 0 };
    }
  },

  async listNearby(lat: number, lng: number, radiusKm = 10) {
    const mitraTerverifikasi = await prisma.mitraPenyediaJasa.findMany({
      where: {
        statusVerifikasi: "TERVERIFIKASI",
        latitude: { not: null },
        longitude: { not: null },
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
