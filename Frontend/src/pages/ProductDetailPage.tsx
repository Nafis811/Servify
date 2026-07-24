import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { marketplaceProducts } from "../features/marketplace/marketplace.copy";
import type { MarketplaceProduct } from "../features/marketplace/marketplace.types";

const currency = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = useMemo(() => marketplaceProducts.find((item) => item.id === id) ?? null, [id]);

  if (!product) {
    return (
      <div className="detail-page">
        <div className="detail-card detail-empty">
          <p className="eyebrow">Marketplace</p>
          <h1>Produk tidak ditemukan</h1>
          <p>Produk yang diminta tidak tersedia di data saat ini.</p>
          <Link className="button button--primary" to="/marketplace">
            Kembali ke marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <section className="detail-card space-y-6">
        <h2 className="detail-title">Detail Produk</h2>

        <div className="detail-layout">
          <div className="detail-media">
            <div className="detail-media__card">
              <img className="detail-media__image" src={product.imageUrl} alt={product.name} />
            </div>
          </div>

          <div className="detail-info">
            <div className="space-y-4">
              <h1 className="detail-info__title">{product.name}</h1>
              <p className="detail-info__subtitle">
                {product.soldCount}+ Terjual • Rating <span className="rating">★ {product.rating.toFixed(1)}</span>
              </p>
              <p className="detail-info__price">Rp. {currency.format(product.price)}</p>
              <p className="detail-info__stock">
                Stock: <span style={{ color: "var(--success)", fontWeight: 700 }}>{product.stock}</span>
              </p>
            </div>

            <div className="detail-badges">
              <span className="badge badge--primary">{product.variant}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--muted)", fontSize: "0.875rem" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{product.location}</span>
              </div>
            </div>

            <div className="detail-actions">
              <Link className="button button--purple" to="#">
                Beli Langsung
              </Link>

              <div className="quantity-control" aria-label="Jumlah pembelian">
                <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((current) => current + 1)}>
                  +
                </button>
              </div>

              <button type="button" className="button button--primary">
                Beli
              </button>
            </div>
          </div>

          <div className="detail-panels">
            <section className="detail-panel">
              <h3>Deskripsi</h3>
              <p>{product.description}</p>
            </section>

            <section className="detail-panel">
              <h3>Toko / Merchant</h3>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--secondary-purple)", flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1M5 21h14M7 3h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" />
                </svg>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--primary-blue)", fontSize: "1.05rem" }}>
                    {product.merchant.businessName}
                  </p>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>{product.merchant.address}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

