import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";

export interface CreateBarangInput {
  namaBarang: string;
  harga: number;
  stok: number;
  deskripsi?: string;
  gambarUrl?: string;
}

export interface UpdateBarangInput {
  namaBarang?: string;
  harga?: number;
  stok?: number;
  deskripsi?: string;
  gambarUrl?: string;
}

export const barangService = {
  // Dipakai di form "Tambah Produk Baru"
  async create(mitraId: string, data: CreateBarangInput) {
    const mitra = await prisma.mitraPenyediaJasa.findUnique({ where: { id: mitraId } });
    if (!mitra) throw new AppError("Mitra tidak ditemukan", 404);

    return prisma.barang.create({
      data: {
        ...data,
        mitraId,
      },
    });
  },

  // Dipakai di tabel "Produk Terbaru" pada Dashboard, dan halaman "Semua Produk"
  async listByMitra(mitraId: string) {
    return prisma.barang.findMany({
      where: { mitraId },
      orderBy: { createdAt: "desc" },
    });
  },

  async getDetail(barangId: string, mitraId: string) {
    const barang = await prisma.barang.findFirst({
      where: { id: barangId, mitraId },
    });
    if (!barang) throw new AppError("Produk tidak ditemukan", 404);
    return barang;
  },

  async update(barangId: string, mitraId: string, data: UpdateBarangInput) {
    await this.getDetail(barangId, mitraId); // mastiin produk itu punya mitra ini
    return prisma.barang.update({
      where: { id: barangId },
      data,
    });
  },

  async delete(barangId: string, mitraId: string) {
    await this.getDetail(barangId, mitraId);
    return prisma.barang.delete({ where: { id: barangId } });
  },
};