/*
 * Server-only Shopify Storefront API client. The private token never reaches
 * the browser: every call happens inside a server function.
 *
 * Environment:
 *   SHOPIFY_STORE_DOMAIN               e.g. ritual-era.myshopify.com
 *   SHOPIFY_STOREFRONT_PRIVATE_TOKEN   Headless channel → Storefront API → private access token
 *   SHOPIFY_API_VERSION                optional, defaults below
 */
import type { ProductDetail, ShopCategory, ShopCollection } from "@/lib/catalog";
import { countByCollection } from "@/lib/catalog";
import {
  CART_CREATE_MUTATION,
  CART_QUERY,
  CATALOG_QUERY,
  COLLECTIONS_QUERY,
  mapProduct,
  splitCollections,
  type ShopifyCollectionNode,
  type ShopifyProductNode,
} from "./map";

const DEFAULT_API_VERSION = "2026-07";
const CACHE_MS = 60_000;

function config() {
  const domain = process.env["SHOPIFY_STORE_DOMAIN"]
    ?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const token = process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"]?.trim();
  const version = process.env["SHOPIFY_API_VERSION"]?.trim() || DEFAULT_API_VERSION;
  return domain && token ? { domain, token, version } : null;
}

/** True once the Shopify keys are set; until then the site serves the mock catalogue. */
export const shopifyEnabled = () => config() !== null;

export async function storefront<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const c = config();
  if (!c) throw new Error("Shopify is not configured");
  const res = await fetch(`https://${c.domain}/api/${c.version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Shopify-Storefront-Private-Token": c.token },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify Storefront API ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length)
    throw new Error(`Shopify Storefront API: ${json.errors.map((e) => e.message).join("; ")}`);
  if (!json.data) throw new Error("Shopify Storefront API returned no data");
  return json.data;
}

interface Snapshot {
  at: number;
  products: ProductDetail[];
  categories: ShopCategory[];
  collections: ShopCollection[];
}

let cache: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;

async function load(): Promise<Snapshot> {
  const { collections } = await storefront<{ collections: { nodes: ShopifyCollectionNode[] } }>(
    COLLECTIONS_QUERY,
  );
  const { categories, stories } = splitCollections(collections.nodes);
  const names = new Map(categories.map((c) => [c.slug, c.name]));

  const nodes: ShopifyProductNode[] = [];
  let cursor: string | null = null;
  do {
    const page: {
      products: {
        nodes: ShopifyProductNode[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    } = await storefront(CATALOG_QUERY, { cursor });
    nodes.push(...page.products.nodes);
    cursor = page.products.pageInfo.hasNextPage ? page.products.pageInfo.endCursor : null;
  } while (cursor);

  const products = nodes.map((n) => mapProduct(n, names));
  return {
    at: Date.now(),
    products,
    categories,
    collections: stories.map((s) => ({ ...s, count: countByCollection(products, s.slug) })),
  };
}

/*
 * The whole catalogue (a few dozen pieces) in one go, cached briefly so page
 * loads stay fast while admin edits still show up within a minute.
 * `fresh` bypasses the cache — used at checkout so stock and prices are current.
 */
export async function shopifySnapshot(fresh = false): Promise<Snapshot> {
  if (!fresh && cache && Date.now() - cache.at < CACHE_MS) return cache;
  if (!fresh && inflight) return inflight;
  const p = load();
  if (!fresh) inflight = p;
  try {
    cache = await p;
    return cache;
  } catch (err) {
    // A brief Shopify hiccup shouldn't take the shop down: keep showing the last good catalogue.
    if (!fresh && cache) {
      console.error("Shopify catalogue refresh failed; serving the cached copy", err);
      return cache;
    }
    throw err;
  } finally {
    if (!fresh) inflight = null;
  }
}

export interface CheckoutLine {
  merchandiseId: string;
  quantity: number;
}

export async function createShopifyCart(lines: CheckoutLine[]) {
  const data = await storefront<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string } | null;
      userErrors: { message: string }[];
      warnings: { message: string }[];
    };
  }>(CART_CREATE_MUTATION, { input: { lines, buyerIdentity: { countryCode: "IN" } } });
  return data.cartCreate;
}

/** A cart disappears once its checkout is completed, so a missing cart means the order went through. */
export async function shopifyCartExists(id: string): Promise<boolean> {
  const data = await storefront<{ cart: { id: string } | null }>(CART_QUERY, { id });
  return data.cart !== null;
}
