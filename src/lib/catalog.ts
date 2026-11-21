/*
 * Catalogue shapes shared by every product source (the lookbook mock catalogue
 * and Shopify), plus the filtering/sorting the listing pages rely on.
 * Pure module: safe to import from server functions, scripts and tests.
 */

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export interface SizeStock {
  size: string;
  stock: number;
  /** Shopify variant id; absent for the mock catalogue. */
  variantId?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  limitedEdition: boolean;
  featured: boolean;
  categoryName: string | null;
  categorySlug: string | null;
  sizes: SizeStock[];
  createdAt: string;
  fabric: string;
  colour: string;
  categorySlugs: string[];
  collections: string[];
  isNew: boolean;
  bestsellerRank: number | null;
}

export interface ProductDetail extends CatalogProduct {
  fabricNotes: string;
  fitNotes: string;
  careInstructions: string;
  shippingReturns: string;
}

export interface SiteSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  announcement: string;
}

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  image: string;
}

export interface ShopCollection {
  slug: string;
  name: string;
  tagline: string;
  story: string;
  coverImage: string;
  count: number;
}

export interface CatalogFilters {
  category?: string | undefined;
  size?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  sort?: "newest" | "price-asc" | "price-desc" | "bestselling" | undefined;
  q?: string | undefined;
  featured?: boolean | undefined;
  collection?: string | undefined;
  isNew?: boolean | undefined;
  bestseller?: boolean | undefined;
  limit?: number | undefined;
}

/*
 * Shipping shown in the bag. Shopify's checkout charges whatever is set under
 * Settings → Shipping and delivery, so keep these two numbers in step with it.
 */
export const SHIPPING_FEE = 150;
export const FREE_SHIPPING_THRESHOLD = 5000;

export const SHIPPING_RETURNS =
  "Ships within 3–5 working days across India. Free shipping on orders above ₹5,000. Exchanges accepted within 7 days of delivery on unworn pieces with tags attached.";

export const sizeOrder = (size: string) => {
  const i = (SIZES as readonly string[]).indexOf(size);
  return i === -1 ? SIZES.length : i;
};

export function filterCatalog<T extends CatalogProduct>(products: T[], f: CatalogFilters): T[] {
  let list = products.filter((p) => {
    if (f.category && !p.categorySlugs.includes(f.category)) return false;
    if (f.collection && !p.collections.includes(f.collection)) return false;
    if (f.isNew && !p.isNew) return false;
    if (f.bestseller && p.bestsellerRank == null) return false;
    if (f.featured && !p.featured) return false;
    if (f.size && !p.sizes.some((s) => s.size === f.size && s.stock > 0)) return false;
    if (f.minPrice != null && p.price < f.minPrice) return false;
    if (f.maxPrice != null && p.price > f.maxPrice) return false;
    if (f.q) {
      const q = f.q.toLowerCase();
      if (![p.name, p.description, p.fabric, p.colour].some((t) => t.toLowerCase().includes(q)))
        return false;
    }
    return true;
  });
  const sort = f.sort ?? (f.bestseller ? "bestselling" : "newest");
  list = [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "bestselling") return (a.bestsellerRank ?? 999) - (b.bestsellerRank ?? 999);
    return b.createdAt.localeCompare(a.createdAt);
  });
  return list.slice(0, f.limit ?? 120);
}

/* Same category first, then everything else, four in all. */
export function relatedTo<T extends CatalogProduct>(
  products: T[],
  categorySlug: string | null,
  excludeSlug: string,
): T[] {
  const others = products.filter((p) => p.slug !== excludeSlug);
  const same = others.filter((p) => categorySlug && p.categorySlugs.includes(categorySlug));
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, 4);
}

export function countByCollection(products: CatalogProduct[], slug: string): number {
  return products.filter((p) => p.collections.includes(slug)).length;
}
