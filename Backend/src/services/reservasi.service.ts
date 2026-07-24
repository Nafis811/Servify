import { prisma } from "../lib/prisma";
import { AppError } from "../middlewares/errorHandler";
import { StatusServis } from "@prisma/client";

export interface GetReservasiFilter {
  status?: StatusServis;
}

export interface UpdateStatusReservasiInput {
  statusBaru: StatusServis;
  catatan?: string;
}

export const reservasiService = {
  async getReservasiByMitra(mitraId: string, filter?: GetReservasiFilter) {
    return prisma.reservasiServis.findMany({
      where: {
        mitraId,
        ...(filter?.status && { statusServis: filter.status }),
      },
      include: {
        customer: {
          select: { id: true, nama: true, noHp: true, email: true },
        },
      },
      orderBy: { tanggalReservasi: "desc" },
    });
  },

  async getReservasiDetail(mitraId: string, reservasiId: string) {
    const reservasi = await prisma.reservasiServis.findUnique({
      where: { id: reservasiId },
      include: {
        customer: {
          select: { id: true, nama: true, noHp: true, email: true, alamat: true },
        },
        statusLog: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!reservasi) throw new AppError("Reservasi tidak ditemukan", 404);

    if (reservasi.mitraId !== mitraId) {
      throw new AppError("Kamu tidak punya akses ke reservasi ini", 403);
    }

    return reservasi;
  },

  async updateStatusReservasi(
    mitraId: string,
    reservasiId: string,
    data: UpdateStatusReservasiInput
  ) {
    await this.getReservasiDetail(mitraId, reservasiId);

    const [updatedReservasi] = await prisma.$transaction([
      prisma.reservasiServis.update({
        where: { id: reservasiId },
        data: { statusServis: data.statusBaru },
      }),
      prisma.reservasiStatusLog.create({
        data: {
          reservasiId,
          statusServis: data.statusBaru,
          catatan: data.catatan,
        },
      }),
    ]);

    return updatedReservasi;
  },
};
