-- CreateEnum
CREATE TYPE "StatusVerifikasi" AS ENUM ('MENUNGGU', 'TERVERIFIKASI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusServis" AS ENUM ('PENDING', 'DITERIMA', 'DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "StatusPembelian" AS ENUM ('PENDING', 'LUNAS', 'DIKIRIM', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "TipeServis" AS ENUM ('DIAGNOSA', 'PERBAIKAN_HARDWARE', 'PERBAIKAN_SOFTWARE', 'UPGRADE_KOMPONEN', 'LAINNYA');

-- CreateTable
CREATE TABLE "administrators" (
    "admin_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "administrators_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "customer_id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alamat" TEXT,
    "no_hp" TEXT NOT NULL,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'MENUNGGU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "verifikasi_customer" (
    "verifikasi_customer_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'MENUNGGU',
    "tanggal_verifikasi" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifikasi_customer_pkey" PRIMARY KEY ("verifikasi_customer_id")
);

-- CreateTable
CREATE TABLE "mitra_penyedia_jasa" (
    "mitra_id" TEXT NOT NULL,
    "nama_toko" TEXT NOT NULL,
    "pemilik" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "jenis_badan_usaha" TEXT,
    "nomor_izin_usaha" TEXT,
    "foto_toko_url" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "jam_operasional" TEXT,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'MENUNGGU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mitra_penyedia_jasa_pkey" PRIMARY KEY ("mitra_id")
);

-- CreateTable
CREATE TABLE "verifikasi_mitra" (
    "verifikasi_mitra_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "mitra_id" TEXT NOT NULL,
    "status_verifikasi" "StatusVerifikasi" NOT NULL DEFAULT 'MENUNGGU',
    "tanggal_verifikasi" TIMESTAMP(3),
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verifikasi_mitra_pkey" PRIMARY KEY ("verifikasi_mitra_id")
);

-- CreateTable
CREATE TABLE "reservasi_servis" (
    "reservasi_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "mitra_id" TEXT NOT NULL,
    "nama_customer" TEXT NOT NULL,
    "no_telp" TEXT NOT NULL,
    "model_laptop" TEXT NOT NULL,
    "tipe_servis" "TipeServis" NOT NULL DEFAULT 'LAINNYA',
    "deskripsi_keluhan" TEXT NOT NULL,
    "tanggal_reservasi" TIMESTAMP(3) NOT NULL,
    "estimasi_biaya" DECIMAL(12,2),
    "status_servis" "StatusServis" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservasi_servis_pkey" PRIMARY KEY ("reservasi_id")
);

-- CreateTable
CREATE TABLE "reservasi_status_log" (
    "id" TEXT NOT NULL,
    "reservasi_id" TEXT NOT NULL,
    "status_servis" "StatusServis" NOT NULL,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservasi_status_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_bot" (
    "chat_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "pesan_customer" TEXT NOT NULL,
    "balasan_chatbot" TEXT NOT NULL,
    "intent" TEXT,
    "waktu_chat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_bot_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "barang" (
    "barang_id" TEXT NOT NULL,
    "mitra_id" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "harga" DECIMAL(12,2) NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "deskripsi" TEXT,
    "gambar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("barang_id")
);

-- CreateTable
CREATE TABLE "pembelian_barang" (
    "pembelian_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "barang_id" TEXT NOT NULL,
    "tanggal_pembelian" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlah" INTEGER NOT NULL,
    "total_harga" DECIMAL(12,2) NOT NULL,
    "status_pembelian" "StatusPembelian" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "pembelian_barang_pkey" PRIMARY KEY ("pembelian_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "administrators_email_key" ON "administrators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mitra_penyedia_jasa_email_key" ON "mitra_penyedia_jasa"("email");

-- CreateIndex
CREATE INDEX "reservasi_servis_mitra_id_status_servis_idx" ON "reservasi_servis"("mitra_id", "status_servis");

-- AddForeignKey
ALTER TABLE "verifikasi_customer" ADD CONSTRAINT "verifikasi_customer_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "administrators"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifikasi_customer" ADD CONSTRAINT "verifikasi_customer_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifikasi_mitra" ADD CONSTRAINT "verifikasi_mitra_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "administrators"("admin_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verifikasi_mitra" ADD CONSTRAINT "verifikasi_mitra_mitra_id_fkey" FOREIGN KEY ("mitra_id") REFERENCES "mitra_penyedia_jasa"("mitra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservasi_servis" ADD CONSTRAINT "reservasi_servis_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservasi_servis" ADD CONSTRAINT "reservasi_servis_mitra_id_fkey" FOREIGN KEY ("mitra_id") REFERENCES "mitra_penyedia_jasa"("mitra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservasi_status_log" ADD CONSTRAINT "reservasi_status_log_reservasi_id_fkey" FOREIGN KEY ("reservasi_id") REFERENCES "reservasi_servis"("reservasi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_bot" ADD CONSTRAINT "chat_bot_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_mitra_id_fkey" FOREIGN KEY ("mitra_id") REFERENCES "mitra_penyedia_jasa"("mitra_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembelian_barang" ADD CONSTRAINT "pembelian_barang_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pembelian_barang" ADD CONSTRAINT "pembelian_barang_barang_id_fkey" FOREIGN KEY ("barang_id") REFERENCES "barang"("barang_id") ON DELETE RESTRICT ON UPDATE CASCADE;
