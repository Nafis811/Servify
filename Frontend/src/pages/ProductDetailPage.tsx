import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, MapPin, Store, ArrowLeft, Package } from "lucide-react";
import { getMarketplaceProduct } from "../features/marketplace/marketplace.api";
import type { MarketplaceProduct } from "../features/marketplace/marketplace.types";

const currency = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function ProductDetailPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setIsLoading(false); return; }
    setIsLoading(true);
    getMarketplaceProduct(id)
      .then((data) => {
        if (data) setProduct(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="detail-page">
        <div className="detail-card detail-empty">
          <p style={{ color: "var(--muted)" }}>Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="detail-page">
        <div className="detail-card detail-empty">
          <Package size={48} style={{ opacity: 0.3, margin: "0 auto 1rem" }} />
          <p className="eyebrow">Marketplace</p>
          <h1>Produk tidak ditemukan</h1>
          <p>Produk yang diminta tidak tersedia atau telah dihapus.</p>
          <Link className="button button--primary" to="/marketplace">
            <ArrowLeft size={16} style={{ marginRight: "0.4rem" }} />
            Kembali ke Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <section className="detail-card space-y-6">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <Link to="/marketplace" style={{ color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.9rem" }}>
            <ArrowLeft size={16} /> Marketplace
          </Link>
          <span style={{ color: "var(--muted)" }}>/</span>
          <span style={{ fontSize: "0.9rem", color: "var(--text)" }}>{product.name}</span>
        </div>

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
                {product.soldCount ?? 0}+ Terjual •{" "}
                <span className="rating" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  {(product.rating ?? 0).toFixed(1)}
                </span>
              </p>
              <p className="detail-info__price">Rp. {currency.format(product.price)}</p>
              <p className="detail-info__stock">
                Stock:{" "}
                <span style={{ color: product.stock > 0 ? "var(--success)" : "#ef4444", fontWeight: 700 }}>
                  {product.stock > 0 ? product.stock : "Habis"}
                </span>
              </p>
            </div>

            <div className="detail-badges">
              <span className="badge badge--primary">{product.variant}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--muted)", fontSize: "0.875rem" }}>
                <MapPin size={16} />
                <span>{product.location}</span>
              </div>
            </div>

            <div className="detail-actions">
              <Link className="button button--purple" to="#">
                Beli Langsung
              </Link>

              <div className="quantity-control" aria-label="Jumlah pembelian">
                <button type="button" onClick={() => setQuantity((c) => Math.max(1, c - 1))}>
                  -
                </button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((c) => c + 1)}>
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

            {product.tags && product.tags.length > 0 && (
              <section className="detail-panel">
                <h3>Tag</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {product.tags.map((tag) => (
                    <span key={tag} className="badge badge--primary" style={{ fontSize: "0.75rem" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section className="detail-panel">
              <h3>Toko / Merchant</h3>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <Store size={24} style={{ color: "var(--secondary-purple)", flexShrink: 0 }} />
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
