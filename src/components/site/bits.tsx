import type { ReactNode } from "react";

/** Dashed thread divider with the four-point star from the hand tags. */
export function ThreadDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <span className="h-px flex-1 border-t border-dashed border-taupe/40" />
      <span className="select-none text-[11px] text-gold">✦</span>
      <span className="h-px flex-1 border-t border-dashed border-taupe/40" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  align?: "center" | "left";
  children?: ReactNode;
}) {
  return (
    <div className={`reveal ${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      {children && <div className="mt-4 text-sm font-light leading-relaxed text-washed">{children}</div>}
    </div>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919769728791"
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[70] flex h-13 w-13 items-center justify-center rounded-full bg-ritual text-ivory shadow-[0_8px_24px_rgba(15,34,51,0.25)] transition-transform hover:scale-105 md:hidden"
      style={{ height: 52, width: 52 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.94L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.34-.52.05-1-.11-2.47-.75-1.9-.83-3.34-2.9-3.44-3.05-.1-.15-.68-1.03-.64-1.98.04-.95.55-1.4.74-1.6.19-.19.4-.23.54-.23h.39c.13 0 .3-.02.46.36.17.42.6 1.5.65 1.6.05.1.08.22 0 .36-.07.15-.13.24-.26.37-.13.13-.27.3-.24.44.03.15.4.83.94 1.35.66.65 1.22.86 1.37.94.15.07.24.06.33-.04.09-.1.37-.44.47-.6.1-.15.2-.12.34-.07.14.05.9.43 1.06.51.15.08.25.12.29.19.03.06.03.4-.21 1.06Z" />
      </svg>
    </a>
  );
}

/** Thin vertical editorial label, used along asymmetric grids. */
export function VerticalLabel({ text }: { text: string }) {
  return (
    <span className="hidden select-none font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-stone [writing-mode:vertical-rl] lg:block">
      {text}
    </span>
  );
}
