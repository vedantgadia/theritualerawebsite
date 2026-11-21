/*
 * Page metadata for search engines and link previews (WhatsApp, Instagram,
 * Facebook, X). Link previews need absolute image URLs, so local paths like
 * /media/... are prefixed with the address the page was requested on — no
 * hard-coded domain, so it keeps working when the site moves to its own domain.
 */
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { ProductDetail } from "@/lib/catalog";

export const SITE_NAME = "The Ritual Era";
export const DEFAULT_SHARE_IMAGE = "/media/products/hero-cover.webp";

export const siteOrigin = createIsomorphicFn()
  .server(() => new URL(getRequest().url).origin)
  .client(() => window.location.origin);

export const absoluteUrl = (pathOrUrl: string, origin: string = siteOrigin()) =>
  /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${origin}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

export interface SeoInput {
  /** Page name without the brand, e.g. "Bestsellers". Omit for the brand's own title. */
  title?: string;
  description: string;
  image?: string | null | undefined;
  type?: "website" | "product";
  /** Defaults to the address of the current request. */
  origin?: string;
}

export function seo({ title, description, image, type = "website", origin }: SeoInput) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Her Forever Prêt`;
  const img = absoluteUrl(image || DEFAULT_SHARE_IMAGE, origin ?? siteOrigin());
  return [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:image", content: img },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ];
}

/** schema.org Product data, so search results can show price and availability. */
export function productJsonLd(p: ProductDetail, origin: string = siteOrigin()) {
  const inStock = p.sizes.some((s) => s.stock > 0);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((src) => absoluteUrl(src, origin)),
    sku: p.slug,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(p.fabric ? { material: p.fabric } : {}),
    ...(p.colour ? { color: p.colour } : {}),
    ...(p.categoryName ? { category: p.categoryName } : {}),
    offers: {
      "@type": "Offer",
      url: `${origin}/product/${p.slug}`,
      priceCurrency: "INR",
      price: p.price.toFixed(2),
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

/* JSON inside <script> must not be able to close the tag. */
export const jsonLdScript = (data: unknown) => ({
  type: "application/ld+json",
  children: JSON.stringify(data).replace(/</g, "\\u003c"),
});
