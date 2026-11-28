import { Link } from "@tanstack/react-router";
import { whatsappLink } from "@/lib/contact";

/*
 * "From the studio": a short note in Priyanka's own voice on the home page.
 * DRAFT (28 Nov 2026): written from the facts on the About page for Priyanka to
 * edit. Change the words here; the layout doesn't depend on their length.
 */
const NOTE = [
  "I started The Ritual Era to make the clothes I couldn't find: easy to wear, made with care, and full of small details you only notice up close.",
  "Everything you see here begins in our studio in Mumbai, usually with a length of denim and an Indian textile I can't stop thinking about. We cut and stitch each piece in small runs, so it's made to be worn often and kept for years.",
  "If you're unsure about a size or a fit, message us. We'll gladly help you find the right piece.",
];

export function FounderNote() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-8 sm:py-28 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
        <div className="reveal mx-auto w-full max-w-xs md:max-w-sm">
          <div className="reveal-img aspect-[4/5] overflow-hidden rounded-t-[999px] bg-sand/40">
            <img
              src="/media/founder-priyanka.webp"
              alt="Priyanka Bhartia, founder of The Ritual Era, at her desk in the Mumbai studio"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="reveal max-w-lg">
          <p className="eyebrow mb-3">From the studio</p>
          <h2 className="font-display text-[2rem] leading-tight text-ink sm:text-[2.6rem]">
            Hello, I'm <em className="font-normal italic text-ritual">Priyanka</em>
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-deep-denim">
            {NOTE.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="mt-7 font-script text-5xl leading-none text-ritual">Priyanka</p>
          <p className="mt-2 text-sm text-washed">Founder, The Ritual Era</p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium">
            <Link to="/about" className="text-ink underline underline-offset-4 hover:text-ritual">
              Read our story
            </Link>
            <a
              href={whatsappLink("Hi Priyanka! I have a question about a piece.")}
              target="_blank"
              rel="noreferrer"
              className="text-ink underline underline-offset-4 hover:text-ritual"
            >
              Say hello on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
