import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { MtmForm } from "@/components/site/forms";
import { StitchDivider } from "@/components/site/motion";
import { getProductBySlug } from "@/lib/shop.functions";
import { seo } from "@/lib/seo";

/* /made-to-measure?piece=<product-slug> pre-fills the piece; without it, the request is general. */
export const Route = createFileRoute("/_site/made-to-measure")({
  validateSearch: z.object({ piece: z.string().max(120).optional() }),
  loaderDeps: ({ search }) => ({ piece: search.piece }),
  loader: async ({ deps }) => {
    if (!deps.piece) return { product: null };
    const product = await getProductBySlug({ data: { slug: deps.piece } });
    return { product: product ? { slug: product.slug, name: product.name } : null };
  },
  head: () => ({
    meta: seo({
      title: "Made-to-measure",
      description:
        "Any piece from The Ritual Era, cut and sewn to your measurements in our Mumbai studio.",
      image: "/media/craft.jpg",
    }),
  }),
  component: MadeToMeasurePage,
});

const STEPS = [
  ["Send your request", "Tell us the piece and whatever measurements you know."],
  [
    "We confirm together",
    "Our studio calls or WhatsApps you to go over measurements, fabric, price and timeline.",
  ],
  ["Made for you", "Once you confirm, your piece is cut and sewn in our Mumbai studio."],
] as const;

function MadeToMeasurePage() {
  const { product } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <header>
          <p className="eyebrow mb-3">The Ritual Era</p>
          <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            Made to your <em className="font-normal italic text-ritual">measure</em>
          </h1>
          <p className="mt-5 text-sm font-light leading-relaxed text-washed">
            Every piece is designed and made in-house, so any of them can be cut to your
            measurements. A longer sleeve, a different length, a fit that's simply yours.
          </p>
          <StitchDivider className="my-10 max-w-xs" />
          <ol className="space-y-7">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="flex gap-5">
                <span className="font-display text-2xl leading-none text-sand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-lg text-ink">{title}</p>
                  <p className="mt-1 text-sm font-light leading-relaxed text-washed">{text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-xs font-light leading-relaxed text-taupe">
            Made-to-measure pieces are made specially for you, so they can't be exchanged or
            refunded except for manufacturing defects.
          </p>
        </header>

        <section aria-labelledby="mtm-form-title">
          <h2 id="mtm-form-title" className="mb-6 font-display text-2xl text-ink">
            Request a piece
          </h2>
          <MtmForm productSlug={product?.slug} productName={product?.name} />
        </section>
      </div>
    </div>
  );
}
