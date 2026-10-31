import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCatalog, getCategories, getCollections, type CatalogProduct } from "@/lib/shop.functions";
import { useBag } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/format";
import { Logo, useCycle } from "@/components/site/motion";

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="block" aria-label="The Ritual Era — home">
      <Logo className={`w-auto transition-[height] duration-500 ${compact ? "h-12 lg:h-14" : "h-14 lg:h-20"}`} />
    </Link>
  );
}

const ANNOUNCEMENTS = [
  "Complimentary shipping across India on orders above ₹5,000",
  "New arrivals — the Autumn Edit is here",
  "Designed & made in-house in Mumbai · Limited editions",
  "Made-to-measure on request — message us on WhatsApp",
];

function AnnouncementBar() {
  const [i] = useCycle(ANNOUNCEMENTS.length, 4500);
  return (
    <div className="stitch-lattice-ink relative z-[51] h-8 overflow-hidden px-4 text-center">
      <p key={i} className="rise-in flex h-8 items-center justify-center font-sans text-[10px] font-light uppercase tracking-[0.2em] text-ivory/90">
        {ANNOUNCEMENTS[i]}
      </p>
    </div>
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
          placeholder="Try 'ajrakh', 'crochet', 'denim'…"
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

type MenuKey = "clothing" | "collections" | null;

const navLinkClass =
  "relative py-1 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/80 transition-colors hover:text-ritual after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ritual after:transition-transform after:duration-500 hover:after:scale-x-100";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden>
      <path d="M1 2.5l3 3 3-3" />
    </svg>
  );
}

export function Header() {
  const bag = useBag();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey>(null);
  const [megaOpen, setMegaOpen] = useState<MenuKey>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });
  const { data: collections = [] } = useQuery({ queryKey: ["collections"], queryFn: () => getCollections() });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT") setSignedIn(e === "SIGNED_IN");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Tuck the header away while reading down the page; bring it back on any upward scroll.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Small delay on close so the pointer can travel from the nav item into the panel.
  const openMega = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(key);
  };
  const closeMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(null), 140);
  };
  const closeAll = () => {
    setMegaOpen(null);
    setMenuOpen(false);
  };

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-50 border-b border-border bg-ivory/95 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${hidden && !megaOpen && !menuOpen ? "-translate-y-full" : ""}`}
        onMouseLeave={closeMega}
      >
        <div className={`mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 transition-[padding] duration-500 sm:px-8 ${scrolled ? "py-2.5 lg:pb-1.5 lg:pt-3" : "py-3 lg:pb-2 lg:pt-4"}`}>
          {/* Left — mobile menu / desktop search */}
          <div className="flex items-center gap-4">
            <button className="p-1 text-ink lg:hidden" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1" fill="none">
                <path d="M1 5h18M1 10h18M1 15h18" />
              </svg>
            </button>
            <button aria-label="Search" className="flex items-center gap-2 text-ink/80 transition-colors hover:text-ritual" onClick={() => setSearchOpen(true)}>
              <svg width="17" height="17" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.1" fill="none">
                <circle cx="7.5" cy="7.5" r="5.5" />
                <path d="M12 12l5 5" />
              </svg>
              <span className="hidden font-sans text-[10px] uppercase tracking-[0.2em] lg:inline">Search</span>
            </button>
          </div>

          <Wordmark compact={scrolled} />

          <div className="flex items-center justify-end gap-5">
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

        {/* Desktop primary navigation */}
        <nav className={`hidden justify-center gap-8 transition-[padding] xl:gap-10 duration-500 lg:flex ${scrolled ? "pb-2.5" : "pb-3.5"}`} aria-label="Primary">
          <Link to="/new-arrivals" className={navLinkClass} activeProps={{ className: "text-ritual" }} onMouseEnter={closeMega}>
            New Arrivals
          </Link>
          {(["clothing", "collections"] as const).map((key) => (
            <button
              key={key}
              className={`${navLinkClass} flex items-center gap-1.5 ${megaOpen === key ? "text-ritual" : ""}`}
              aria-expanded={megaOpen === key}
              onMouseEnter={() => openMega(key)}
              onFocus={() => openMega(key)}
              onClick={() => setMegaOpen(megaOpen === key ? null : key)}
            >
              {key === "clothing" ? "Clothing" : "Collections"}
              <Chevron open={megaOpen === key} />
            </button>
          ))}
          <Link to="/bestsellers" className={navLinkClass} activeProps={{ className: "text-ritual" }} onMouseEnter={closeMega}>
            Bestsellers
          </Link>
          <Link to="/style-notes" className={navLinkClass} activeProps={{ className: "text-ritual" }} onMouseEnter={closeMega}>
            Style Notes
          </Link>
          <Link to="/about" className={navLinkClass} activeProps={{ className: "text-ritual" }} onMouseEnter={closeMega}>
            About Us
          </Link>
        </nav>

        {/* Desktop mega panels */}
        {megaOpen && (
          <div
            className="absolute inset-x-0 top-full hidden border-b border-border bg-ivory shadow-[0_24px_40px_-24px_rgba(15,34,51,0.18)] lg:block"
            onMouseEnter={() => openMega(megaOpen)}
            onMouseLeave={closeMega}
          >
            {megaOpen === "clothing" ? (
              <div key="clothing" className="rise-in mx-auto grid max-w-7xl grid-cols-[220px_1fr] gap-12 px-8 py-10">
                <div>
                  <p className="eyebrow mb-5">Shop by category</p>
                  <ul className="space-y-3">
                    <li>
                      <Link to="/shop" onClick={closeAll} className="font-display text-lg text-ink transition-colors hover:text-ritual">
                        All Clothing
                      </Link>
                    </li>
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link to="/shop/$category" params={{ category: c.slug }} onClick={closeAll} className="font-display text-lg text-ink transition-colors hover:text-ritual">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {categories.map((c) => (
                    <Link key={c.slug} to="/shop/$category" params={{ category: c.slug }} onClick={closeAll} className="group block">
                      <div className="img-zoom aspect-[3/4] bg-sand/40">
                        <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </div>
                      <p className="mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ink group-hover:text-ritual">{c.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div key="collections" className="rise-in mx-auto grid max-w-7xl grid-cols-[260px_1fr] gap-12 px-8 py-10">
                <div>
                  <p className="eyebrow mb-5">The stories</p>
                  <ul className="space-y-3">
                    {collections.map((c) => (
                      <li key={c.slug}>
                        <Link to="/collections/$slug" params={{ slug: c.slug }} onClick={closeAll} className="font-display text-lg text-ink transition-colors hover:text-ritual">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link to="/collections" onClick={closeAll} className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-ritual underline underline-offset-4">
                        All collections
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {collections.slice(0, 3).map((c) => (
                    <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }} onClick={closeAll} className="group block">
                      <div className="img-zoom aspect-[4/3] bg-sand/40">
                        <img src={c.coverImage} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                      </div>
                      <p className="mt-3 font-display text-base text-ink group-hover:text-ritual">{c.name}</p>
                      <p className="mt-0.5 text-xs font-light text-washed">{c.tagline}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile menu drawer */}
      <div className={menuOpen ? "fixed inset-0 z-[85] lg:hidden" : "hidden"}>
        <div className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} aria-hidden />
        <nav aria-label="Mobile" className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col overflow-y-auto bg-ivory">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <span className="eyebrow">Menu</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-washed hover:text-ink">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M1 1l16 16M17 1L1 17" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-2">
            <Link to="/new-arrivals" onClick={closeAll} className="block border-b border-border/60 py-4 font-display text-xl text-ink">
              New Arrivals
            </Link>
            {(["clothing", "collections"] as const).map((key) => (
              <div key={key} className="border-b border-border/60">
                <button
                  className="flex w-full items-center justify-between py-4 font-display text-xl text-ink"
                  aria-expanded={mobileSection === key}
                  onClick={() => setMobileSection(mobileSection === key ? null : key)}
                >
                  {key === "clothing" ? "Clothing" : "Collections"}
                  <Chevron open={mobileSection === key} />
                </button>
                {mobileSection === key && (
                  <ul className="space-y-3 pb-5 pl-1">
                    {key === "clothing" ? (
                      <>
                        <li><Link to="/shop" onClick={closeAll} className="text-sm font-light text-washed">All Clothing</Link></li>
                        {categories.map((c) => (
                          <li key={c.slug}>
                            <Link to="/shop/$category" params={{ category: c.slug }} onClick={closeAll} className="text-sm font-light text-washed">{c.name}</Link>
                          </li>
                        ))}
                      </>
                    ) : (
                      <>
                        {collections.map((c) => (
                          <li key={c.slug}>
                            <Link to="/collections/$slug" params={{ slug: c.slug }} onClick={closeAll} className="text-sm font-light text-washed">{c.name}</Link>
                          </li>
                        ))}
                        <li><Link to="/collections" onClick={closeAll} className="text-sm font-light text-ritual">All collections</Link></li>
                      </>
                    )}
                  </ul>
                )}
              </div>
            ))}
            <Link to="/bestsellers" onClick={closeAll} className="block border-b border-border/60 py-4 font-display text-xl text-ink">
              Bestsellers
            </Link>
            <Link to="/style-notes" onClick={closeAll} className="block border-b border-border/60 py-4 font-display text-xl text-ink">
              Style Notes
            </Link>
            <Link to="/about" onClick={closeAll} className="block border-b border-border/60 py-4 font-display text-xl text-ink">
              About Us
            </Link>
          </div>
          <div className="mt-auto space-y-3 border-t border-border px-6 py-6">
            <Link to={signedIn ? "/account" : "/auth"} onClick={closeAll} className="block font-sans text-[11px] uppercase tracking-[0.2em] text-ink">
              {signedIn ? "My account" : "Sign in"}
            </Link>
            <Link to="/contact" onClick={closeAll} className="block font-sans text-[11px] uppercase tracking-[0.2em] text-ink">
              Contact
            </Link>
          </div>
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
