import type { MarketplaceCategory, MarketplaceProduct } from "./marketplace.types";

const seedProducts: MarketplaceProduct[] = [
  {
    id: "prd_001",
    slug: "laptop-cleaning-service",
    name: "Laptop Cleaning Service",
    description: "Deep cleaning service for fans, vents, and internal components.",
    category: "Service",
    price: 150000,
    stock: 99,
    imageUrl: "https://placehold.co/600x400/101828/f5f7fa?text=Laptop+Cleaning",
    featured: true,
    tags: ["service", "maintenance", "cooling"],
  },
  {
    id: "prd_002",
    slug: "thermal-paste-replacement",
    name: "Thermal Paste Replacement",
    description: "Improves thermal transfer and helps stabilize performance.",
    category: "Service",
    price: 85000,
    stock: 99,
    imageUrl: "https://placehold.co/600x400/14213d/f5f7fa?text=Thermal+Paste",
    featured: true,
    tags: ["service", "thermal", "cpu"],
  },
  {
    id: "prd_003",
    slug: "ssd-512gb-upgrade",
    name: "SSD 512GB Upgrade",
    description: "Faster boot and load times with a capacity upgrade for everyday use.",
    category: "Sparepart",
    price: 620000,
    stock: 18,
    imageUrl: "https://placehold.co/600x400/1f2937/f5f7fa?text=SSD+512GB",
    featured: true,
    tags: ["storage", "upgrade", "ssd"],
  },
  {
    id: "prd_004",
    slug: "replacement-keyboard",
    name: "Replacement Keyboard",
    description: "Compatible keyboard replacement for common laptop models.",
    category: "Sparepart",
    price: 275000,
    stock: 24,
    imageUrl: "https://placehold.co/600x400/334155/f5f7fa?text=Keyboard",
    featured: false,
    tags: ["input", "sparepart", "keyboard"],
  },
  {
    id: "prd_005",
    slug: "protective-laptop-sleeve",
    name: "Protective Laptop Sleeve",
    description: "Minimal sleeve for daily carry and surface protection.",
    category: "Accessory",
    price: 120000,
    stock: 42,
    imageUrl: "https://placehold.co/600x400/4b5563/f5f7fa?text=Laptop+Sleeve",
    featured: false,
    tags: ["accessory", "bag", "protection"],
  },
];

export class MarketplaceRepository {
  findAll(): MarketplaceProduct[] {
    return [...seedProducts];
  }

  findBySlug(slug: string): MarketplaceProduct | undefined {
    return seedProducts.find((product) => product.slug === slug);
  }

  findCategories(): MarketplaceCategory[] {
    return Array.from(new Set(seedProducts.map((product) => product.category)));
  }
}

export const marketplaceRepository = new MarketplaceRepository();

