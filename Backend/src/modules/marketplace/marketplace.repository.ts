import { prisma } from "../../lib/prisma";
import type { MarketplaceCategory, MarketplaceProduct } from "./marketplace.types";

export class MarketplaceRepository {
  async findAllAsync(): Promise<MarketplaceProduct[]> {
    try {
      const dbBarang = await prisma.barang.findMany({
        include: {
          mitra: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return dbBarang.map((b) => ({
        id: b.id,
        slug: b.id,
        name: b.namaBarang,
        description: b.deskripsi || `${b.namaBarang} dari ${b.mitra.namaToko}`,
        category: "Service",
        price: Number(b.harga),
        stock: b.stok,
        imageUrl: b.gambarUrl || "https://placehold.co/600x400/101828/f5f7fa?text=Barang+Servify",
        featured: true,
        tags: [b.mitra.namaToko, "merchant", "produk"],
        soldCount: 0,
        rating: 5.0,
        variant: "Default",
        location: b.mitra.alamat || "Indonesia",
        merchant: {
          businessName: b.mitra.namaToko,
          address: b.mitra.alamat,
        },
      }));
    } catch (err) {
      console.warn("Could not fetch barang from database:", err);
      return [];
    }
  }

  async findBySlug(slug: string): Promise<MarketplaceProduct | undefined> {
    try {
      const b = await prisma.barang.findUnique({
        where: { id: slug },
        include: { mitra: true },
      });

      if (!b) return undefined;

      return {
        id: b.id,
        slug: b.id,
        name: b.namaBarang,
        description: b.deskripsi || `${b.namaBarang} dari ${b.mitra.namaToko}`,
        category: "Service",
        price: Number(b.harga),
        stock: b.stok,
        imageUrl: b.gambarUrl || "https://placehold.co/600x400/101828/f5f7fa?text=Barang+Servify",
        featured: true,
        tags: [b.mitra.namaToko, "merchant", "produk"],
        soldCount: 0,
        rating: 5.0,
        variant: "Default",
        location: b.mitra.alamat || "Indonesia",
        merchant: {
          businessName: b.mitra.namaToko,
          address: b.mitra.alamat,
        },
      };
    } catch {
      return undefined;
    }
  }

  async findCategoriesAsync(): Promise<MarketplaceCategory[]> {
    const products = await this.findAllAsync();
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories.length > 0 ? categories : ["Service", "Sparepart", "Accessory"];
  }
}

export const marketplaceRepository = new MarketplaceRepository();

