import { prisma } from "../lib/prisma";
import type { AuthenticatedUser } from "../shared/types/express";

export const customerService = {
  // Dipanggil setiap kali user berhasil login/register lewat Supabase Auth.
  // "upsert": kalau row dengan id ini belum ada, bikin baru; kalau udah ada, update data terbarunya.
  // Ini yang bikin proses sync aman dipanggil berkali-kali (misal tiap login),
  // gak akan bikin duplikat atau error "id sudah ada".
  async syncFromAuth(authUser: AuthenticatedUser) {
    const customer = await prisma.customer.upsert({
      where: { id: authUser.id },
      update: {
        nama: authUser.name || authUser.email,
        email: authUser.email,
        noHp: authUser.phone || "",
      },
      create: {
        id: authUser.id,
        nama: authUser.name || authUser.email,
        email: authUser.email,
        noHp: authUser.phone || "",
        // password sengaja gak diisi (opsional) — auth beneran dihandle Supabase,
        // bukan Prisma, jadi kolom ini gak relevan buat customer yang sync dari Supabase
      },
    });

    return customer;
  },
};
