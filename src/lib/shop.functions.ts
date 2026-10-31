import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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
  };
}

const catalogInput = z.object({
  category: z.string().optional(),
  size: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc"]).optional(),
  q: z.string().optional(),
  featured: z.boolean().optional(),
  limit: z.number().optional(),
});

export type CatalogFilters = z.infer<typeof catalogInput>;

export const getCatalog = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => catalogInput.parse(d ?? {}))
  .handler(async ({ data }) => {
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

export const getCategories = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const { data } = await db.from("categories").select("id, name, slug").order("sort_order", { ascending: true });
  return data ?? [];
});
