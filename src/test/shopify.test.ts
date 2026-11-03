import { describe, expect, it } from "vitest";
import { filterCatalog, type ProductDetail } from "@/lib/catalog";
import { resolveBagLines } from "@/lib/checkout";
import { CATEGORIES, COLLECTIONS, MOCK_PRODUCTS } from "@/lib/mock-catalog";
import { collectionInputs, productSetInput } from "@/lib/shopify/import-payload";
import {
  mapProduct,
  splitCollections,
  type ShopifyCollectionNode,
  type ShopifyProductNode,
} from "@/lib/shopify/map";

const BASE = "https://example.test";

/* What the Storefront API would return for a product the import script created. */
function asStorefrontNode(p: ProductDetail, index: number): ShopifyProductNode {
  const input = productSetInput(p, { imageBase: BASE, locationId: "gid://shopify/Location/1" });
  const field = (key: string) => {
    const m = input.metafields.find((x) => x.key === key);
    return m ? { value: m.value } : null;
  };
  return {
    id: `gid://shopify/Product/${index}`,
    handle: input.handle,
    title: input.title,
    description: p.description,
    createdAt: p.createdAt,
    productType: input.productType,
    tags: input.tags,
    images: { nodes: input.files.map((f) => ({ url: f.originalSource, altText: f.alt })) },
    variants: {
      nodes: input.variants.map((v, i) => ({
        id: `gid://shopify/ProductVariant/${index}${i}`,
        availableForSale: v.inventoryQuantities[0]!.quantity > 0,
        quantityAvailable: v.inventoryQuantities[0]!.quantity,
        price: { amount: v.price },
        compareAtPrice:
          "compareAtPrice" in v && v.compareAtPrice ? { amount: v.compareAtPrice } : null,
        selectedOptions: [{ name: "Size", value: v.optionValues[0]!.name }],
      })),
    },
    fabric: field("fabric"),
    colour: field("colour"),
    fabricNotes: field("fabric_notes"),
    fitNotes: field("fit_notes"),
    care: field("care_instructions"),
    bestsellerRank: field("bestseller_rank"),
  };
}

const names = new Map(CATEGORIES.map((c) => [c.slug, c.name]));
const roundTripped = MOCK_PRODUCTS.map((p, i) => mapProduct(asStorefrontNode(p, i), names));

describe("Shopify catalogue round trip", () => {
  it("keeps every field the site uses for all 68 pieces", () => {
    expect(roundTripped).toHaveLength(MOCK_PRODUCTS.length);
    roundTripped.forEach((got, i) => {
      const want = MOCK_PRODUCTS[i]!;
      expect(got.slug).toBe(want.slug);
      expect(got.name).toBe(want.name);
      expect(got.price).toBe(want.price);
      expect(got.compareAtPrice).toBe(want.compareAtPrice);
      expect(got.categorySlug).toBe(want.categorySlug);
      expect(got.categoryName).toBe(want.categoryName);
      expect([...got.categorySlugs].sort()).toEqual([...want.categorySlugs].sort());
      expect([...got.collections].sort()).toEqual([...want.collections].sort());
      expect(got.isNew).toBe(want.isNew);
      expect(got.limitedEdition).toBe(want.limitedEdition);
      expect(got.featured).toBe(want.featured);
      expect(got.bestsellerRank).toBe(want.bestsellerRank);
      expect(got.fabric).toBe(want.fabric);
      expect(got.colour).toBe(want.colour);
      expect(got.fabricNotes).toBe(want.fabricNotes);
      expect(got.fitNotes).toBe(want.fitNotes);
      expect(got.careInstructions).toBe(want.careInstructions);
      expect(got.sizes.map(({ size, stock }) => ({ size, stock }))).toEqual(want.sizes);
      expect(got.sizes.every((s) => s.variantId?.startsWith("gid://shopify/ProductVariant/"))).toBe(
        true,
      );
      expect(got.images).toEqual(want.images.map((src) => `${BASE}${src}`));
    });
  });

  it("produces the same listings as the mock catalogue", () => {
    const slugs = (list: ProductDetail[]) => list.map((p) => p.slug);
    for (const f of [
      { isNew: true },
      { bestseller: true },
      { category: "denim" },
      { collection: "ajrakh-stories" },
      { size: "XS", sort: "price-asc" as const },
    ]) {
      expect(slugs(filterCatalog(roundTripped, f))).toEqual(slugs(filterCatalog(MOCK_PRODUCTS, f)));
    }
  });

  it("falls back to in-stock/sold-out when Shopify hides exact quantities", () => {
    const node = asStorefrontNode(MOCK_PRODUCTS[0]!, 0);
    node.variants.nodes.forEach((v, i) => {
      v.quantityAvailable = null;
      v.availableForSale = i !== 0;
    });
    const sizes = mapProduct(node).sizes;
    expect(sizes[0]!.stock).toBe(0);
    expect(sizes.slice(1).every((s) => s.stock === 99)).toBe(true);
  });
});

describe("Shopify collections", () => {
  it("splits categories from story collections in menu order", () => {
    const nodes: ShopifyCollectionNode[] = collectionInputs(CATEGORIES, COLLECTIONS, BASE)
      .reverse()
      .map((c) => {
        const m = (key: string) => {
          const f = c.metafields.find((x) => x.key === key);
          return f ? { value: f.value } : null;
        };
        return {
          handle: c.handle,
          title: c.title,
          description: "",
          image: { url: c.image.src },
          kind: m("kind"),
          tagline: m("tagline"),
          position: m("position"),
        };
      });
    const { categories, stories } = splitCollections([
      ...nodes,
      {
        handle: "frontpage",
        title: "Home page",
        description: "",
        image: null,
        kind: null,
        tagline: null,
        position: null,
      },
    ]);
    expect(categories.map((c) => c.slug)).toEqual(CATEGORIES.map((c) => c.slug));
    expect(stories.map((c) => c.slug)).toEqual(COLLECTIONS.map((c) => c.slug));
    expect(stories[0]!.tagline).toBe(COLLECTIONS[0]!.tagline);
  });
});

describe("Bag → Shopify cart lines", () => {
  const product = roundTripped.find(
    (p) => p.sizes.some((s) => s.stock >= 2) && p.sizes.some((s) => s.stock === 0),
  )!;
  const inStock = product.sizes.find((s) => s.stock >= 2)!;
  const soldOut = product.sizes.find((s) => s.stock === 0)!;

  it("maps product + size to the Shopify variant and merges duplicates", () => {
    const res = resolveBagLines(
      [
        { slug: product.slug, size: inStock.size, quantity: 1 },
        { slug: product.slug, size: inStock.size, quantity: 1 },
      ],
      roundTripped,
    );
    expect(res).toEqual({ ok: true, lines: [{ merchandiseId: inStock.variantId, quantity: 2 }] });
  });

  it("refuses sold-out sizes, too-large quantities and unknown products", () => {
    const res = resolveBagLines(
      [
        { slug: product.slug, size: soldOut.size, quantity: 1 },
        { slug: product.slug, size: inStock.size, quantity: inStock.stock + 1 },
        { slug: "no-such-piece", size: "M", quantity: 1 },
      ],
      roundTripped,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.problems).toHaveLength(3);
  });

  it("can't check out mock products, which have no Shopify variants", () => {
    const res = resolveBagLines(
      [{ slug: MOCK_PRODUCTS[0]!.slug, size: "M", quantity: 1 }],
      MOCK_PRODUCTS,
    );
    expect(res.ok).toBe(false);
  });
});

describe("Storefront client (Shopify responses simulated)", () => {
  it("loads every page of products with the private token and creates a cart", async () => {
    const { vi } = await import("vitest");
    vi.resetModules();
    process.env["SHOPIFY_STORE_DOMAIN"] = "https://ritual-test.myshopify.com/";
    process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"] = "shpat_test";
    const nodes = MOCK_PRODUCTS.map((p, i) => asStorefrontNode(p, i));
    const calls: {
      url: string;
      headers: Headers;
      body: { query: string; variables: Record<string, unknown> };
    }[] = [];
    const fetchMock = vi.fn(async (url: string, init: RequestInit) => {
      const body = JSON.parse(String(init.body));
      calls.push({ url, headers: new Headers(init.headers), body });
      const reply = (data: unknown) => new Response(JSON.stringify({ data }), { status: 200 });
      if (body.query.includes("collections(")) return reply({ collections: { nodes: [] } });
      if (body.query.includes("cartCreate"))
        return reply({
          cartCreate: {
            cart: {
              id: "gid://shopify/Cart/abc",
              checkoutUrl: "https://ritual-test.myshopify.com/cart/c/abc",
            },
            userErrors: [],
            warnings: [],
          },
        });
      const page = body.variables.cursor ? nodes.slice(40) : nodes.slice(0, 40);
      return reply({
        products: {
          nodes: page,
          pageInfo: {
            hasNextPage: !body.variables.cursor,
            endCursor: body.variables.cursor ? null : "c1",
          },
        },
      });
    });
    vi.stubGlobal("fetch", fetchMock);
    try {
      const sf = await import("@/lib/shopify/storefront.server");
      expect(sf.shopifyEnabled()).toBe(true);
      const snap = await sf.shopifySnapshot();
      expect(snap.products).toHaveLength(MOCK_PRODUCTS.length);
      expect(calls[0]!.url).toBe("https://ritual-test.myshopify.com/api/2026-07/graphql.json");
      expect(
        calls.every((c) => c.headers.get("Shopify-Storefront-Private-Token") === "shpat_test"),
      ).toBe(true);
      await sf.shopifySnapshot();
      expect(calls).toHaveLength(3); // second call served from cache

      const cart = await sf.createShopifyCart([
        { merchandiseId: snap.products[0]!.sizes[0]!.variantId!, quantity: 1 },
      ]);
      expect(cart.cart?.checkoutUrl).toContain("/cart/c/abc");
      expect(calls.at(-1)!.body.variables).toMatchObject({
        input: { buyerIdentity: { countryCode: "IN" } },
      });
    } finally {
      vi.unstubAllGlobals();
      delete process.env["SHOPIFY_STORE_DOMAIN"];
      delete process.env["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"];
    }
  });
});
