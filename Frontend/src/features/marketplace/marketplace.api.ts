import { apiFetch, toQueryString } from "../../services/api";
import type { MarketplaceListing, MarketplaceProduct } from "./marketplace.types";

export interface MarketplaceQuery {
  q?: string;
  category?: string;
  featured?: boolean;
  sort?: "featured" | "price-asc" | "price-desc";
}

export const listMarketplaceProducts = (query: MarketplaceQuery = {}) =>
  apiFetch<MarketplaceListing>(`/marketplace/products${toQueryString(query)}`);

export const getMarketplaceProduct = (slug: string) =>
  apiFetch<MarketplaceProduct>(`/marketplace/products/${slug}`);

export const listMarketplaceCategories = () =>
  apiFetch<MarketplaceListing["categories"]>("/marketplace/categories");

