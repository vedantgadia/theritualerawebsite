import { Link } from "@tanstack/react-router";
import type { CatalogProduct } from "@/lib/shop.functions";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/brand";

export function ProductCard({ product, priority = false }: { product: CatalogProduct; priority?: boolean }) {
  const totalStock = product.sizes.reduce((s, sz) => s + sz.stock, 0);
  const imgs = product.images.length > 0 ? product.images : ["/media/product-1.jpg"];

  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-sand/40">
        <img
          src={imgs[0]}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.03]"
        />
        {/* Second image is a close-up of the garment: swaps in on hover so the detail does the talking. */}
        {imgs[1] && (
          <img
            src={imgs[1]}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && <Badge tone="ink">New</Badge>}
          {product.limitedEdition && <Badge tone="gold">Limited Edition</Badge>}
          {totalStock > 0 && totalStock <= 2 && <Badge tone="rust">Only {totalStock} left</Badge>}
          {totalStock === 0 && <Badge tone="ink">Sold out</Badge>}
        </div>
        {totalStock > 0 && (
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-3 bg-ivory/95 py-2.5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 max-lg:hidden">
            {product.sizes.map((s) => (
              <span key={s.size} className={`font-sans text-[10px] tracking-[0.12em] ${s.stock > 0 ? "text-ink" : "text-stone line-through"}`}>
                {s.size}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="pt-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-sans text-[13px] font-normal tracking-wide text-ink transition-colors group-hover:text-ritual sm:text-sm">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            {product.compareAtPrice != null && (
              <span className="text-xs font-light text-stone line-through">{formatINR(product.compareAtPrice)}</span>
            )}
            <span className="text-[13px] text-ink sm:text-sm">{formatINR(product.price)}</span>
          </div>
        </div>
        {(product.fabric || product.categoryName) && (
          <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-taupe">{product.fabric || product.categoryName}</p>
        )}
      </div>
    </Link>
  );
}
