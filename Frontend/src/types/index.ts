export interface Mitra {
  id: string;
  namaToko: string;
  pemilik: string;
  email: string;
  alamat: string;
  noHp: string;
  jenisBadanUsaha?: string | null;
  nomorIzinUsaha?: string | null;
  fotoTokoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  jamOperasional?: string | null;
  statusVerifikasi: "MENUNGGU" | "TERVERIFIKASI" | "DITOLAK";
  createdAt: string;
}

export interface DashboardSummary {
  totalProduk: number;
  reservasiPending: number;
  totalTerjual: number;
}

export type StatusServis = "PENDING" | "DITERIMA" | "DIPROSES" | "SELESAI" | "DITOLAK";

export interface Customer {
  id: string;
  nama: string;
  noHp: string;
  email: string;
  alamat?: string;
}

export interface ReservasiStatusLog {
  id: string;
  reservasiId: string;
  statusServis: StatusServis;
  catatan: string | null;
  createdAt: string;
}

export interface Reservasi {
  id: string;
  customerId: string;
  mitraId: string;
  namaCustomer: string;
  noTelp: string;
  modelLaptop: string;
  tipeServis: string;
  deskripsiKeluhan: string;
  tanggalReservasi: string;
  estimasiBiaya: string | null;
  statusServis: StatusServis;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  statusLog?: ReservasiStatusLog[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
