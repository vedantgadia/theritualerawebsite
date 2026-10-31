import { Link, createFileRoute } from "@tanstack/react-router";
import { getCollections } from "@/lib/shop.functions";
import { StitchDivider } from "@/components/site/motion";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/_site/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — The Ritual Era" },
      { name: "description", content: "Stories in cloth: Denim Reimagined, Ajrakh Stories, The Crochet Edit, Little Blooms, Linen Days and Chanderi Hours." },
    ],
  }),
  loader: () => getCollections(),
  component: Collections,
});

function Collections() {
  const collections = Route.useLoaderData();
  const ref = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-8 sm:pt-16">
      <header className="rise-in max-w-2xl">
        <p className="eyebrow mb-3">Collections</p>
        <h1 className="font-display text-5xl leading-[1.02] text-ritual sm:text-6xl">Stories in <em className="font-normal italic">cloth</em></h1>
        <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-washed">
          Each collection begins with a fabric or a craft — and the question of how it might live in an everyday wardrobe.
        </p>
      </header>

      <div className="mt-12 grid gap-x-6 gap-y-16 md:grid-cols-2">
        {collections.map((c, i) => (
          <Link
            key={c.slug}
            to="/collections/$slug"
            params={{ slug: c.slug }}
            className={`reveal group block ${i % 2 === 1 ? "md:mt-24" : ""}`}
          >
            <div className="reveal-img img-zoom aspect-[4/5] bg-sand/40">
              <img src={c.coverImage} alt={c.name} loading={i < 2 ? "eager" : "lazy"} className="h-full w-full object-cover" />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-2xl text-ink transition-colors group-hover:text-ritual sm:text-3xl">{c.name}</h2>
              <span className="whitespace-nowrap font-sans text-[10px] uppercase tracking-[0.2em] text-taupe">{c.count} pieces</span>
            </div>
            <p className="mt-1 text-sm font-light text-washed">{c.tagline}</p>
          </Link>
        ))}
      </div>
      <StitchDivider className="mx-auto mt-24 max-w-md" />
    </div>
  );
}
