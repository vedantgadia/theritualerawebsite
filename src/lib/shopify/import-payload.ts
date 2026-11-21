/*
 * Builds the Admin API inputs that load the lookbook catalogue into Shopify in
 * the shape described in ./schema.ts. Pure, so it is unit tested; the network
 * part lives in scripts/shopify-import.ts.
 */
import type { ProductDetail } from "@/lib/catalog";
import type { MockCategory, MockCollection } from "@/lib/mock-catalog";
import {
  CATEGORY_TAG_PREFIX,
  COLLECTION_TAG_PREFIX,
  METAFIELD_NAMESPACE,
  SIZE_OPTION,
  TAG_FEATURED,
  TAG_LIMITED,
  TAG_NEW,
} from "./schema";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Site paths like /media/products/x.webp become absolute URLs Shopify can download. */
export const absolute = (base: string, path: string) =>
  /^https?:\/\//.test(path) ? path : `${base.replace(/\/+$/, "")}${path}`;

const metafield = (key: string, type: string, value: string | number | null | undefined) =>
  value === null || value === undefined || value === ""
    ? []
    : [{ namespace: METAFIELD_NAMESPACE, key, type, value: String(value) }];

export function productTags(p: ProductDetail): string[] {
  return [
    ...p.categorySlugs.map((c) => `${CATEGORY_TAG_PREFIX}${c}`),
    ...p.collections.map((c) => `${COLLECTION_TAG_PREFIX}${c}`),
    ...(p.isNew ? [TAG_NEW] : []),
    ...(p.limitedEdition ? [TAG_LIMITED] : []),
    ...(p.featured ? [TAG_FEATURED] : []),
  ];
}

/** ProductSetInput for one piece: one variant per size with its stock at `locationId`. */
export function productSetInput(p: ProductDetail, opts: { imageBase: string; locationId: string }) {
  return {
    title: p.name,
    handle: p.slug,
    descriptionHtml: `<p>${escapeHtml(p.description)}</p>`,
    productType: p.categoryName ?? "",
    vendor: "The Ritual Era",
    status: "ACTIVE",
    tags: productTags(p),
    metafields: [
      ...metafield("fabric", "single_line_text_field", p.fabric),
      ...metafield("colour", "single_line_text_field", p.colour),
      ...metafield("fabric_notes", "multi_line_text_field", p.fabricNotes),
      ...metafield("fit_notes", "multi_line_text_field", p.fitNotes),
      ...metafield("care_instructions", "multi_line_text_field", p.careInstructions),
      ...metafield("bestseller_rank", "number_integer", p.bestsellerRank),
    ],
    productOptions: [
      { name: SIZE_OPTION, position: 1, values: p.sizes.map((s) => ({ name: s.size })) },
    ],
    files: p.images.map((src, i) => ({
      originalSource: absolute(opts.imageBase, src),
      contentType: "IMAGE",
      alt: i === 0 ? p.name : `${p.name} — detail`,
    })),
    variants: p.sizes.map((s) => ({
      optionValues: [{ optionName: SIZE_OPTION, name: s.size }],
      price: p.price.toFixed(2),
      ...(p.compareAtPrice ? { compareAtPrice: p.compareAtPrice.toFixed(2) } : {}),
      inventoryPolicy: "DENY",
      inventoryItem: { tracked: true, sku: `TRE-${p.slug}-${s.size}`.toUpperCase() },
      inventoryQuantities: [{ locationId: opts.locationId, name: "available", quantity: s.stock }],
    })),
  };
}

const tagRule = (condition: string) => ({
  appliedDisjunctively: false,
  rules: [{ column: "TAG", relation: "EQUALS", condition }],
});

/** CollectionInput for the five categories and the six story collections (automated by tag). */
export function collectionInputs(
  categories: MockCategory[],
  stories: MockCollection[],
  imageBase: string,
) {
  return [
    ...categories.map((c, i) => ({
      title: c.name,
      handle: c.slug,
      descriptionHtml: `<p>${escapeHtml(c.blurb)}</p>`,
      image: { src: absolute(imageBase, c.image), altText: c.name },
      ruleSet: tagRule(`${CATEGORY_TAG_PREFIX}${c.slug}`),
      metafields: [
        ...metafield("kind", "single_line_text_field", "category"),
        ...metafield("position", "number_integer", i + 1),
      ],
    })),
    ...stories.map((c, i) => ({
      title: c.name,
      handle: c.slug,
      descriptionHtml: `<p>${escapeHtml(c.story)}</p>`,
      image: { src: absolute(imageBase, c.coverImage), altText: c.name },
      ruleSet: tagRule(`${COLLECTION_TAG_PREFIX}${c.slug}`),
      metafields: [
        ...metafield("kind", "single_line_text_field", "story"),
        ...metafield("tagline", "single_line_text_field", c.tagline),
        ...metafield("position", "number_integer", i + 1),
      ],
    })),
  ];
}
