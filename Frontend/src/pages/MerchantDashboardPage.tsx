import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMerchantDashboardSummary, listMerchantProducts } from "../features/merchant/merchant.api";
import type { Barang, MerchantDashboardSummary } from "../features/merchant/merchant.types";
import { getMitraId } from "../features/merchant/merchant.session";
import "../styles/merchant.css";

export function MerchantDashboardPage() {
  const [summary, setSummary] = useState<MerchantDashboardSummary | null>(null);
  const [products, setProducts] = useState<Barang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const mitraId = getMitraId();

    if (!mitraId) {
      setErrorMessage("Kamu belum login sebagai merchant.");
      setIsLoading(false);
      return;
    }

    Promise.all([getMerchantDashboardSummary(mitraId), listMerchantProducts(mitraId)])
      .then(([summaryData, productsData]) => {
        setSummary(summaryData);
        setProducts(productsData.slice(0, 5)); // tampilkan 5 produk terbaru saja
      })
      .catch((error: Error) => setErrorMessage(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="page-container merchant-page">
      <div className="merchant-header">
        <h1 className="merchant-title">Dashboard Merchant</h1>
      </div>

      {errorMessage && <p className="auth-message auth-message--error">{errorMessage}</p>}

      {isLoading ? (
        <p>Memuat data dashboard...</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div>
                <p className="stat-card__label">Total Produk</p>
                <p className="stat-card__value">{summary?.totalProduk ?? 0}</p>
              </div>
              <div className="stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                </svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="action-grid">
            <div className="action-card action-card--blue">
              <div>
                <h3>Tambah Produk</h3>
                <p>Tambahkan produk baru ke marketplace</p>
                <Link to="/merchant/products/add" className="action-card__cta">
                  + Tambah Produk
                </Link>
              </div>
            </div>

            <div className="action-card action-card--green">
              <div>
                <h3>Kelola Reservasi</h3>
                <p>Lihat dan kelola reservasi service</p>
                <Link to="/merchant/reservations" className="action-card__cta">
                  Lihat Reservasi
                </Link>
              </div>
            </div>
          </div>

          <div className="merchant-table-wrap">
            <div className="merchant-table-header">
              <h2>Produk Terbaru</h2>
              <Link to="/merchant/products">Lihat Semua →</Link>
            </div>

            {products.length === 0 ? (
              <div className="merchant-empty">
                <p>Belum ada produk. Tambahkan produk pertama kamu!</p>
                <Link to="/merchant/products/add" className="btn-action btn-primary">
                  + Tambah Produk
                </Link>
              </div>
            ) : (
              <table className="merchant-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.namaBarang}</strong>
                      </td>
                      <td>Rp {product.harga.toLocaleString("id-ID")}</td>
                      <td>{product.stok}</td>
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