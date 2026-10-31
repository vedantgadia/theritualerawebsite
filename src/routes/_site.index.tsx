import { Link, createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { getCatalog, getCategories, getCollections, type CatalogProduct } from "@/lib/shop.functions";
import { formatINR } from "@/lib/format";
import { ProductCard } from "@/components/site/product-card";
import { Marquee, Parallax, ScrollWords, Spool, StitchDivider, useCycle } from "@/components/site/motion";
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
    const [all, categories, collections] = await Promise.all([getCatalog({ data: {} }), getCategories(), getCollections()]);
    return { all, categories, collections };
  },
  component: Home,
});

const HERO_LOOKS = ["feather-co-ord-set", "amaya-shirt", "sora-dress", "ajrakh-jacket", "cherrie-pie-dress"];
const LOOKBOOK_STRIP = [
  "bubblegum-shirt", "elara-dress", "the-veda-shirt", "threadwork-shirt", "midori-top", "sienna-top", "aqua-tunic",
  "queen-of-hearts-top", "dopamine-dress", "linear-co-ord", "wave-collared-top", "soil-dress", "green-co-ord", "chin-chin-top",
];
const SLIDE_MS = 5500;

const ctaPrimary =
  "group/cta inline-flex h-12 items-center justify-center gap-3 rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]";
const ctaOutline =
  "inline-flex h-12 items-center justify-center rounded-[2px] border border-ink/25 bg-ivory/40 px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink hover:bg-ivory";
const textLink =
  "relative font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:text-ritual after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-50";

function Arrow() {
  return (
    <svg width="18" height="8" viewBox="0 0 18 8" fill="none" stroke="currentColor" strokeWidth="1" className="transition-transform duration-500 group-hover/cta:translate-x-1" aria-hidden>
      <path d="M0 4h17M13.5 0.5 17 4l-3.5 3.5" />
    </svg>
  );
}

function SectionHead({ eyebrow, title, link }: { eyebrow: string; title: React.ReactNode; link?: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 sm:mb-12">
      <div className="reveal">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display text-[2rem] leading-tight text-ink sm:text-5xl">{title}</h2>
      </div>
      {link}
    </div>
  );
}

function Home() {
  const { all, categories, collections } = Route.useLoaderData();
  const ref = useReveal();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const pick = (slugs: string[]) => slugs.map((s) => bySlug.get(s)).filter((p): p is CatalogProduct => !!p);

  const newArrivals = all.filter((p) => p.isNew).slice(0, 10);
  const bestsellers = all
    .filter((p) => p.bestsellerRank != null)
    .sort((a, b) => a.bestsellerRank! - b.bestsellerRank!)
    .slice(0, 4);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <Hero looks={pick(HERO_LOOKS)} />

      {/* Ticker */}
      <div className="border-y border-ritual bg-ritual py-3.5 text-ivory">
        <Marquee duration={45}>
          {["Denim, Reimagined", "Made in-house in Mumbai", "Crochet", "Ajrakh", "Chanderi", "Limited editions", "Her Forever Prêt", "Hand embroidery"].map((t) => (
            <span key={t} className="flex items-center whitespace-nowrap font-display text-lg italic sm:text-xl">
              <span className="px-6 sm:px-10">{t}</span>
              <span className="text-[10px] not-italic text-gold">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* Manifesto — words light up on scroll */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center sm:py-36">
        <p className="eyebrow mb-8">The ritual</p>
        <ScrollWords
          text="Getting dressed is one of the first rituals of the day — a quiet moment that sets the tone for everything that follows."
          className="font-display text-[1.9rem] leading-[1.25] text-ink sm:text-5xl sm:leading-[1.2]"
        />
        <StitchDivider className="mx-auto mt-14 max-w-xs" />
        <p className="mt-8 text-sm font-light text-washed">We don't design for a season. We design beyond it.</p>
      </section>

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 sm:pb-28">
        <SectionHead eyebrow="Clothing" title="Shop by category" link={<Link to="/shop" className={`${textLink} hidden sm:inline`}>All clothing</Link>} />
        <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-4 sm:overflow-visible sm:px-0">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              to="/shop/$category"
              params={{ category: c.slug }}
              className="reveal group relative block w-[46%] flex-none snap-start sm:w-auto"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="img-zoom aspect-[3/4] bg-sand/40 sm:aspect-[2/3]">
                <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between bg-ivory/95 px-3 py-2.5 sm:inset-x-3 sm:bottom-3">
                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink">{c.name}</span>
                <span className="text-ritual transition-transform duration-500 group-hover:translate-x-1" aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <NewArrivals products={newArrivals} />

      {/* Denim, Reimagined — with a shoppable hotspot */}
      <section className="stitch-lattice overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="relative">
            <div className="reveal-img">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] bg-sand/40">
                <img src="/media/products/editorial-3.webp" alt="Cobalt feather-embroidered denim co-ord set" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
            <Hotspot product={bySlug.get("feather-co-ord-set")} x={46} y={36} />
            <Hotspot product={bySlug.get("feather-co-ord-set")} x={44} y={84} label="Feather cut-work" />
          </div>
          <div>
            <div className="reveal max-w-md">
              <p className="eyebrow mb-4">The heart of the label</p>
              <h2 className="font-display text-5xl leading-[1.02] text-ink sm:text-6xl">
                Denim, <br />
                <em className="font-normal italic text-ritual">Reimagined</em>
              </h2>
              <p className="mt-6 text-[15px] font-light leading-relaxed text-deep-denim">
                We piece indigo with ajrakh silk, frame it with crochet, trace it with sashiko-style running stitch and scatter it with tiny hand-embroidered cherries. Familiar, but never ordinary.
              </p>
              <Link to="/collections/$slug" params={{ slug: "denim-reimagined" }} className={`${ctaPrimary} mt-8`}>
                Shop the story <Arrow />
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-3 sm:gap-4">
              {pick(["dune-shirt", "cherie-pie-top", "striped-denim-shirt"]).map((p, i) => (
                <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="reveal group block" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="img-zoom aspect-[4/5] bg-sand/40">
                    <img src={p.images[1] ?? p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-2 text-xs text-ink group-hover:text-ritual">{p.name}</p>
                  <p className="text-[11px] font-light text-washed">{formatINR(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Difference />

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
        <SectionHead eyebrow="Most loved" title="Bestsellers" link={<Link to="/bestsellers" className={textLink}>Shop all</Link>} />
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {bestsellers.map((p, i) => (
            <div key={p.id} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="mb-3 flex items-baseline gap-3 border-b border-dashed border-taupe/30 pb-2">
                <span className="font-display text-2xl italic text-ritual">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-taupe">Most loved</span>
              </p>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <CollectionsShowcase collections={collections} />

      {/* Lookbook strip — moves continuously, pauses on hover */}
      <section className="border-y border-border bg-sand/30 py-20 sm:py-24">
        <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-8">
          <p className="eyebrow mb-3">The Lookbook</p>
          <h2 className="font-display text-[2rem] text-ink sm:text-5xl">
            Worn, repeated, <em className="font-normal italic text-ritual">reimagined</em>
          </h2>
          <a href="https://instagram.com/theritualera" target="_blank" rel="noreferrer" className={`${textLink} mt-6 inline-block`}>
            @theritualera
          </a>
        </div>
        <Marquee duration={70} pauseOnHover>
          {pick(LOOKBOOK_STRIP).map((p) => (
            <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group relative mx-1.5 block w-48 flex-none sm:mx-2 sm:w-64">
              <div className="aspect-[4/5] overflow-hidden bg-sand/40">
                <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
              </div>
              <div className="absolute inset-x-2 bottom-2 translate-y-2 bg-ivory/95 px-3 py-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs text-ink">{p.name}</p>
                <p className="text-[11px] font-light text-washed">{formatINR(p.price)}</p>
              </div>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* Service */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-4">
        {[
          ["Free shipping", "On orders above ₹5,000", "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01"],
          ["Easy exchanges", "Within 7 days of delivery", "M4 9h13l-3-3M20 15H7l3 3"],
          ["Secure payments", "UPI, cards & netbanking", "M5 11h14v9H5zM8 11V8a4 4 0 0 1 8 0v3M12 15v2"],
          ["Here to help", "WhatsApp us, 10am – 7pm", "M4 5h16v11H9l-5 4V5zM8 10h8M8 13h5"],
        ].map(([title, sub, d], i) => (
          <div key={title} className={`reveal flex flex-col items-center px-4 py-10 text-center ${i % 2 ? "" : "border-r"} border-dashed border-taupe/30 sm:border-r ${i === 3 ? "sm:border-r-0" : ""}`} style={{ transitionDelay: `${i * 90}ms` }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1f3a5f" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
              <path d={d} />
            </svg>
            <p className="mt-4 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink">{title}</p>
            <p className="mt-1.5 text-xs font-light text-washed">{sub}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ What makes it different */

const DIFFERENCE = [
  {
    title: "Denim, at the heart",
    body: "Every collection begins with denim — pieced, panelled and paired with Indian textiles you won't find on a high-street rail.",
    icon: "M6 3h12l1 18h-5l-2-9-2 9H5L6 3zM6 7h12M9 3v4M15 3v4",
  },
  {
    title: "Made in our Mumbai studio",
    body: "Designed, cut and stitched in-house, so every seam passes through hands we know by name.",
    icon: "M4 20V10l8-6 8 6v10H4zM9 20v-5h6v5M4 20h16",
  },
  {
    title: "Limited by design",
    body: "Small runs, never mass-produced. When a piece sells out it rarely returns — which is what makes it yours.",
    icon: "M12 3v4M7 7h10l2 14H5L7 7zM10 12h4",
  },
  {
    title: "Craft you notice up close",
    body: "Hand embroidery, crochet panels, ajrakh blocks and sashiko-inspired running stitch — details made to be looked at twice.",
    icon: "M12 12c-3-5-7-4-7-1s4 3 7 1zm0 0c3-5 7-4 7-1s-4 3-7 1zm0 0c-4 3-4 7-1 7s3-4 1-7zM12 12v9",
  },
  {
    title: "Made to your measure",
    body: "Between sizes, or want a longer hem? Message us and we'll cut the piece to your measurements.",
    icon: "M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2",
  },
  {
    title: "Designed beyond a season",
    body: "Elevated essentials made to be worn, repeated and reimagined for years — never a passing trend.",
    icon: "M12 3a9 9 0 1 0 9 9M12 7v5l3 3M21 3v6h-6",
  },
];

function Difference() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-ivory">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Heading + craft image, held in place while the list scrolls */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="reveal">
            <p className="eyebrow mb-4">Why it feels different</p>
            <h2 className="font-display text-[2.4rem] leading-[1.05] text-ink sm:text-6xl">
              Made with <em className="font-normal italic text-ritual">intention</em>
            </h2>
            <p className="mt-5 max-w-sm text-[15px] font-light leading-relaxed text-deep-denim">
              Six things we never compromise on — from the first sketch to the last running stitch.
            </p>
          </div>
          <div className="relative mt-10 hidden max-w-md lg:block">
            <div className="reveal-img">
              <div className="aspect-[5/4] overflow-hidden">
                <img src="/media/craft.jpg" alt="Hands sashiko-stitching dark denim" loading="lazy" className="h-full w-full object-cover" />
              </div>
            </div>
            <Parallax speed={0.08} className="absolute -bottom-8 -right-8 w-32">
              <div className="stitch-lattice flex aspect-square items-center justify-center rounded-full border border-ritual/20 text-center shadow-[0_16px_30px_-18px_rgba(15,34,51,0.4)]">
                <p className="font-script text-3xl leading-none text-ritual">
                  by hand
                </p>
              </div>
            </Parallax>
          </div>
        </div>

        <ol className="divide-y divide-dashed divide-taupe/30 border-y border-dashed border-taupe/30">
          {DIFFERENCE.map((d, i) => (
            <li key={d.title} className="reveal group grid grid-cols-[auto_1fr] gap-x-5 py-7 sm:grid-cols-[3.5rem_auto_1fr] sm:gap-x-6 sm:py-8" style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
              <span className="hidden pt-1 font-display text-2xl italic text-gold sm:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ritual/25 text-ritual transition-colors duration-500 group-hover:border-ritual group-hover:bg-ritual group-hover:text-ivory">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" aria-hidden>
                  <path d={d.icon} />
                </svg>
              </span>
              <div className="col-start-2 sm:col-start-3">
                <h3 className="font-display text-2xl text-ink transition-colors duration-500 group-hover:text-ritual">{d.title}</h3>
                <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-washed">{d.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero({ looks }: { looks: CatalogProduct[] }) {
  const [active, setActive] = useCycle(looks.length, SLIDE_MS);
  const look = looks[active];

  return (
    <section className="stitch-lattice relative overflow-hidden border-b border-border">
      <div className="mx-auto grid max-w-7xl items-center gap-y-10 px-4 pb-16 pt-8 sm:px-8 lg:min-h-[calc(100svh-150px)] lg:grid-cols-12 lg:gap-x-10 lg:py-14">
        {/* Copy */}
        <div className="relative order-2 text-center lg:order-1 lg:col-span-5 lg:text-left">
          <p className="eyebrow rise-in" style={{ animationDelay: "0.1s" }}>Autumn Edit · 2026</p>
          <h1 className="mt-5 font-display text-[3.4rem] leading-[0.95] text-ritual sm:text-7xl xl:text-[5.6rem]">
            <span className="rise-in block" style={{ animationDelay: "0.25s" }}>Her</span>
            <span className="rise-in block" style={{ animationDelay: "0.4s" }}>Forever</span>
            <em className="rise-in block font-normal" style={{ animationDelay: "0.55s" }}>Prêt</em>
          </h1>

          {/* Thread running from the headline into a spool, as in the logo */}
          <div className="mx-auto mt-4 flex w-56 items-end lg:mx-0 lg:w-64" aria-hidden>
            <svg viewBox="0 0 220 60" className="h-12 flex-1 text-ritual" fill="none">
              <mask id="hero-thread">
                <path d="M2 8 H120 C 150 8, 160 10, 168 22 S 178 48, 196 50" pathLength="1" stroke="#fff" strokeWidth="4" className="thread-in" />
              </mask>
              <path d="M2 8 H120 C 150 8, 160 10, 168 22 S 178 48, 196 50" stroke="currentColor" strokeWidth="1.3" strokeDasharray="5 4" mask="url(#hero-thread)" className="opacity-70" />
              <circle cx="196" cy="50" r="3" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <Spool className="spool -ml-1 mb-0 h-10 w-8 text-ritual" />
          </div>

          <p className="rise-in mx-auto mt-5 max-w-md text-[15px] font-light leading-relaxed text-deep-denim lg:mx-0" style={{ animationDelay: "0.8s" }}>
            Elevated everyday silhouettes, made in-house in Mumbai. Denim, reimagined through crochet, ajrakh, chanderi and hand embroidery.
          </p>
          <div className="rise-in mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start" style={{ animationDelay: "1s" }}>
            <Link to="/new-arrivals" className={ctaPrimary}>
              Shop new arrivals <Arrow />
            </Link>
            <Link to="/collections" className={ctaOutline}>Explore collections</Link>
          </div>
        </div>

        {/* Imagery */}
        <div className="relative order-1 lg:order-2 lg:col-span-7">
          <div className="relative mx-auto max-w-[620px] pb-10 lg:pb-14">
            <div className="relative ml-auto aspect-[4/5] w-[78%] overflow-hidden rounded-t-[999px] bg-sand/50 shadow-[0_30px_60px_-30px_rgba(15,34,51,0.35)] lg:w-[70%]">
              {looks.map((p, i) => (
                <img
                  key={p.slug}
                  src={p.images[0]}
                  alt={i === active ? p.name : ""}
                  aria-hidden={i !== active}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${i === active ? "kenburns opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>

            {/* Detail close-up of the same garment, drifting on scroll */}
            <Parallax speed={0.1} className="absolute bottom-0 left-0 w-[40%] lg:w-[36%]">
              <div className="relative aspect-[4/5] overflow-hidden border-[6px] border-ivory bg-sand/50 shadow-[0_24px_50px_-24px_rgba(15,34,51,0.4)]">
                {looks.map((p, i) => (
                  <img
                    key={p.slug}
                    src={p.images[1] ?? p.images[0]}
                    alt=""
                    aria-hidden
                    loading={i === 0 ? "eager" : "lazy"}
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1400ms] ${i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                  />
                ))}
              </div>
              <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.22em] text-taupe">The detail</p>
            </Parallax>

            {/* Now wearing */}
            {look && (
              <Link
                key={look.slug}
                to="/product/$slug"
                params={{ slug: look.slug }}
                className="rise-in group absolute right-0 top-[8%] hidden min-w-48 bg-ivory/95 px-4 py-3 shadow-[0_12px_30px_-16px_rgba(15,34,51,0.35)] sm:block lg:-right-4"
              >
                <p className="font-sans text-[9px] uppercase tracking-[0.22em] text-taupe">Now wearing</p>
                <p className="mt-1 font-display text-lg leading-tight text-ink group-hover:text-ritual">{look.name}</p>
                <p className="mt-0.5 text-[11px] font-light text-washed">{look.fabric} · {formatINR(look.price)}</p>
              </Link>
            )}
          </div>

          {/* Slide progress */}
          <div className="mx-auto mt-6 flex max-w-[620px] items-center justify-end gap-4">
            <span className="font-sans text-[10px] tracking-[0.2em] text-taupe">
              {String(active + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}
            </span>
            <div className="flex gap-1.5">
              {looks.map((p, i) => (
                <button key={p.slug} onClick={() => setActive(i)} aria-label={`Show ${p.name}`} className="relative h-6 w-10 sm:w-14">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-ink/20" />
                  <span
                    key={i === active ? `on-${active}` : "off"}
                    className="absolute left-0 top-1/2 h-px bg-ritual"
                    style={i === active ? { animation: `slide-progress ${SLIDE_MS}ms linear forwards` } : { width: i < active ? "100%" : "0%" }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes slide-progress { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ New arrivals carousel */

function NewArrivals({ products }: { products: CatalogProduct[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section className="border-y border-border bg-sand/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
        <SectionHead
          eyebrow="Just in"
          title={<>New <em className="font-normal italic text-ritual">Arrivals</em></>}
          link={
            <div className="flex items-center gap-5">
              <Link to="/new-arrivals" className={textLink}>View all</Link>
              <div className="hidden gap-2 sm:flex">
                {([-1, 1] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => scrollBy(d)}
                    aria-label={d < 0 ? "Previous" : "Next"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
                  >
                    <svg width="14" height="8" viewBox="0 0 18 8" fill="none" stroke="currentColor" strokeWidth="1" className={d < 0 ? "rotate-180" : ""}>
                      <path d="M0 4h17M13.5 0.5 17 4l-3.5 3.5" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          }
        />
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
          }}
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:gap-6 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p, i) => (
            <div key={p.id} className="reveal w-[64%] flex-none snap-start sm:w-[38%] lg:w-[calc((100%-4.5rem)/4)]" style={{ transitionDelay: `${Math.min(i, 4) * 90}ms` }}>
              <ProductCard product={p} priority={i < 4} />
            </div>
          ))}
        </div>
        <div className="mt-10 h-px bg-ink/10">
          <div className="h-px bg-ritual transition-[width] duration-300" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Hotspot */

function Hotspot({ product, x, y, label }: { product: CatalogProduct | undefined; x: number; y: number; label?: string }) {
  if (!product) return null;
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`Shop ${product.name}`}
    >
      <span className="pulse-ring absolute inset-0 rounded-full bg-ivory/70" />
      <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-ivory text-sm text-ritual shadow-md transition-transform duration-300 group-hover:scale-110">+</span>
      <span className="pointer-events-none absolute left-8 top-1/2 w-44 -translate-y-1/2 translate-x-1 bg-ivory px-3 py-2 opacity-0 shadow-[0_12px_30px_-16px_rgba(15,34,51,0.4)] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span className="block font-sans text-[9px] uppercase tracking-[0.2em] text-taupe">{label ?? "Shop the look"}</span>
        <span className="mt-0.5 block text-xs text-ink">{product.name}</span>
        <span className="block text-[11px] font-light text-washed">{formatINR(product.price)}</span>
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ Collections */

function CollectionsShowcase({ collections }: { collections: { slug: string; name: string; tagline: string; coverImage: string; count: number }[] }) {
  const [hovered, setHovered] = useState(0);

  return (
    <section className="stitch-lattice-ink overflow-hidden text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
        <div className="reveal mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-sand">Collections</p>
            <h2 className="font-display text-[2rem] leading-tight text-ivory sm:text-5xl">
              Stories in <em className="font-normal italic text-blush">cloth</em>
            </h2>
          </div>
          <Link to="/collections" className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ivory underline decoration-ivory/40 underline-offset-[6px] hover:decoration-ivory">
            All collections
          </Link>
        </div>

        {/* Desktop: hover a name to change the picture */}
        <div className="hidden items-center gap-16 lg:grid lg:grid-cols-[1.1fr_1fr]">
          <ul>
            {collections.map((c, i) => (
              <li key={c.slug} className="border-b border-dashed border-ivory/20 first:border-t">
                <Link
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  className="group flex items-baseline gap-6 py-5"
                >
                  <span className="w-8 font-sans text-[10px] tracking-[0.2em] text-sand/70">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`font-display text-4xl transition-all duration-500 ${hovered === i ? "translate-x-2 text-ivory" : "text-ivory/45"}`}>
                    {c.name}
                  </span>
                  <span className={`ml-auto font-sans text-[10px] uppercase tracking-[0.2em] transition-opacity duration-500 ${hovered === i ? "opacity-100" : "opacity-0"}`}>
                    {c.count} pieces →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-t-[999px]">
            {collections.map((c, i) => (
              <img
                key={c.slug}
                src={c.coverImage}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${hovered === i ? "scale-100 opacity-100" : "scale-105 opacity-0"}`}
              />
            ))}
            <p key={hovered} className="rise-in absolute inset-x-6 bottom-6 bg-ivory/95 px-4 py-3 text-center font-display text-base italic text-ink">
              {collections[hovered]?.tagline}
            </p>
          </div>
        </div>

        {/* Mobile: swipeable cards */}
        <div className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 lg:hidden">
          {collections.map((c) => (
            <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} className="block w-[72%] flex-none snap-start">
              <div className="aspect-[4/5] overflow-hidden rounded-t-[999px]">
                <img src={c.coverImage} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 font-display text-2xl">{c.name}</p>
              <p className="mt-1 text-xs font-light text-sand">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
