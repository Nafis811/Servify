export type MarketplaceCategory = "Service" | "Sparepart" | "Accessory";

export interface MarketplaceProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  stock: number;
  imageUrl: string;
  featured: boolean;
  tags: string[];
}

export interface MarketplaceQuery {
  q?: string;
  category?: string;
  featured?: boolean;
  sort?: "featured" | "price-asc" | "price-desc";
}

export interface MarketplaceListing {
  items: MarketplaceProduct[];
  total: number;
  categories: MarketplaceCategory[];
}

