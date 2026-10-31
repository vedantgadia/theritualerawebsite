import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { getCollections, getProductBySlug, getRelatedProducts } from "@/lib/shop.functions";
import { formatINR } from "@/lib/format";
import { useBag } from "@/lib/cart";
import { Accordion, Badge, Button, Sheet } from "@/components/ui/brand";
import { ProductCard } from "@/components/site/product-card";
import { ThreadDivider } from "@/components/site/bits";

export const Route = createFileRoute("/_site/product/$slug")({
  loader: async ({ params }) => {
    const product = await getProductBySlug({ data: { slug: params.slug } });
    if (!product) throw notFound();
    const [related, collections] = await Promise.all([
      getRelatedProducts({ data: { categorySlug: product.categorySlug, excludeSlug: product.slug } }),
      getCollections(),
    ]);
    return { product, related, collections: collections.filter((c) => product.collections.includes(c.slug)) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — The Ritual Era` },
          { name: "description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.images[0] ?? "" },
        ]
      : [],
  }),
  component: ProductPage,
});

const SIZE_CHART = [
  ["XS", "32", "26", "35", "14"],
  ["S", "34", "28", "37", "14.5"],
  ["M", "36", "30", "39", "15"],
  ["L", "38", "32", "41", "15.5"],
  ["XL", "40", "34", "43", "16"],
];

function ProductPage() {
  const { product, related, collections } = Route.useLoaderData();
  const bag = useBag();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  const totalStock = product.sizes.reduce((s, sz) => s + sz.stock, 0);
  const selected = product.sizes.find((s) => s.size === size);

  function addToBag() {
    if (!size) {
      setError(true);
      return;
    }
    bag.addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      image: product.images[0] ?? "",
      quantity: 1,
    });
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
        <ol className="flex flex-wrap items-center gap-2 font-sans text-[10px] uppercase tracking-[0.18em] text-taupe">
          <li><Link to="/" className="hover:text-ritual">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link to="/shop" className="hover:text-ritual">Clothing</Link></li>
          {product.categorySlug && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link to="/shop/$category" params={{ category: product.categorySlug }} className="hover:text-ritual">
                  {product.categoryName}
                </Link>
              </li>
            </>
          )}
        </ol>
      </nav>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-6 sm:px-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        {/* Gallery: thumbnails + main image on desktop, swipeable strip on mobile */}
        <div className="lg:grid lg:grid-cols-[72px_1fr] lg:gap-4">
          <div className="hidden flex-col gap-3 lg:flex">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={`aspect-[4/5] overflow-hidden border transition-colors ${active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="hidden lg:block">
            <div className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-sand/40">
              <img
                src={product.images[active]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.6]"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
                }}
              />
            </div>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 lg:hidden">
            {product.images.map((src, i) => (
              <img key={src} src={src} alt={i === 0 ? product.name : ""} className="aspect-[4/5] w-[86%] flex-none snap-center object-cover" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="lg:sticky lg:top-36 lg:self-start">
          <div className="flex flex-wrap gap-1.5">
            {product.isNew && <Badge tone="ink">New</Badge>}
            {product.limitedEdition && <Badge tone="gold">Limited Edition</Badge>}
            {totalStock > 0 && totalStock <= 2 && <Badge tone="rust">Only {totalStock} left</Badge>}
          </div>
          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.2em] text-taupe">{product.fabric} · {product.colour}</p>
          <p className="mt-5 text-lg text-ink">
            {formatINR(product.price)}
            <span className="ml-2 text-xs font-light text-taupe">Inclusive of all taxes</span>
          </p>

          <p className="mt-6 text-sm font-light leading-relaxed text-deep-denim">{product.description}</p>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="eyebrow">Size{size ? ` — ${size}` : ""}</p>
              <button onClick={() => setGuideOpen(true)} className="font-sans text-[10px] uppercase tracking-[0.18em] text-ritual underline underline-offset-4">
                Size guide
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Size">
              {product.sizes.map((s) => {
                const soldOut = s.stock === 0;
                return (
                  <button
                    key={s.size}
                    role="radio"
                    aria-checked={size === s.size}
                    disabled={soldOut}
                    onClick={() => {
                      setSize(s.size);
                      setError(false);
                    }}
                    className={`h-11 rounded-[2px] border font-sans text-xs tracking-[0.1em] transition-colors ${
                      soldOut
                        ? "cursor-not-allowed border-border text-stone line-through"
                        : size === s.size
                          ? "border-ink bg-ink text-ivory"
                          : "border-ink/20 text-ink hover:border-ink"
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 min-h-5 text-xs font-light">
              {error ? (
                <span className="text-terracotta">Please choose a size.</span>
              ) : selected && selected.stock <= 2 ? (
                <span className="text-terracotta">Only {selected.stock} left in {selected.size}.</span>
              ) : null}
            </p>
          </div>

          <Button className="mt-3 w-full" size="lg" onClick={addToBag} disabled={totalStock === 0}>
            {totalStock === 0 ? "Sold out" : "Add to bag"}
          </Button>
          <a
            href={`https://wa.me/919769728791?text=${encodeURIComponent(`Hi! I'd like to request the ${product.name} made to measure.`)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex h-12 w-full items-center justify-center rounded-[2px] border border-ink/25 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink"
          >
            Request made-to-measure
          </a>

          <ul className="mt-6 grid grid-cols-3 gap-2 text-center font-sans text-[9px] uppercase tracking-[0.16em] text-taupe">
            <li className="border border-border px-2 py-3">Made in Mumbai</li>
            <li className="border border-border px-2 py-3">Free shipping over ₹5,000</li>
            <li className="border border-border px-2 py-3">7-day exchange</li>
          </ul>

          <div className="mt-8">
            <Accordion
              items={[
                { title: "Fabric & craft", content: product.fabricNotes },
                { title: "Fit notes", content: product.fitNotes },
                { title: "Care", content: product.careInstructions },
                { title: "Shipping & exchanges", content: product.shippingReturns },
              ]}
            />
          </div>

          {collections.length > 0 && (
            <p className="mt-6 text-xs font-light text-washed">
              Part of{" "}
              {collections.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && " and "}
                  <Link to="/collections/$slug" params={{ slug: c.slug }} className="text-ritual underline underline-offset-4">
                    {c.name}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
            <ThreadDivider className="mx-auto mb-10 max-w-xs" />
            <h2 className="mb-10 text-center font-display text-3xl text-ink">You may also like</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Sheet open={guideOpen} onClose={() => setGuideOpen(false)} title="Size guide">
        <p className="text-sm font-light leading-relaxed text-washed">Body measurements in inches. Between sizes? Size up for a relaxed fit, or message us for made-to-measure.</p>
        <table className="mt-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border font-sans text-[10px] uppercase tracking-[0.16em] text-taupe">
              {["Size", "Bust", "Waist", "Hip", "Shoulder"].map((h) => (
                <th key={h} className="py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row[0]} className="border-b border-border/60">
                {row.map((cell, i) => (
                  <td key={i} className={`py-2.5 ${i === 0 ? "text-ink" : "font-light text-washed"}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Sheet>
    </>
  );
}
