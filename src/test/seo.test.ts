import { describe, expect, it } from "vitest";
import { MOCK_PRODUCTS } from "@/lib/mock-catalog";
import { absoluteUrl, jsonLdScript, productJsonLd, seo } from "@/lib/seo";

const ORIGIN = "https://shop.example";

describe("seo helpers", () => {
  it("makes local paths absolute and leaves full URLs alone", () => {
    expect(absoluteUrl("/media/a.webp", ORIGIN)).toBe("https://shop.example/media/a.webp");
    expect(absoluteUrl("https://cdn.shopify.com/x.webp", ORIGIN)).toBe(
      "https://cdn.shopify.com/x.webp",
    );
  });

  it("gives every page matching title, description and image tags", () => {
    const meta = seo({ title: "Bestsellers", description: "Loved pieces.", origin: ORIGIN });
    const get = (k: string) =>
      meta.find((m) => ("property" in m && m.property === k) || ("name" in m && m.name === k));
    expect(meta[0]).toEqual({ title: "Bestsellers | The Ritual Era" });
    expect(get("og:title")?.content).toBe("Bestsellers | The Ritual Era");
    expect(get("twitter:description")?.content).toBe("Loved pieces.");
    expect(get("og:image")?.content).toBe("https://shop.example/media/products/hero-cover.webp");
  });

  it("describes a product for search engines", () => {
    const p = MOCK_PRODUCTS.find((x) => x.sizes.some((s) => s.stock > 0))!;
    const ld = productJsonLd(p, ORIGIN);
    expect(ld).toMatchObject({
      "@type": "Product",
      name: p.name,
      brand: { name: "The Ritual Era" },
      offers: {
        priceCurrency: "INR",
        price: p.price.toFixed(2),
        availability: "https://schema.org/InStock",
        url: `${ORIGIN}/product/${p.slug}`,
      },
    });
    expect(ld.image.every((u) => u.startsWith(ORIGIN) || u.startsWith("https://"))).toBe(true);
    const soldOut = productJsonLd(
      { ...p, sizes: p.sizes.map((s) => ({ ...s, stock: 0 })) },
      ORIGIN,
    );
    expect(soldOut.offers.availability).toBe("https://schema.org/OutOfStock");
  });

  it("cannot close its own script tag", () => {
    expect(jsonLdScript({ name: "</script><script>x" }).children).not.toContain("</script>");
  });
});
