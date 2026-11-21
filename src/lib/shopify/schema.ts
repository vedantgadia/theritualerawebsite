/*
 * How The Ritual Era's catalogue is stored in Shopify. The import script writes
 * this shape and the storefront reads it, so the owner edits everything in the
 * Shopify admin:
 *
 *   Product
 *     Title / Description / Media / Status ......... name, description, photos, published
 *     Product type .................................. primary category name, e.g. "Tops & Shirts"
 *     Option "Size" (XS–XL), one variant per size .... price, compare-at price, stock per size
 *     Tags
 *       new, limited-edition, featured ............... badges and home-page picks
 *       category:<slug> ............................. every category the piece is listed in
 *       collection:<slug> ........................... every story collection it belongs to
 *     Metafields (namespace "custom")
 *       fabric, colour ............................... one-liners under the name
 *       fabric_notes, fit_notes, care_instructions ... product-page accordions
 *       bestseller_rank .............................. 1 = top bestseller; empty = not a bestseller
 *
 *   Collection (automated: "Product tag is equal to category:<slug>" or "collection:<slug>")
 *     Handle = the slug used in the site's URLs, Title, Description, Image
 *     Metafields (namespace "custom"): kind ("category" | "story"), tagline, position (menu order)
 */

export const METAFIELD_NAMESPACE = "custom";

export const PRODUCT_METAFIELDS = [
  { key: "fabric", name: "Fabric", type: "single_line_text_field" },
  { key: "colour", name: "Colour", type: "single_line_text_field" },
  { key: "fabric_notes", name: "Fabric & craft", type: "multi_line_text_field" },
  { key: "fit_notes", name: "Fit notes", type: "multi_line_text_field" },
  { key: "care_instructions", name: "Care instructions", type: "multi_line_text_field" },
  { key: "bestseller_rank", name: "Bestseller rank", type: "number_integer" },
] as const;

export const COLLECTION_METAFIELDS = [
  { key: "kind", name: "Kind (category or story)", type: "single_line_text_field" },
  { key: "tagline", name: "Tagline", type: "single_line_text_field" },
  { key: "position", name: "Menu position", type: "number_integer" },
] as const;

export const TAG_NEW = "new";
export const TAG_LIMITED = "limited-edition";
export const TAG_FEATURED = "featured";
export const CATEGORY_TAG_PREFIX = "category:";
export const COLLECTION_TAG_PREFIX = "collection:";

export const SIZE_OPTION = "Size";

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
