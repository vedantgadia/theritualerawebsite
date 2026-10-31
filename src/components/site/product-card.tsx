import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { CatalogProduct } from "@/lib/shop.functions";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/brand";

export function ProductCard({ product, priority = false }: { product: CatalogProduct; priority?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const totalStock = product.sizes.reduce((s, sz) => s + sz.stock, 0);
  const imgs = product.images.length > 0 ? product.images : ["/media/product-1.jpg"];

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="img-zoom relative aspect-[4/5] overflow-hidden bg-sand/40">
        <img
          src={hovered && imgs[1] ? imgs[1] : imgs[0]}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {imgs[1] && (
          <img
            src={imgs[1]}
            alt=""
            aria-hidden
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${hovered ? "opacity-100" : "opacity-0"}`}
            style={{ display: hovered ? "block" : "none" }}
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.limitedEdition && <Badge tone="gold">Limited Edition</Badge>}
          {totalStock > 0 && totalStock <= 2 && <Badge tone="rust">Only {totalStock} left</Badge>}
          {totalStock === 0 && <Badge tone="ink">Sold out</Badge>}
        </div>
      </div>
      <div className="pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-sm font-light tracking-wide text-ink transition-colors group-hover:text-ritual">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            {product.compareAtPrice != null && (
              <span className="text-xs font-light text-stone line-through">{formatINR(product.compareAtPrice)}</span>
            )}
            <span className="text-sm text-ink">{formatINR(product.price)}</span>
          </div>
        </div>
        {product.categoryName && (
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-taupe">{product.categoryName}</p>
        )}
      </div>
    </Link>
  );
}
