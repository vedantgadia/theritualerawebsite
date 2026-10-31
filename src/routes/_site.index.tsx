import { Link, createFileRoute } from "@tanstack/react-router";
import { getCatalog, getCategories, getCollections } from "@/lib/shop.functions";
import { ProductCard } from "@/components/site/product-card";
import { SectionHeading, ThreadDivider } from "@/components/site/bits";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "The Ritual Era — Her Forever Prêt" },
      {
        name: "description",
        content: "Elevated everyday womenswear, designed and made in-house in Mumbai. Denim reimagined through Indian textiles, crochet, ajrakh and chanderi.",
      },
      { property: "og:image", content: "/media/products/hero-cover.webp" },
    ],
  }),
  loader: async () => {
    const [newArrivals, bestsellers, categories, collections, denim] = await Promise.all([
      getCatalog({ data: { isNew: true, limit: 8 } }),
      getCatalog({ data: { bestseller: true, limit: 4 } }),
      getCategories(),
      getCollections(),
      getCatalog({ data: { collection: "denim-reimagined", featured: true, limit: 3 } }),
    ]);
    return { newArrivals, bestsellers, categories, collections, denim };
  },
  component: Home,
});

const ctaPrimary =
  "inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]";
const ctaOutline =
  "inline-flex h-12 items-center justify-center rounded-[2px] border border-ink/25 px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink";
const textLink = "font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink underline decoration-ink/30 underline-offset-[6px] transition-colors hover:text-ritual hover:decoration-ritual";

function Home() {
  const { newArrivals, bestsellers, categories, collections, denim } = Route.useLoaderData();
  const ref = useReveal();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Hero — echoes the lookbook cover: linen panel, script thread, arched photograph */}
      <section className="sashiko-bg-ivory relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-8 sm:px-8 md:grid-cols-2 md:py-16">
          <div className="order-2 text-center md:order-1 md:text-left">
            <p className="eyebrow">The Ritual Era · Autumn Edit 2026</p>
            <h1 className="mt-5 font-display text-5xl leading-[0.98] text-ritual sm:text-6xl lg:text-7xl">
              Her Forever
              <br />
              <em className="font-normal italic">Prêt</em>
            </h1>
            <svg className="mx-auto mt-6 h-6 w-48 md:mx-0" viewBox="0 0 200 24" fill="none" aria-hidden>
              <path className="thread-draw" d="M2 12 C 40 2, 70 22, 110 12 S 170 4, 198 12" stroke="#1f3a5f" strokeOpacity=".45" strokeWidth="1.2" />
            </svg>
            <p className="mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed text-deep-denim md:mx-0">
              Elevated everyday silhouettes, made in-house in Mumbai. Denim, reimagined through crochet, ajrakh, chanderi and hand embroidery.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
              <Link to="/new-arrivals" className={ctaPrimary}>Shop new arrivals</Link>
              <Link to="/collections" className={ctaOutline}>Explore collections</Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="mx-auto aspect-[4/5] max-w-[440px] overflow-hidden rounded-t-[999px] bg-sand/40">
              <img src="/media/products/hero-cover.webp" alt="A model in an indigo block-printed wrap top and white tiered skirt" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="reveal">
            <p className="eyebrow mb-3">Clothing</p>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Shop by category</h2>
          </div>
          <Link to="/shop" className={`${textLink} hidden sm:inline`}>All clothing</Link>
        </div>
        <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0">
          {categories.map((c) => (
            <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} className="reveal group block w-[42%] flex-none snap-start sm:w-auto">
              <div className="img-zoom aspect-[3/4] bg-sand/40">
                <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-ritual">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="border-y border-border bg-sand/25">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div className="reveal">
              <p className="eyebrow mb-3">Just in</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">New Arrivals</h2>
            </div>
            <Link to="/new-arrivals" className={textLink}>View all</Link>
          </div>
          <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:gap-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {newArrivals.map((p, i) => (
              <div key={p.id} className="w-[62%] flex-none snap-start sm:w-[40%] lg:w-auto">
                <ProductCard product={p} priority={i < 4} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured collection — Denim, Reimagined */}
      <section className="sashiko-bg bg-blush/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="reveal">
            <div className="aspect-[4/5] overflow-hidden bg-sand/40">
              <img src="/media/products/editorial-3.webp" alt="Cobalt feather-embroidered denim co-ord set" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <div className="reveal max-w-md">
              <p className="eyebrow mb-3">The heart of the label</p>
              <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
                Denim, <em className="font-normal italic">Reimagined</em>
              </h2>
              <p className="mt-5 text-sm font-light leading-relaxed text-deep-denim">
                We piece indigo with ajrakh silk, frame it with crochet, trace it with sashiko-style running stitch and scatter it with tiny hand-embroidered cherries. Familiar, but never ordinary.
              </p>
              <Link to="/collections/$slug" params={{ slug: "denim-reimagined" }} className={`${ctaPrimary} mt-8`}>
                Shop the story
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-5">
              {denim.map((p) => (
                <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="reveal group block">
                  <div className="img-zoom aspect-[4/5] bg-sand/40">
                    <img src={p.images[1] ?? p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 text-xs font-light text-ink group-hover:text-ritual">{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <SectionHeading eyebrow="Most loved" title="Bestsellers">
          The pieces our community returns to, again and again.
        </SectionHeading>
        <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <div key={p.id} className="reveal">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/bestsellers" className={ctaOutline}>Shop all bestsellers</Link>
        </div>
      </section>

      {/* Collections */}
      <section className="border-t border-border bg-ivory">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div className="reveal">
              <p className="eyebrow mb-3">Collections</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Stories in cloth</h2>
            </div>
            <Link to="/collections" className={textLink}>All collections</Link>
          </div>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((c) => (
              <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} className="reveal group relative block">
                <div className="img-zoom aspect-[4/5] bg-sand/40">
                  <img src={c.coverImage} alt="" loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-ivory/95 px-5 py-4">
                  <p className="font-display text-xl text-ink transition-colors group-hover:text-ritual">{c.name}</p>
                  <p className="mt-0.5 text-xs font-light text-washed">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="border-y border-border bg-sand/50">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <ThreadDivider className="mx-auto mb-10 max-w-xs" />
          <p className="reveal font-display text-2xl leading-snug text-ink sm:text-[2rem]">
            Getting dressed is one of the first <span className="font-script text-4xl leading-[0] text-ritual sm:text-5xl">rituals</span> of the day — a quiet moment that sets the tone for everything that follows.
          </p>
          <p className="reveal mt-8 text-sm font-light text-washed">In a world of fast-changing trends, we choose longevity over excess.</p>
          <Link to="/about" className={`${textLink} mt-8 inline-block`}>Our story</Link>
        </div>
      </section>

      {/* Promises */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {[
          ["Made in Mumbai", "Designed and stitched in-house"],
          ["Limited editions", "Small runs, never mass-made"],
          ["Free shipping", "On orders above ₹5,000"],
          ["Easy exchanges", "Within 7 days of delivery"],
        ].map(([title, sub]) => (
          <div key={title} className="bg-ivory px-4 py-8 text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink">{title}</p>
            <p className="mt-1.5 text-xs font-light text-washed">{sub}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
