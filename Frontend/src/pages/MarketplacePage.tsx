import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { marketplaceProducts } from "../features/marketplace/marketplace.copy";
import type { MarketplaceProduct } from "../features/marketplace/marketplace.types";

const currency = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function MarketplacePage() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return marketplaceProducts;
    }

    return marketplaceProducts.filter((product) => {
      return (
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle) ||
        product.tags.some((tag) => tag.toLowerCase().includes(needle))
      );
    });
  }, [query]);

  return (
    <div className="marketplace-shell">
      <section className="marketplace-card space-y-6">
        <h2 className="marketplace-title">Marketplace</h2>

        <div className="marketplace-toolbar">
          <div className="marketplace-search-wrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="marketplace-search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari disini"
              className="marketplace-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <button type="button" className="marketplace-filter" aria-label="Filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-4.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

        <div className="marketplace-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <MarketplaceCard key={product.id} product={product} />
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--muted)", padding: "2rem 0" }}>
              Tidak ada produk ditemukan.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function MarketplaceCard({ product }: { product: MarketplaceProduct }) {
  return (
    <Link to={`/marketplace/detail/${product.id}`} className="product-card group">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img className="product-card__image" src={product.imageUrl} alt={product.name} />
      </div>
      <h3 className="product-card__name">{product.name}</h3>
      <p className="product-card__price">Rp. {currency.format(product.price)}</p>
      <p className="product-card__meta">
        {product.soldCount}+ Terjual • <span className="rating">★ {product.rating.toFixed(1)}</span>
      </p>
    </Link>
  );
}

