import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { getCatalog, getCollections } from "@/lib/shop.functions";
import { ProductListing } from "@/components/site/product-listing";

export const Route = createFileRoute("/_site/collections/$slug")({
  loader: async ({ params }) => {
    const [collections, products] = await Promise.all([getCollections(), getCatalog({ data: { collection: params.slug } })]);
    const collection = collections.find((c) => c.slug === params.slug);
    if (!collection) throw notFound();
    return { collection, collections, products };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.collection.name} — The Ritual Era` },
          { name: "description", content: loaderData.collection.tagline },
          { property: "og:image", content: loaderData.collection.coverImage },
        ]
      : [],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection, collections, products } = Route.useLoaderData();
  const others = collections.filter((c) => c.slug !== collection.slug).slice(0, 3);

  return (
    <>
      <section className="sashiko-bg border-b border-border bg-blush/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1fr_1.1fr] md:py-16">
          <div className="order-2 md:order-1">
            <Link to="/collections" className="eyebrow transition-colors hover:text-ritual">← Collections</Link>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] text-ink sm:text-6xl">{collection.name}</h1>
            <p className="mt-3 font-display text-lg italic text-washed">{collection.tagline}</p>
            <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-deep-denim">{collection.story}</p>
          </div>
          <div className="order-1 md:order-2">
            <div className="mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-t-[999px] bg-sand/40">
              <img src={collection.coverImage} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <ProductListing eyebrow="Shop the collection" title="The pieces" products={products} />

      <section className="border-t border-border bg-sand/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8">
          <p className="eyebrow mb-8 text-center">Continue the story</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {others.map((c) => (
              <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} className="group block">
                <div className="img-zoom aspect-[4/3] bg-sand/40">
                  <img src={c.coverImage} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                </div>
                <p className="mt-3 font-display text-xl text-ink group-hover:text-ritual">{c.name}</p>
                <p className="text-xs font-light text-washed">{c.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
