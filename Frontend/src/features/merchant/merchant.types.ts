export type StatusServis = "PENDING" | "DITERIMA" | "DIPROSES" | "SELESAI" | "DITOLAK";

export type StatusVerifikasi = "MENUNGGU" | "TERVERIFIKASI" | "DITOLAK";

export interface MerchantProfile {
  id: string;
  namaToko: string;
  pemilik: string;
  email: string;
  alamat: string;
  noHp: string;
  jamOperasional: string | null;
  fotoTokoUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  statusVerifikasi: StatusVerifikasi;
  createdAt: string;
}

export interface MerchantDashboardSummary {
  totalProduk: number;
  reservasiPending: number;
  totalTerjual: number;
}

export interface ReservasiCustomer {
  nama: string;
  email: string;
}

export interface ReservasiServis {
  id: string;
  customerId: string;
  mitraId: string;
  namaCustomer: string;
  noTelp: string;
  modelLaptop: string;
  tipeServis: string;
  deskripsiKeluhan: string;
  tanggalReservasi: string;
  estimasiBiaya: number | null;
  statusServis: StatusServis;
  createdAt: string;
  customer?: ReservasiCustomer;
}

export interface ReservasiStatusLog {
  id: string;
  statusServis: StatusServis;
  catatan: string | null;
  createdAt: string;
}

export interface ReservasiDetail extends ReservasiServis {
  statusLog: ReservasiStatusLog[];
}

export interface UpdateStatusInput {
  statusServis: StatusServis;
  catatan?: string;
  estimasiBiaya?: number;
}

export interface Barang {
  id: string;
  mitraId: string;
  namaBarang: string;
  harga: number;
  stok: number;
  deskripsi: string | null;
  gambarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBarangInput {
  namaBarang: string;
  harga: number;
  stok: number;
  deskripsi?: string;
  gambarUrl?: string;
}

export interface NearbyMerchant {
  id: string;
  namaToko: string;
  alamat: string;
  noHp: string;
  latitude: number;
  longitude: number;
  jarakKm: number;
}