import type { MarketplaceQuery } from "./marketplace.types";

export const normalizeMarketplaceQuery = (query: Record<string, unknown>): MarketplaceQuery => {
  const normalized: MarketplaceQuery = {};

  if (typeof query.q === "string" && query.q.trim()) {
    normalized.q = query.q.trim();
  }

  if (typeof query.category === "string" && query.category.trim()) {
    normalized.category = query.category.trim();
  }

  if (typeof query.featured === "string") {
    normalized.featured = query.featured === "true";
  }

  if (query.sort === "featured" || query.sort === "price-asc" || query.sort === "price-desc") {
    normalized.sort = query.sort;
  }

  return normalized;
};

