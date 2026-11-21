/*
 * Turning the bag into Shopify cart lines. Pure, so it can be unit tested.
 * The bag only says *what* the shopper wants (product + size + quantity);
 * the variant, price and stock always come from Shopify.
 */
import type { CatalogProduct } from "@/lib/catalog";

export interface BagLine {
  slug: string;
  size: string;
  quantity: number;
}

export type ResolvedLines =
  | { ok: true; lines: { merchandiseId: string; quantity: number }[] }
  | { ok: false; problems: string[] };

export function resolveBagLines(bag: BagLine[], products: CatalogProduct[]): ResolvedLines {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const merged = new Map<string, number>();
  const problems: string[] = [];

  for (const line of bag) {
    const product = bySlug.get(line.slug);
    const size = product?.sizes.find((s) => s.size === line.size);
    if (!product || !size?.variantId) {
      problems.push(
        `${product?.name ?? "One piece in your bag"}${product ? ` (${line.size})` : ""} is no longer available.`,
      );
      continue;
    }
    const quantity = (merged.get(size.variantId) ?? 0) + line.quantity;
    if (size.stock <= 0) {
      problems.push(`${product.name} in ${line.size} has just sold out.`);
      continue;
    }
    if (quantity > size.stock) {
      problems.push(
        `Only ${size.stock} of ${product.name} in ${line.size} left — please lower the quantity.`,
      );
      continue;
    }
    merged.set(size.variantId, quantity);
  }

  if (problems.length) return { ok: false, problems };
  return {
    ok: true,
    lines: [...merged].map(([merchandiseId, quantity]) => ({ merchandiseId, quantity })),
  };
}
