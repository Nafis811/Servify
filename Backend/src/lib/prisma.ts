import { PrismaClient } from "@prisma/client";

// Kenapa perlu "singleton" kayak gini?
// Kalau kita new PrismaClient() di banyak file, tiap file bakal buka koneksi
// sendiri ke database. Apalagi pas dev mode (tsx watch) hot-reload terus,
// koneksi bisa numpuk dan bikin database penuh/lambat.
// Solusinya: bikin SATU instance aja, simpan di variabel global, dipakai bareng.

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma = global.prismaGlobal ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}