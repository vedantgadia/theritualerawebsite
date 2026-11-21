import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  filterCatalog,
  relatedTo,
  countByCollection,
  type CatalogProduct,
  type ProductDetail,
  type ShopCategory,
  type ShopCollection,
  type SiteSettings,
} from "@/lib/catalog";
import { CATEGORIES, COLLECTIONS, MOCK_PRODUCTS } from "@/lib/mock-catalog";
import { shopifyEnabled, shopifySnapshot } from "@/lib/shopify/storefront.server";

export type {
  CatalogFilters,
  CatalogProduct,
  ProductDetail,
  ShopCategory,
  ShopCollection,
  SiteSettings,
  SizeStock,
} from "@/lib/catalog";

/*
 * Where products come from: Shopify once its keys are set (SHOPIFY_STORE_DOMAIN +
 * SHOPIFY_STOREFRONT_PRIVATE_TOKEN), otherwise the lookbook mock catalogue.
 */
async function catalogSource(): Promise<{ products: ProductDetail[]; categories: ShopCategory[]; collections: ShopCollection[] }> {
  if (shopifyEnabled()) return shopifySnapshot();
  return {
    products: MOCK_PRODUCTS,
    categories: CATEGORIES.map((c) => ({ id: c.slug, ...c })),
    collections: COLLECTIONS.map((c) => ({ ...c, count: countByCollection(MOCK_PRODUCTS, c.slug) })),
  };
}

/* Listing cards don't need the long accordion texts. */
const toCard = ({ fabricNotes: _f, fitNotes: _n, careInstructions: _c, shippingReturns: _s, ...card }: ProductDetail): CatalogProduct => card;

/* Publishable-key client for anonymous reads of lookbook and pop-up content (SSR-safe). */
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

const catalogInput = z.object({
  category: z.string().max(80).optional(),
  size: z.string().max(10).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sort: z.enum(["newest", "price-asc", "price-desc", "bestselling"]).optional(),
  q: z.string().max(100).optional(),
  featured: z.boolean().optional(),
  collection: z.string().max(80).optional(),
  isNew: z.boolean().optional(),
  bestseller: z.boolean().optional(),
  limit: z.number().int().min(1).max(250).optional(),
});

export const getCatalog = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => catalogInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<CatalogProduct[]> => {
    const { products } = await catalogSource();
    return filterCatalog(products, data).map(toCard);
  });

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }): Promise<ProductDetail | null> => {
    const { products } = await catalogSource();
    return products.find((p) => p.slug === data.slug) ?? null;
  });

export const getRelatedProducts = createServerFn({ method: "GET" })
  .inputValidator((d: { categorySlug: string | null; excludeSlug: string }) =>
    z.object({ categorySlug: z.string().max(80).nullable(), excludeSlug: z.string().max(120) }).parse(d),
  )
  .handler(async ({ data }): Promise<CatalogProduct[]> => {
    const { products } = await catalogSource();
    return relatedTo(products, data.categorySlug, data.excludeSlug).map(toCard);
  });

export const getSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => ({
    shippingFee: SHIPPING_FEE,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    announcement: "Complimentary shipping across India on orders above ₹5,000",
  }),
);

export const getCategories = createServerFn({ method: "GET" }).handler(async (): Promise<ShopCategory[]> => (await catalogSource()).categories);

export const getCollections = createServerFn({ method: "GET" }).handler(async (): Promise<ShopCollection[]> => (await catalogSource()).collections);

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
