import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getCategories } from "@/lib/shop.functions";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "@/components/site/motion";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState("error");
      return;
    }
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setState(error && error.code !== "23505" ? "error" : "done");
    if (!error || error.code === "23505") setEmail("");
  }

  if (state === "done") {
    return <p className="text-sm font-light text-washed">Thank you — you're on the list. ✦</p>;
  }

  return (
    <form onSubmit={submit} className="flex max-w-sm" noValidate>
      <input
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setState("idle");
        }}
        placeholder="Your email address"
        aria-label="Email address"
        className="h-11 w-full rounded-none border border-ink/20 border-r-0 bg-ivory/80 px-3 text-sm font-light text-ink placeholder:text-taupe/60 focus:border-ritual focus:outline-none"
      />
      <button type="submit" className="h-11 whitespace-nowrap rounded-none bg-ritual px-5 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-[#2a4a76]">
        Subscribe
      </button>
      {state === "error" && <p className="sr-only">Please enter a valid email.</p>}
    </form>
  );
}

export function Footer() {
  const { data: categories } = useQuery({ queryKey: ["footer-categories"], queryFn: () => getCategories() });

  return (
    <footer className="border-t border-border">
      <div className="stitch-lattice">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1fr_1fr] md:py-20">
          <div className="text-center md:text-left">
            <Logo className="mx-auto h-auto w-64 sm:w-80 md:mx-0" />
          </div>
          <div className="mx-auto w-full max-w-md md:ml-auto md:mr-0">
            <p className="font-display text-2xl text-ink sm:text-3xl">
              Letters from the <em className="font-normal italic text-ritual">studio</em>
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-deep-denim">
              New collections, pop-ups and the occasional story behind a stitch. No noise, we promise.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 bg-ivory px-4 py-16 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="eyebrow mb-4">The Ritual Era</p>
          <p className="max-w-xs text-sm font-light leading-relaxed text-washed">
            Elevated everyday silhouettes, designed and made in-house in Mumbai. Denim, reimagined through Indian textiles.
          </p>
          <a href="https://wa.me/919769728791" target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm text-ritual underline underline-offset-4">
            WhatsApp +91 97697 28791
          </a>
        </div>

        <div>
          <p className="eyebrow mb-4">Shop</p>
          <ul className="space-y-2.5">
            <li><Link to="/new-arrivals" className="text-sm font-light text-washed transition-colors hover:text-ritual">New arrivals</Link></li>
            <li><Link to="/bestsellers" className="text-sm font-light text-washed transition-colors hover:text-ritual">Bestsellers</Link></li>
            <li><Link to="/collections" className="text-sm font-light text-washed transition-colors hover:text-ritual">Collections</Link></li>
            <li><Link to="/shop" className="text-sm font-light text-washed transition-colors hover:text-ritual">All clothing</Link></li>
            {(categories ?? []).map((c) => (
              <li key={c.id}>
                <Link to="/shop/$category" params={{ category: c.slug }} className="text-sm font-light text-washed transition-colors hover:text-ritual">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Care</p>
          <ul className="space-y-2.5">
            <li><Link to="/track-order" className="text-sm font-light text-washed transition-colors hover:text-ritual">Track your order</Link></li>
            <li><Link to="/contact" className="text-sm font-light text-washed transition-colors hover:text-ritual">Contact us</Link></li>
            <li><Link to="/about" className="text-sm font-light text-washed transition-colors hover:text-ritual">About the label</Link></li>
            <li><Link to="/pop-ups" className="text-sm font-light text-washed transition-colors hover:text-ritual">Pop-ups & events</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">The fine print</p>
          <ul className="space-y-2.5">
            <li><Link to="/shipping-policy" className="text-sm font-light text-washed transition-colors hover:text-ritual">Shipping policy</Link></li>
            <li><Link to="/returns-policy" className="text-sm font-light text-washed transition-colors hover:text-ritual">Returns & exchange</Link></li>
            <li><Link to="/privacy-policy" className="text-sm font-light text-washed transition-colors hover:text-ritual">Privacy policy</Link></li>
            <li><Link to="/terms" className="text-sm font-light text-washed transition-colors hover:text-ritual">Terms & conditions</Link></li>
            <li className="pt-2">
              <a href="https://instagram.com/theritualera" target="_blank" rel="noreferrer" className="text-sm font-light text-washed transition-colors hover:text-ritual">Instagram — @theritualera</a>
            </li>
            <li>
              <a href="https://facebook.com/theritualera.official" target="_blank" rel="noreferrer" className="text-sm font-light text-washed transition-colors hover:text-ritual">Facebook</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-taupe">© The Ritual Era · Mumbai, India</p>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-taupe">We don't design for a season. We design beyond it.</p>
        </div>
      </div>
    </footer>
  );
}
