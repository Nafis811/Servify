import { marketplaceRepository, MarketplaceRepository } from "./marketplace.repository";
import type { MarketplaceListing, MarketplaceProduct, MarketplaceQuery } from "./marketplace.types";

export class MarketplaceService {
  constructor(private readonly repository: MarketplaceRepository = marketplaceRepository) {}

  listProducts(query: MarketplaceQuery = {}): MarketplaceListing {
    const needle = query.q?.toLowerCase();
    const category = query.category?.toLowerCase();

    let items = this.repository.findAll();

    if (needle) {
      items = items.filter((product) => {
        return (
          product.name.toLowerCase().includes(needle) ||
          product.description.toLowerCase().includes(needle) ||
          product.tags.some((tag) => tag.toLowerCase().includes(needle))
        );
      });
    }

    if (category) {
      items = items.filter((product) => product.category.toLowerCase() === category);
    }

    if (query.featured === true) {
      items = items.filter((product) => product.featured);
    }

    if (query.sort === "price-asc") {
      items = [...items].sort((left, right) => left.price - right.price);
    } else if (query.sort === "price-desc") {
      items = [...items].sort((left, right) => right.price - left.price);
    } else if (query.sort === "featured") {
      items = [...items].sort((left, right) => Number(right.featured) - Number(left.featured));
    }

    return {
      items,
      total: items.length,
      categories: this.repository.findCategories(),
    };
  }

  getProductBySlug(slug: string): MarketplaceProduct | undefined {
    return this.repository.findBySlug(slug);
  }

  getCategories() {
    return this.repository.findCategories();
  }
}

export const marketplaceService = new MarketplaceService();

