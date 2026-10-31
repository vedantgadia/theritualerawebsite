import { Link, createFileRoute } from "@tanstack/react-router";
import { ThreadDivider } from "@/components/site/bits";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Us — The Ritual Era" },
      { name: "description", content: "The Ritual Era designs timeless everyday wear for the modern woman — made in-house in Mumbai, in limited editions." },
    ],
  }),
  component: About,
});

const PILLARS = [
  {
    title: "Denim at the heart",
    body: "Denim is our constant. We reimagine it through Indian textiles — ajrakh, hakoba, chanderi and crochet — and unexpected fabric pairings.",
  },
  {
    title: "Made in-house",
    body: "Every piece is designed, cut and stitched in our Mumbai studio, in small limited editions. When it's gone, it's gone.",
  },
  {
    title: "Longevity over excess",
    body: "Our collections are designed to be worn, repeated and reimagined — a lasting part of your wardrobe, not a passing moment.",
  },
];

function About() {
  const ref = useReveal();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      {/* Manifesto — the lookbook's closing page, given room to breathe */}
      <section className="sashiko-bg-ivory border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <p className="eyebrow">About Us</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-ritual sm:text-7xl">
            Her Forever <em className="font-normal italic">Prêt</em>
          </h1>
          <ThreadDivider className="mx-auto mt-10 max-w-xs" />
          <p className="mx-auto mt-10 max-w-2xl font-display text-xl leading-relaxed text-ink sm:text-2xl">
            At The Ritual Era, we believe getting dressed is one of the first rituals of the day — a quiet moment that sets the tone for everything that follows.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 sm:py-24 md:grid-cols-2 md:gap-20">
        <div className="reveal grid grid-cols-2 gap-3 sm:gap-4">
          <img src="/media/products/editorial-2.webp" alt="Teal linen wrap jacket and ivory trousers" loading="lazy" className="aspect-[3/4] w-full object-cover" />
          <img src="/media/products/editorial-4.webp" alt="Teal floral silk wrap dress" loading="lazy" className="mt-12 aspect-[3/4] w-full object-cover" />
        </div>
        <div className="reveal max-w-md space-y-5 text-[15px] font-light leading-relaxed text-deep-denim">
          <p className="eyebrow">Our philosophy</p>
          <p>It's a chance to express who you are, how you feel, and how you choose to show up in the world.</p>
          <p>
            Born from a desire to create clothing that feels as effortless as it is intentional, The Ritual Era designs timeless everyday wear for the
            modern woman. We focus on elevated essentials that blend comfort, versatility and thoughtful craftsmanship — pieces that move seamlessly
            through every part of your day.
          </p>
          <p>
            Because we believe true style isn't about constantly becoming someone new. It's about returning to yourself, every single day.
          </p>
          <p className="font-display text-lg italic text-ink">And that's where every ritual begins.</p>
        </div>
      </section>

      {/* Founder */}
      <section className="sashiko-bg border-y border-border bg-blush/60">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 sm:py-24 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div className="reveal mx-auto w-full max-w-sm">
            <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] bg-sand/40">
              <img src="/media/founder.jpg" alt="Priyanka Bhartia, founder of The Ritual Era" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="reveal max-w-md">
            <p className="eyebrow mb-3">The founder</p>
            <h2 className="font-display text-4xl text-ink">Priyanka Bhartia</h2>
            <div className="mt-6 space-y-4 text-[15px] font-light leading-relaxed text-deep-denim">
              <p>
                A Fashion Design graduate from De Montfort University, Priyanka started The Ritual Era to make the clothes she couldn't find: refined,
                easy to wear, and full of quiet detail.
              </p>
              <p>
                Her design language returns again and again to denim — pieced, panelled and stitched alongside the Indian textiles she grew up with.
              </p>
              <p className="font-display text-lg italic text-ink">"We don't design for a season. We design beyond it."</p>
            </div>
            <p className="mt-6 font-script text-5xl text-ritual">Priyanka</p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div className="reveal">
            <img src="/media/craft.jpg" alt="Hands sashiko-stitching dark denim" loading="lazy" className="aspect-[5/4] w-full object-cover" />
          </div>
          <div className="space-y-10">
            {PILLARS.map((p, i) => (
              <div key={p.title} className="reveal flex gap-6">
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-washed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-sand/40">
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <p className="font-display text-3xl text-ink">Find your everyday ritual</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/new-arrivals" className="inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]">
              Shop new arrivals
            </Link>
            <Link to="/collections" className="inline-flex h-12 items-center justify-center rounded-[2px] border border-ink/25 px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink">
              Explore collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
