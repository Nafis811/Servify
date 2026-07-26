import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  TrendingUp,
  Plus,
  CalendarCheck,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { getStoredSession } from "../features/auth/auth.session";
import {
  getMerchantDashboardSummary,
  getMerchantStatusByEmail,
  listMerchantProducts,
  listMerchantReservasi,
} from "../features/merchant/merchant.api";
import type {
  Barang,
  MerchantDashboardSummary,
  MerchantProfile,
  ReservasiServis,
} from "../features/merchant/merchant.types";
import { getMitraId, setMitraId } from "../features/merchant/merchant.session";
import "../styles/merchant.css";

const currency = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  DITERIMA: "Diterima",
  DIPROSES: "Diproses",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "status-badge--pending",
  DITERIMA: "status-badge--diterima",
  DIPROSES: "status-badge--diproses",
  SELESAI: "status-badge--selesai",
  DITOLAK: "status-badge--ditolak",
};

export function MerchantDashboardPage() {
  const navigate = useNavigate();
  const session = getStoredSession();

  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [summary, setSummary] = useState<MerchantDashboardSummary | null>(null);
  const [products, setProducts] = useState<Barang[]>([]);
  const [recentReservasi, setRecentReservasi] = useState<ReservasiServis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function initDashboard() {
      try {
        setIsLoading(true);
        const email = session?.user?.email;

        if (!email) {
          setErrorMessage("Kamu belum login. Silakan login terlebih dahulu.");
          setIsLoading(false);
          return;
        }

        const mProfile = await getMerchantStatusByEmail(email);

        if (!mProfile) {
          navigate("/merchant/info");
          return;
        }

        setMerchant(mProfile);
        setMitraId(mProfile.id);

        if (mProfile.statusVerifikasi === "MENUNGGU") {
          navigate("/merchant/waiting");
          return;
        }

        if (mProfile.statusVerifikasi === "DITOLAK") {
          setErrorMessage("Permintaan pendaftaran merchant Anda ditolak oleh Admin.");
          setIsLoading(false);
          return;
        }

        // Status TERVERIFIKASI — load semua data paralel
        const [summaryData, productsData, reservasiData] = await Promise.all([
          getMerchantDashboardSummary(mProfile.id).catch(() => ({
            totalProduk: 0,
            reservasiPending: 0,
            totalTerjual: 0,
          })),
          listMerchantProducts(mProfile.id).catch(() => []),
          listMerchantReservasi(mProfile.id).catch(() => []),
        ]);

        setSummary(summaryData);
        setProducts(productsData.slice(0, 5));
        // Ambil 5 reservasi terbaru
        setRecentReservasi(
          [...reservasiData]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
        );
      } catch (err: any) {
        setErrorMessage(err?.message || "Gagal memuat dashboard merchant.");
      } finally {
        setIsLoading(false);
      }
    }

    initDashboard();
  }, [session?.user?.email, navigate]);

  return (
    <div className="page-container merchant-page">
      {/* Header */}
      <div className="merchant-header flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="merchant-title">Dashboard Merchant</h1>
          {merchant && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {merchant.namaToko} •{" "}
              <span style={{ color: "#10b981", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <CheckCircle size={14} /> Terverifikasi
              </span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link to="/merchant/products/add" className="btn-action btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Plus size={16} /> Tambah Produk
          </Link>
        </div>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="bg-red-100 dark:bg-red-950/60 border border-red-300 text-red-800 dark:text-red-300 p-4 rounded-xl text-sm mb-6">
          <p>{errorMessage}</p>
          <div className="mt-3">
            <Link to="/merchant/info" className="font-bold underline">
              Daftar Merchant Kembali →
            </Link>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="p-8 text-center text-slate-500">Memuat data dashboard merchant...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card">
              <div>
                <p className="stat-card__label">Total Produk</p>
                <p className="stat-card__value">{summary?.totalProduk ?? 0}</p>
              </div>
              <div className="stat-card__icon">
                <Package size={24} />
              </div>
            </div>

            <div className="stat-card stat-card--warning">
              <div>
                <p className="stat-card__label">Reservasi Pending</p>
                <p className="stat-card__value stat-card__value--warning">
                  {summary?.reservasiPending ?? 0}
                </p>
              </div>
              <div className="stat-card__icon">
                <Clock size={24} />
              </div>
            </div>

            <div className="stat-card stat-card--success">
              <div>
                <p className="stat-card__label">Total Terjual</p>
                <p className="stat-card__value stat-card__value--success">
                  {summary?.totalTerjual ?? 0}
                </p>
              </div>
              <div className="stat-card__icon">
                <TrendingUp size={24} />
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="action-grid">
            <div className="action-card action-card--blue">
              <div>
                <h3>Tambah Produk</h3>
                <p>Tambahkan produk baru ke marketplace</p>
                <Link to="/merchant/products/add" className="action-card__cta" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <Plus size={16} /> Tambah Produk
                </Link>
              </div>
            </div>

            <div className="action-card action-card--green">
              <div>
                <h3>Kelola Reservasi</h3>
                <p>Lihat dan kelola reservasi service</p>
                <Link to="/merchant/reservations" className="action-card__cta" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <CalendarCheck size={16} /> Lihat Reservasi
                </Link>
              </div>
            </div>
          </div>

          {/* Produk Terbaru */}
          <div className="merchant-table-wrap">
            <div className="merchant-table-header">
              <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Package size={18} /> Produk Terbaru
              </h2>
              <Link to="/marketplace" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Lihat di Marketplace <ArrowRight size={14} />
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="merchant-empty">
                <p>Belum ada produk. Tambahkan produk pertama kamu!</p>
                <Link to="/merchant/products/add" className="btn-action btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  <Plus size={16} /> Tambah Produk
                </Link>
              </div>
            ) : (
              <table className="merchant-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Terjual</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          {product.gambarUrl && (
                            <img
                              src={product.gambarUrl}
                              alt={product.namaBarang}
                              style={{ width: 40, height: 40, borderRadius: "0.5rem", objectFit: "cover" }}
                            />
                          )}
                          <strong>{product.namaBarang}</strong>
                        </div>
                      </td>
                      <td>Rp {currency.format(Number(product.harga))}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            Number(product.stok) > 10
                              ? "status-badge--selesai"
                              : "status-badge--ditolak"
                          }`}
                        >
                          {product.stok}
                        </span>
                      </td>
                      <td>—</td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#f59e0b", fontWeight: 600 }}>
                          <Star size={14} fill="#f59e0b" /> —
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Reservasi Terbaru */}
          <div className="merchant-table-wrap" style={{ marginTop: "1.5rem" }}>
            <div className="merchant-table-header">
              <h2 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CalendarCheck size={18} /> Reservasi Terbaru
              </h2>
              <Link to="/merchant/reservations" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                Lihat Semua <ArrowRight size={14} />
              </Link>
            </div>

            {recentReservasi.length === 0 ? (
              <div className="merchant-empty">
                <p>Belum ada reservasi masuk.</p>
              </div>
            ) : (
              <table className="merchant-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Model Laptop</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReservasi.map((reservasi) => (
                    <tr key={reservasi.id}>
                      <td>
                        <strong>{reservasi.namaCustomer}</strong>
                        <br />
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                          {reservasi.noTelp}
                        </span>
                      </td>
                      <td>{reservasi.modelLaptop}</td>
                      <td>
                        {new Date(reservasi.tanggalReservasi).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        <span className={`status-badge ${STATUS_CLASS[reservasi.statusServis] ?? ""}`}>
                          {STATUS_LABEL[reservasi.statusServis] ?? reservasi.statusServis}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/merchant/reservations/${reservasi.id}`}
                          className="btn-table btn-table--secondary"
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                        >
                          Detail <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}