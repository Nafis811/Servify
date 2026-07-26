export type MarketplaceCategory = "Service" | "Sparepart" | "Accessory" | "Produk Merchant" | string;

export interface MarketplaceMerchant {
  businessName: string;
  address: string;
}

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
  soldCount?: number;
  rating?: number;
  variant?: string;
  location?: string;
  merchant?: MarketplaceMerchant;
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

