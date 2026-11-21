/*
 * Storefront API queries and the mapping from Shopify's shapes to the site's.
 * Pure: no network, no environment — unit tested in src/test/shopify-map.test.ts.
 */
import {
  SHIPPING_RETURNS,
  sizeOrder,
  type ProductDetail,
  type ShopCategory,
  type ShopCollection,
} from "@/lib/catalog";
import {
  CATEGORY_TAG_PREFIX,
  COLLECTION_TAG_PREFIX,
  METAFIELD_NAMESPACE,
  SIZE_OPTION,
  TAG_FEATURED,
  TAG_LIMITED,
  TAG_NEW,
  slugify,
} from "./schema";

const mf = (alias: string, key: string) =>
  `${alias}: metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${key}") { value }`;

export const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  createdAt
  productType
  tags
  images(first: 10) { nodes { url(transform: { maxWidth: 1200 }) altText } }
  variants(first: 30) {
    nodes {
      id
      availableForSale
      quantityAvailable
      price { amount }
      compareAtPrice { amount }
      selectedOptions { name value }
    }
  }
  ${mf("fabric", "fabric")}
  ${mf("colour", "colour")}
  ${mf("fabricNotes", "fabric_notes")}
  ${mf("fitNotes", "fit_notes")}
  ${mf("care", "care_instructions")}
  ${mf("bestsellerRank", "bestseller_rank")}
`;

export const CATALOG_QUERY = `
  query Catalog($cursor: String) @inContext(country: IN) {
    products(first: 250, after: $cursor, sortKey: CREATED_AT, reverse: true) {
      nodes { ${PRODUCT_FIELDS} }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections @inContext(country: IN) {
    collections(first: 100) {
      nodes {
        handle
        title
        description
        image { url(transform: { maxWidth: 1400 }) }
        ${mf("kind", "kind")}
        ${mf("tagline", "tagline")}
        ${mf("position", "position")}
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) @inContext(country: IN) {
    cartCreate(input: $input) {
      cart { id checkoutUrl }
      userErrors { message }
      warnings { message }
    }
  }
`;

export const CART_QUERY = `
  query Cart($id: ID!) { cart(id: $id) { id } }
`;

type Metafield = { value: string } | null;

export interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  createdAt: string;
  productType: string;
  tags: string[];
  images: { nodes: { url: string; altText: string | null }[] };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      quantityAvailable: number | null;
      price: { amount: string };
      compareAtPrice: { amount: string } | null;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
  fabric: Metafield;
  colour: Metafield;
  fabricNotes: Metafield;
  fitNotes: Metafield;
  care: Metafield;
  bestsellerRank: Metafield;
}

export interface ShopifyCollectionNode {
  handle: string;
  title: string;
  description: string;
  image: { url: string } | null;
  kind: Metafield;
  tagline: Metafield;
  position: Metafield;
}

const tagValues = (tags: string[], prefix: string) =>
  tags
    .filter((t) => t.toLowerCase().startsWith(prefix))
    .map((t) => t.slice(prefix.length).trim().toLowerCase());

/*
 * Stock shown per size. quantityAvailable needs the Storefront "inventory" permission;
 * without it Shopify returns null, so fall back to in stock / sold out and avoid
 * "only N left" messages we can't back up.
 */
const stockOf = (v: ShopifyProductNode["variants"]["nodes"][number]) =>
  v.quantityAvailable != null ? Math.max(0, v.quantityAvailable) : v.availableForSale ? 99 : 0;

export function mapProduct(
  node: ShopifyProductNode,
  categoryNames: Map<string, string> = new Map(),
): ProductDetail {
  const tags = node.tags.map((t) => t.trim());
  const lower = tags.map((t) => t.toLowerCase());
  const variants = node.variants.nodes;

  const sizes = variants
    .map((v) => ({
      size:
        v.selectedOptions.find((o) => o.name.toLowerCase() === SIZE_OPTION.toLowerCase())?.value ??
        v.selectedOptions[0]?.value ??
        "One size",
      stock: stockOf(v),
      variantId: v.id,
    }))
    .sort((a, b) => sizeOrder(a.size) - sizeOrder(b.size));

  const prices = variants.map((v) => Number(v.price.amount));
  const compare = variants.map((v) => (v.compareAtPrice ? Number(v.compareAtPrice.amount) : 0));
  const price = prices.length ? Math.min(...prices) : 0;
  const compareAt = compare.length ? Math.max(...compare) : 0;

  const categorySlugs = tagValues(tags, CATEGORY_TAG_PREFIX);
  const primary = node.productType ? slugify(node.productType) : (categorySlugs[0] ?? null);
  if (primary && !categorySlugs.includes(primary)) categorySlugs.unshift(primary);

  const rank = node.bestsellerRank?.value ? Number.parseInt(node.bestsellerRank.value, 10) : NaN;

  return {
    id: node.id,
    name: node.title,
    slug: node.handle,
    description: node.description,
    price,
    compareAtPrice: compareAt > price ? compareAt : null,
    images: node.images.nodes.map((i) => i.url),
    limitedEdition: lower.includes(TAG_LIMITED),
    featured: lower.includes(TAG_FEATURED),
    categoryName: primary ? (categoryNames.get(primary) ?? node.productType ?? null) : null,
    categorySlug: primary,
    sizes,
    createdAt: node.createdAt,
    fabric: node.fabric?.value ?? "",
    colour: node.colour?.value ?? "",
    categorySlugs,
    collections: tagValues(tags, COLLECTION_TAG_PREFIX),
    isNew: lower.includes(TAG_NEW),
    bestsellerRank: Number.isFinite(rank) ? rank : null,
    fabricNotes: node.fabricNotes?.value ?? "",
    fitNotes: node.fitNotes?.value ?? "",
    careInstructions: node.care?.value ?? "",
    shippingReturns: SHIPPING_RETURNS,
  };
}

const byPosition = (a: ShopifyCollectionNode, b: ShopifyCollectionNode) => {
  const pa = Number(a.position?.value ?? 999);
  const pb = Number(b.position?.value ?? 999);
  return pa - pb || a.title.localeCompare(b.title);
};

/* Collections tagged kind=category become the shop's categories; kind=story the editorial collections. */
export function splitCollections(nodes: ShopifyCollectionNode[]) {
  const sorted = [...nodes].sort(byPosition);
  const categories: ShopCategory[] = sorted
    .filter((c) => c.kind?.value?.trim().toLowerCase() === "category")
    .map((c) => ({
      id: c.handle,
      name: c.title,
      slug: c.handle,
      blurb: c.description,
      image: c.image?.url ?? "",
    }));
  const stories: Omit<ShopCollection, "count">[] = sorted
    .filter((c) => c.kind?.value?.trim().toLowerCase() === "story")
    .map((c) => ({
      slug: c.handle,
      name: c.title,
      tagline: c.tagline?.value ?? "",
      story: c.description,
      coverImage: c.image?.url ?? "",
    }));
  return { categories, stories };
}
