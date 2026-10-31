import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCatalog, getSettings, type CatalogProduct } from "@/lib/shop.functions";
import { useBag } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group block text-center leading-none" aria-label="The Ritual Era — home">
      <span className={`block font-display text-ink transition-colors group-hover:text-ritual ${compact ? "text-lg tracking-[0.14em]" : "text-xl tracking-[0.18em]"}`}>
        THE RITUAL ERA
      </span>
      <span className="mt-1 block font-sans text-[8px] font-medium uppercase tracking-[0.34em] text-taupe">
        Her Forever Prêt
      </span>
    </Link>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<CatalogProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else {
      setQ("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      const items = await getCatalog({ data: { q: q.trim(), limit: 6 } });
      setResults(items);
    }, 220);
    return () => clearTimeout(t);
  }, [q]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] bg-ivory/98 backdrop-blur-[2px]" onClick={onClose}>
      <div className="mx-auto max-w-2xl px-6 pt-28" onClick={(e) => e.stopPropagation()}>
        <p className="eyebrow mb-6">Search the collection</p>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          placeholder="Try 'kantha', 'denim', 'wrap'…"
          className="w-full border-b border-ink/20 bg-transparent pb-3 font-display text-2xl text-ink placeholder:text-taupe/60 focus:border-ritual focus:outline-none"
        />
        <div className="mt-6 divide-y divide-border">
          {results.map((p) => (
            <Link
              key={p.id}
              to="/product/$slug"
              params={{ slug: p.slug }}
              onClick={onClose}
              className="flex items-center gap-4 py-3 transition-colors hover:bg-ink/[0.03]"
            >
              {p.images[0] && <img src={p.images[0]} alt="" className="h-16 w-12 object-cover" loading="lazy" />}
              <span className="flex-1 text-sm font-light text-ink">{p.name}</span>
              <span className="text-xs text-taupe">{formatINR(p.price)}</span>
            </Link>
          ))}
          {q.trim() && results.length === 0 && (
            <p className="py-6 text-sm font-light text-washed">Nothing found yet — try another word.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const bag = useBag();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT") setSignedIn(e === "SIGNED_IN");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Shop", to: "/shop" },
    { label: "Lookbook", to: "/lookbook" },
    { label: "Pop-ups", to: "/pop-ups" },
    { label: "About", to: "/about" },
  ] as const;

  return (
    <>
      {settings?.announcement && (
        <div className="sashiko-bg-ivory border-b border-border bg-sand/60 px-4 py-2 text-center">
          <p className="font-sans text-[10px] font-light uppercase tracking-[0.2em] text-washed">{settings.announcement}</p>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 border-b border-border bg-ivory/95 backdrop-blur transition-shadow ${scrolled ? "shadow-[0_1px_0_rgba(31,58,95,0.06)]" : ""}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          {/* Left — mobile menu / desktop nav */}
          <div className="flex flex-1 items-center gap-6">
            <button
              className="p-1 text-ink lg:hidden"
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1" fill="none">
                <path d="M1 5h18M1 10h18M1 15h18" />
              </svg>
            </button>
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
              {navLinks.slice(0, 2).map((l) => (
                <Link key={l.to} to={l.to} className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-ritual" activeProps={{ className: "text-ritual" }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Centre — logo */}
          <div className="flex-none px-4">
            <Wordmark />
          </div>

          {/* Right — nav tail + icons */}
          <div className="flex flex-1 items-center justify-end gap-5">
            <nav className="hidden items-center gap-7 lg:flex" aria-label="Secondary">
              {navLinks.slice(2).map((l) => (
                <Link key={l.to} to={l.to} className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-ritual" activeProps={{ className: "text-ritual" }}>
                  {l.label}
                </Link>
              ))}
            </nav>
            <button aria-label="Search" className="text-ink/80 transition-colors hover:text-ritual" onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.1" fill="none">
                <circle cx="7.5" cy="7.5" r="5.5" />
                <path d="M12 12l5 5" />
              </svg>
            </button>
            <Link to={signedIn ? "/account" : "/auth"} aria-label={signedIn ? "Account" : "Sign in"} className="hidden text-ink/80 transition-colors hover:text-ritual sm:block">
              <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.1" fill="none">
                <circle cx="9" cy="5.5" r="3.5" />
                <path d="M2 16.5c1.2-3.4 3.9-5 7-5s5.8 1.6 7 5" />
              </svg>
            </Link>
            <button aria-label={`Bag, ${bag.count} items`} className="relative text-ink/80 transition-colors hover:text-ritual" onClick={bag.openBag}>
              <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.1" fill="none">
                <path d="M3 5.5h12l-1 11H4l-1-11Z" />
                <path d="M6 5.5V4a3 3 0 0 1 6 0v1.5" />
              </svg>
              {bag.count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ritual px-1 font-sans text-[9px] text-ivory">
                  {bag.count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <nav className="border-t border-border bg-ivory px-6 py-4 lg:hidden" aria-label="Mobile">
            {[...navLinks, { label: "Contact", to: "/contact" }, { label: signedIn ? "Account" : "Sign in", to: signedIn ? "/account" : "/auth" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-border/60 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
