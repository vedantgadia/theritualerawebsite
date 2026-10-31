import { Link, createFileRoute } from "@tanstack/react-router";
import { getCatalog, type CatalogProduct } from "@/lib/shop.functions";
import { CARE_NOTES, STYLE_NOTES, type StyleNote } from "@/lib/style-notes";
import { formatINR } from "@/lib/format";
import { Parallax, StitchDivider } from "@/components/site/motion";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/_site/style-notes")({
  head: () => ({
    meta: [
      { title: "Style Notes — The Ritual Era" },
      {
        name: "description",
        content: "Styling tips from The Ritual Era: how to wear denim, crochet, ajrakh, linen and co-ords, plus care notes for every fabric.",
      },
      { property: "og:image", content: "/media/products/editorial-3.webp" },
    ],
  }),
  loader: () => getCatalog({ data: {} }),
  component: StyleNotes,
});

function StyleNotes() {
  const catalog = Route.useLoaderData();
  const ref = useReveal();
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <header className="stitch-lattice border-b border-border">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <p className="eyebrow rise-in">Style Notes</p>
          <h1 className="rise-in mt-4 max-w-3xl font-display text-5xl leading-[1.02] text-ritual sm:text-7xl" style={{ animationDelay: "0.12s" }}>
            How we <em className="font-normal italic">wear</em> it
          </h1>
          <p className="rise-in mt-5 max-w-xl text-[15px] font-light leading-relaxed text-deep-denim" style={{ animationDelay: "0.24s" }}>
            Small styling rituals from our studio — ways to wear each piece more often, and love it for longer.
          </p>
          <nav aria-label="Style notes" className="rise-in -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" style={{ animationDelay: "0.36s" }}>
            {STYLE_NOTES.map((n, i) => (
              <a
                key={n.slug}
                href={`#${n.slug}`}
                className="whitespace-nowrap rounded-[2px] border border-ink/15 bg-ivory/70 px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink/80 transition-colors hover:border-ritual hover:bg-ritual hover:text-ivory"
              >
                <span className="mr-2 text-taupe">{String(i + 1).padStart(2, "0")}</span>
                {n.title}
              </a>
            ))}
            <a
              href="#care"
              className="whitespace-nowrap rounded-[2px] border border-ink/15 bg-ivory/70 px-4 py-2 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ink/80 transition-colors hover:border-ritual hover:bg-ritual hover:text-ivory"
            >
              Care rituals
            </a>
          </nav>
        </div>
      </header>

      {STYLE_NOTES.map((note, i) => (
        <Story key={note.slug} note={note} index={i} products={note.products.map((s) => bySlug.get(s)).filter((p): p is CatalogProduct => !!p)} />
      ))}

      {/* Care */}
      <section id="care" className="stitch-lattice-ink scroll-mt-24 text-ivory">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-8 sm:py-28">
          <div className="reveal max-w-2xl">
            <p className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-sand">Care rituals</p>
            <h2 className="font-display text-[2.2rem] leading-tight text-ivory sm:text-5xl">
              Made to last, <em className="font-normal italic text-blush">cared for</em> to last longer
            </h2>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-ivory/15 bg-ivory/15 sm:grid-cols-2 lg:grid-cols-5">
            {CARE_NOTES.map((c, i) => (
              <div key={c.fabric} className="reveal bg-ritual p-6" style={{ transitionDelay: `${i * 80}ms` }}>
                <p className="font-display text-xl italic text-blush">{c.fabric}</p>
                <p className="mt-3 text-sm font-light leading-relaxed text-ivory/85">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-24">
        <StitchDivider className="mx-auto mb-10 max-w-xs" />
        <p className="font-display text-3xl text-ink sm:text-4xl">
          Need a second <em className="font-normal italic text-ritual">opinion?</em>
        </p>
        <p className="mt-4 text-sm font-light leading-relaxed text-washed">
          Send us a photo or tell us the occasion — we'll help you find the right piece, size or pairing.
        </p>
        <a
          href={`https://wa.me/919769728791?text=${encodeURIComponent("Hi! I'd love some styling help.")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]"
        >
          Ask us on WhatsApp
        </a>
      </section>
    </div>
  );
}

function Story({ note, index, products }: { note: StyleNote; index: number; products: CatalogProduct[] }) {
  const flip = index % 2 === 1;
  return (
    <section id={note.slug} className={`scroll-mt-24 border-b border-border ${flip ? "bg-sand/25" : "bg-ivory"}`}>
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20">
        {/* Imagery: the look, with a drifting close-up */}
        <div className={`relative pb-12 lg:sticky lg:top-24 ${flip ? "lg:order-2" : ""}`}>
          <div className="reveal-img">
            <div className={`aspect-[4/5] w-[86%] overflow-hidden bg-sand/40 ${flip ? "ml-auto" : ""}`}>
              <img src={note.image} alt={note.title} loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover" />
            </div>
          </div>
          <Parallax speed={0.1} className={`absolute bottom-0 w-[38%] ${flip ? "left-0" : "right-0"}`}>
            <div className="aspect-[4/5] overflow-hidden border-[6px] border-ivory bg-sand/40 shadow-[0_24px_50px_-24px_rgba(15,34,51,0.4)]">
              <img src={note.detail} alt="" aria-hidden loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Parallax>
        </div>

        {/* Notes */}
        <div className={flip ? "lg:order-1" : ""}>
          <div className="reveal">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-taupe">
              Note {String(index + 1).padStart(2, "0")} · {note.kicker}
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] text-ink sm:text-5xl">{note.title}</h2>
            <p className="mt-5 text-[15px] font-light leading-relaxed text-deep-denim">{note.intro}</p>
          </div>

          <ol className="mt-10 space-y-7">
            {note.tips.map((t, i) => (
              <li key={t.title} className="reveal flex gap-5" style={{ transitionDelay: `${i * 100}ms` }}>
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-dashed border-ritual/50 font-display text-sm italic text-ritual">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl text-ink">{t.title}</h3>
                  <p className="mt-1.5 text-sm font-light leading-relaxed text-washed">{t.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {products.length > 0 && (
            <div className="reveal mt-12">
              <p className="eyebrow mb-4 border-b border-dashed border-taupe/30 pb-3">Shop the look</p>
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {products.map((p) => (
                  <Link key={p.id} to="/product/$slug" params={{ slug: p.slug }} className="group block">
                    <div className="img-zoom aspect-[4/5] bg-sand/40">
                      <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <p className="mt-2 text-[11px] leading-snug text-ink group-hover:text-ritual sm:text-xs">{p.name}</p>
                    <p className="text-[10px] font-light text-washed sm:text-[11px]">{formatINR(p.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
