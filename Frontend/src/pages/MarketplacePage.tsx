import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Star, PackageSearch } from "lucide-react";
import { listMarketplaceProducts } from "../features/marketplace/marketplace.api";
import type { MarketplaceCategory, MarketplaceProduct } from "../features/marketplace/marketplace.types";

const currency = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

const CATEGORY_LABELS: Record<MarketplaceCategory, string> = {
  Service: "Service",
  Sparepart: "Sparepart",
  Accessory: "Accessory",
};

export function MarketplacePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MarketplaceCategory | "Semua">("Semua");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const res = await listMarketplaceProducts();
        if (res?.items) {
          setProducts(res.items);
        }
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory =
        activeCategory === "Semua" || product.category === activeCategory;
      const matchQuery =
        !needle ||
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(needle)));
      return matchCategory && matchQuery;
    });
  }, [query, activeCategory, products]);

  return (
    <div className="marketplace-shell">
      <section className="marketplace-card space-y-6">
        <h2 className="marketplace-title">Marketplace</h2>

        {/* Toolbar */}
        <div className="marketplace-toolbar">
          <div className="marketplace-search-wrap">
            <Search size={20} className="marketplace-search-icon" />
            <input
              type="text"
              placeholder="Cari produk atau layanan disini..."
              className="marketplace-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button type="button" className="marketplace-filter" aria-label="Filter">
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["Semua", "Service", "Sparepart", "Accessory"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                border: "1.5px solid",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                transition: "all 0.2s",
                borderColor: activeCategory === cat ? "var(--accent)" : "var(--border)",
                background: activeCategory === cat ? "var(--accent)" : "transparent",
                color: activeCategory === cat ? "#fff" : "var(--text)",
              }}
            >
              {cat === "Semua" ? "Semua" : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted)" }}>
            Memuat produk...
          </div>
        ) : (
          <div className="marketplace-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <MarketplaceCard key={product.id} product={product} />
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "3rem 0",
                  color: "var(--muted)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <PackageSearch size={48} style={{ opacity: 0.4 }} />
                <p>Tidak ada produk ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function MarketplaceCard({ product }: { product: MarketplaceProduct }) {
  return (
    <Link to={`/marketplace/detail/${product.slug || product.id}`} className="product-card group">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img className="product-card__image" src={product.imageUrl} alt={product.name} />
      </div>
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__price">Rp {currency.format(product.price)}</p>
      <p className="product-card__meta">
        {product.soldCount ?? 0}+ Terjual •{" "}
        <span className="rating" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          {(product.rating ?? 0).toFixed(1)}
        </span>
      </p>
    </Link>
  );
}
