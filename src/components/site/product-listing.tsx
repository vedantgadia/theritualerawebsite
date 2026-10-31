import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import type { CatalogProduct } from "@/lib/shop.functions";
import { ProductCard } from "@/components/site/product-card";
import { StitchDivider } from "@/components/site/motion";
import { useReveal } from "@/hooks/use-reveal";

type Sort = "featured" | "newest" | "price-asc" | "price-desc";

const PRICE_BANDS = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under ₹4,000", min: 0, max: 3999 },
  { label: "₹4,000 – ₹5,500", min: 4000, max: 5500 },
  { label: "Above ₹5,500", min: 5501, max: Infinity },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

/** A category tab; no category means "All clothing". */
export interface ListingTab {
  label: string;
  category?: string;
  active: boolean;
}

/** Shared editorial listing: page heading, optional sub-navigation, a quiet filter bar and the product grid. */
export function ProductListing({
  eyebrow,
  title,
  intro,
  products,
  tabs,
  aside,
  defaultSort = "featured",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  products: CatalogProduct[];
  tabs?: ListingTab[];
  aside?: ReactNode;
  defaultSort?: Sort;
}) {
  const [sort, setSort] = useState<Sort>(defaultSort);
  const [size, setSize] = useState<string | null>(null);
  const [band, setBand] = useState(0);
  const ref = useReveal([products.length, sort, size, band]);

  const shown = useMemo(() => {
    const { min, max } = PRICE_BANDS[band]!;
    const list = products.filter(
      (p) => p.price >= min && p.price <= max && (!size || p.sizes.some((s) => s.size === size && s.stock > 0)),
    );
    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [products, sort, size, band]);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="stitch-lattice">
      <header className="mx-auto max-w-7xl px-4 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-16">
        <div className={aside ? "grid items-end gap-8 lg:grid-cols-[1fr_auto]" : ""}>
          <div className="max-w-2xl">
            <p className="eyebrow rise-in mb-3">{eyebrow}</p>
            <h1 className="rise-in font-display text-5xl leading-[1.02] text-ritual sm:text-6xl" style={{ animationDelay: "0.12s" }}>{title}</h1>
            {intro && <div className="rise-in mt-4 max-w-xl text-[15px] font-light leading-relaxed text-deep-denim" style={{ animationDelay: "0.24s" }}>{intro}</div>}
          </div>
          {aside}
        </div>

        {tabs && (
          <nav aria-label="Categories" className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {tabs.map((t) => (
              <Link
                key={t.label}
                {...(t.category ? { to: "/shop/$category", params: { category: t.category } } : { to: "/shop" })}
                className={`whitespace-nowrap rounded-[2px] border px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  t.active ? "border-ritual bg-ritual text-ivory" : "border-ink/15 bg-ivory/70 text-ink/80 hover:border-ink/50 hover:bg-ivory"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      </div>

      <div className="border-y border-border bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-8">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-taupe">
            {shown.length} {shown.length === 1 ? "piece" : "pieces"}
          </p>
          <div className="flex items-center gap-1" role="group" aria-label="Filter by size">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(size === s ? null : s)}
                aria-pressed={size === s}
                className={`h-7 min-w-8 rounded-[2px] px-1.5 font-sans text-[10px] tracking-[0.1em] transition-colors ${
                  size === s ? "bg-ink text-ivory" : "text-ink/70 hover:bg-ink/[0.06]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="sr-only">Price</span>
              <select
                value={band}
                onChange={(e) => setBand(Number(e.target.value))}
                className="bg-transparent font-sans text-[10px] uppercase tracking-[0.16em] text-ink focus:outline-none"
              >
                {PRICE_BANDS.map((b, i) => (
                  <option key={b.label} value={i}>{b.label}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-taupe max-sm:hidden">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-transparent font-sans text-[10px] uppercase tracking-[0.16em] text-ink focus:outline-none"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        {shown.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display text-2xl text-ink">Nothing in this edit just yet</p>
            <p className="mt-2 text-sm font-light text-washed">Try another size or price — or browse everything.</p>
            <button
              onClick={() => {
                setSize(null);
                setBand(0);
              }}
              className="mt-6 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ritual underline underline-offset-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-14">
            {shown.map((p, i) => (
              <div key={p.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
                <ProductCard product={p} priority={i < 4} />
              </div>
            ))}
          </div>
        )}
        <StitchDivider className="mx-auto mt-20 max-w-md" />
      </section>
    </div>
  );
}
