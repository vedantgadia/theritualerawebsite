import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  CATEGORIES,
  COLLECTIONS,
  PRODUCTS,
  careFor,
  categoriesFor,
  createdAtFor,
  imagesFor,
  stockFor,
} from "@/lib/mock-catalog";

/* Serve the lookbook mock catalogue instead of Supabase until real products are loaded. */
const USE_MOCK_CATALOG = true;

/* Publishable-key client for anonymous catalog reads (SSR-safe). */
function publicClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export interface SizeStock {
  size: string;
  stock: number;
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

export interface SiteSettings {
  shippingFee: number;
  freeShippingThreshold: number;
  announcement: string;
}

function mapProduct(row: any): CatalogProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    limitedEdition: !!row.limited_edition,
    featured: !!row.featured,
    categoryName: row.category?.name ?? null,
    categorySlug: row.category?.slug ?? null,
    sizes: (row.product_sizes ?? [])
      .map((s: any) => ({ size: s.size, stock: s.stock }))
      .sort((a: SizeStock, b: SizeStock) => ["XS", "S", "M", "L", "XL"].indexOf(a.size) - ["XS", "S", "M", "L", "XL"].indexOf(b.size)),
    createdAt: row.created_at,
    fabric: "",
    colour: "",
    categorySlugs: row.category?.slug ? [row.category.slug] : [],
    collections: [],
    isNew: false,
    bestsellerRank: null,
  };
}

const SIZES = ["XS", "S", "M", "L", "XL"];
const categoryName = (slug: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? null;

const MOCK_PRODUCTS: ProductDetail[] = PRODUCTS.map((p, i) => ({
  id: `mock-${i + 1}`,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: p.price,
  compareAtPrice: p.compareAtPrice ?? null,
  images: imagesFor(p),
  limitedEdition: !!p.limited,
  featured: !!p.featured,
  categoryName: categoryName(p.category),
  categorySlug: p.category,
  sizes: stockFor(p, i).map((stock, s) => ({ size: SIZES[s]!, stock })),
  createdAt: createdAtFor(p, i),
  fabric: p.fabric,
  colour: p.colour,
  categorySlugs: categoriesFor(p),
  collections: p.collections,
  isNew: !!p.isNew,
  bestsellerRank: p.bestseller ?? null,
  fabricNotes: `${p.fabric}. ${p.details.join(". ")}. Designed and made in-house in Mumbai in small, limited runs.`,
  fitNotes: `${p.fit} Our model is 5'7" and wears size S.`,
  careInstructions: careFor(p),
  shippingReturns:
    "Ships within 3–5 working days across India. Free shipping on orders above ₹5,000. Exchanges accepted within 7 days of delivery on unworn pieces with tags attached.",
}));

function mockCatalog(f: CatalogFilters): CatalogProduct[] {
  let list = MOCK_PRODUCTS.filter((p) => {
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
      if (![p.name, p.description, p.fabric, p.colour].some((t) => t.toLowerCase().includes(q))) return false;
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

const catalogInput = z.object({
  category: z.string().optional(),
  size: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "bestselling"]).optional(),
  q: z.string().optional(),
  featured: z.boolean().optional(),
  collection: z.string().optional(),
  isNew: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  limit: z.number().optional(),
});

export type CatalogFilters = z.infer<typeof catalogInput>;

export const getCatalog = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => catalogInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    if (USE_MOCK_CATALOG) return mockCatalog(data);
    const db = publicClient();
    let query = db
      .from("products")
      .select("id, name, slug, description, price, compare_at_price, images, limited_edition, featured, created_at, category:categories(name, slug), product_sizes(size, stock)")
      .eq("published", true);

    if (data.category) query = query.eq("category.slug", data.category);
    if (data.size) query = query.eq("product_sizes.size", data.size).gt("product_sizes.stock", 0);
    if (data.minPrice != null) query = query.gte("price", data.minPrice);
    if (data.maxPrice != null) query = query.lte("price", data.maxPrice);
    if (data.featured) query = query.eq("featured", true);
    if (data.q) query = query.or(`name.ilike.%${data.q}%,description.ilike.%${data.q}%`);

    if (data.sort === "price-asc") query = query.order("price", { ascending: true });
    else if (data.sort === "price-desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.limit(data.limit ?? 60);
    const { data: rows, error } = await query;
    if (error) return [] as CatalogProduct[];
    return rows.map(mapProduct);
  });

export interface ProductDetail extends CatalogProduct {
  fabricNotes: string;
  fitNotes: string;
  careInstructions: string;
  shippingReturns: string;
}

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    if (USE_MOCK_CATALOG) return MOCK_PRODUCTS.find((p) => p.slug === data.slug) ?? null;
    const db = publicClient();
    const { data: row, error } = await db
      .from("products")
      .select("id, name, slug, description, price, compare_at_price, images, limited_edition, featured, created_at, fabric_notes, fit_notes, care_instructions, shipping_returns, category:categories(name, slug), product_sizes(size, stock)")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    const base = mapProduct(row);
    const detail: ProductDetail = {
      ...base,
      fabricNotes: (row.fabric_notes as string) ?? "",
      fitNotes: (row.fit_notes as string) ?? "",
      careInstructions: (row.care_instructions as string) ?? "",
      shippingReturns: (row.shipping_returns as string) ?? "",
    };
    return detail;
  });

export const getRelatedProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { categorySlug: string | null; excludeSlug: string }) =>
    z.object({ categorySlug: z.string().nullable(), excludeSlug: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    if (USE_MOCK_CATALOG) {
      const others = MOCK_PRODUCTS.filter((p) => p.slug !== data.excludeSlug);
      const same = others.filter((p) => data.categorySlug && p.categorySlugs.includes(data.categorySlug));
      return [...same, ...others.filter((p) => !same.includes(p))].slice(0, 4);
    }
    const db = publicClient();
    let query = db
      .from("products")
      .select("id, name, slug, description, price, compare_at_price, images, limited_edition, featured, created_at, category:categories(name, slug), product_sizes(size, stock)")
      .eq("published", true)
      .neq("slug", data.excludeSlug)
      .limit(4);
    if (data.categorySlug) query = query.eq("category.slug", data.categorySlug);
    const { data: rows, error } = await query;
    if (error || !rows || rows.length < 3) {
      // Fall back to newest products if the category is thin.
      const fallback = await db
        .from("products")
        .select("id, name, slug, description, price, compare_at_price, images, limited_edition, featured, created_at, category:categories(name, slug), product_sizes(size, stock)")
        .eq("published", true)
        .neq("slug", data.excludeSlug)
        .order("created_at", { ascending: false })
        .limit(4);
      return (fallback.data ?? []).map(mapProduct);
    }
    return rows.map(mapProduct);
  });

export const getSettings = createServerFn({ method: "GET" }).handler(async (): Promise<SiteSettings> => {
  if (USE_MOCK_CATALOG) {
    return { shippingFee: 150, freeShippingThreshold: 5000, announcement: "Complimentary shipping across India on orders above ₹5,000" };
  }
  const db = publicClient();
  const { data } = await db.from("site_settings").select("shipping_fee, free_shipping_threshold, announcement").eq("id", 1).maybeSingle();
  return {
    shippingFee: data ? Number(data.shipping_fee) : 150,
    freeShippingThreshold: data ? Number(data.free_shipping_threshold) : 5000,
    announcement: data?.announcement ?? "",
  };
});

export interface LookbookCampaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  createdAt: string;
}

export interface LookbookImage {
  id: string;
  imageUrl: string;
  caption: string;
  productSlug: string | null;
  productName: string | null;
  productPrice: number | null;
}

export const getLookbookCampaigns = createServerFn({ method: "GET" }).handler(async (): Promise<LookbookCampaign[]> => {
  const db = publicClient();
  const { data } = await db
    .from("lookbook_campaigns")
    .select("id, title, slug, description, cover_image, created_at")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return (data ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description ?? "",
    coverImage: (c.cover_image as string) ?? "",
    createdAt: c.created_at,
  }));
});

export const getLookbookCampaign = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<{ campaign: LookbookCampaign; images: LookbookImage[] } | null> => {
    const db = publicClient();
    const { data: c } = await db
      .from("lookbook_campaigns")
      .select("id, title, slug, description, cover_image, created_at")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!c) return null;
    const { data: imgs } = await db
      .from("lookbook_images")
      .select("id, image_url, caption, sort_order, product:products(slug, name, price)")
      .eq("campaign_id", c.id)
      .order("sort_order", { ascending: true });
    return {
      campaign: {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description ?? "",
        coverImage: (c.cover_image as string) ?? "",
        createdAt: c.created_at,
      },
      images: (imgs ?? []).map((i) => {
        const p = i.product as { slug: string; name: string; price: number } | null;
        return {
          id: i.id,
          imageUrl: (i.image_url as string) ?? "",
          caption: (i.caption as string) ?? "",
          productSlug: p?.slug ?? null,
          productName: p?.name ?? null,
          productPrice: p ? Number(p.price) : null,
        };
      }),
    };
  });

export interface PopupEvent {
  id: string;
  title: string;
  venue: string;
  address: string;
  mapsUrl: string;
  eventDate: string;
  upcoming: boolean;
  description: string;
}

export const getPopupEvents = createServerFn({ method: "GET" }).handler(async (): Promise<PopupEvent[]> => {
  const db = publicClient();
  const { data } = await db
    .from("popup_events")
    .select("id, title, venue, address, maps_url, event_date, is_upcoming, description")
    .eq("published", true)
    .order("event_date", { ascending: false });
  return (data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    venue: e.venue,
    address: e.address ?? "",
    mapsUrl: e.maps_url || "",
    eventDate: e.event_date,
    upcoming: e.is_upcoming,
    description: e.description ?? "",
  }));
});

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  image: string;
}

export const getCategories = createServerFn({ method: "GET" }).handler(async (): Promise<ShopCategory[]> => {
  if (USE_MOCK_CATALOG) return CATEGORIES.map((c) => ({ id: c.slug, ...c }));
  const db = publicClient();
  const { data } = await db.from("categories").select("id, name, slug").order("sort_order", { ascending: true });
  return (data ?? []).map((c) => ({ ...c, blurb: "", image: "" }));
});

export interface ShopCollection {
  slug: string;
  name: string;
  tagline: string;
  story: string;
  coverImage: string;
  count: number;
}

export const getCollections = createServerFn({ method: "GET" }).handler(async (): Promise<ShopCollection[]> =>
  COLLECTIONS.map((c) => ({ ...c, count: MOCK_PRODUCTS.filter((p) => p.collections.includes(c.slug)).length })),
);
