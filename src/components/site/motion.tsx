import { useEffect, useRef, useState, type ReactNode } from "react";

/** The brand logo: a vector trace of the supplied artwork, in its original ink colour, so it stays sharp at any size. */
export function Logo({ className = "", animate = false }: { className?: string; animate?: boolean }) {
  return (
    <img
      src="/brand/logo.svg"
      alt="The Ritual Era"
      width={1520}
      height={775}
      className={`${animate ? "stitch-reveal" : ""} ${className}`}
    />
  );
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Endless horizontal ticker. Children are rendered twice so the loop is seamless. */
export function Marquee({
  children,
  duration = 40,
  pauseOnHover = false,
  className = "",
}: {
  children: ReactNode;
  duration?: number;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee overflow-hidden ${className}`}>
      <div className={`marquee-track ${pauseOnHover ? "pause-on-hover" : ""}`} style={{ ["--marquee-duration" as string]: `${duration}s` }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Moves its child vertically against the scroll, for a soft depth effect. */
export function Parallax({ children, speed = 0.12, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/** A sentence whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(1);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block enters the lower part of the screen, 1 when it reaches the upper third.
      setProgress(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => {
        const lit = progress * words.length - i;
        return (
          <span key={i} className="transition-opacity duration-300" style={{ opacity: Math.min(1, Math.max(0.16, lit)) }}>
            {w}{" "}
          </span>
        );
      })}
    </p>
  );
}

/** Dashed running stitch with the four-point star — the stitches keep sewing. */
export function StitchDivider({ className = "", tone = "taupe" }: { className?: string; tone?: "taupe" | "ivory" }) {
  const stroke = tone === "ivory" ? "#f5efe8" : "#7a6a5f";
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden>
      <svg className="h-2 flex-1" preserveAspectRatio="none" viewBox="0 0 100 2">
        <line x1="0" y1="1" x2="100" y2="1" stroke={stroke} strokeOpacity=".45" strokeWidth="1" vectorEffect="non-scaling-stroke" className="stitch-march" />
      </svg>
      <span className={`select-none text-[11px] ${tone === "ivory" ? "text-gold" : "text-ritual"}`}>✦</span>
      <svg className="h-2 flex-1 -scale-x-100" preserveAspectRatio="none" viewBox="0 0 100 2">
        <line x1="0" y1="1" x2="100" y2="1" stroke={stroke} strokeOpacity=".45" strokeWidth="1" vectorEffect="non-scaling-stroke" className="stitch-march" />
      </svg>
    </div>
  );
}

/** A small thread spool, echoing the one at the end of the logo's thread. */
export function Spool({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <ellipse cx="20" cy="6" rx="15" ry="4" />
      <ellipse cx="20" cy="42" rx="15" ry="4" />
      <path d="M8 8v32M32 8v32" strokeOpacity=".5" />
      {[12, 16, 20, 24, 28, 32, 36].map((y) => (
        <path key={y} d={`M9 ${y}c6 2 16 2 22 0`} strokeOpacity=".8" />
      ))}
    </svg>
  );
}

/** Cycles an index on a timer; pauses while the tab is hidden. */
export function useCycle(length: number, ms: number) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (length < 2 || prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % length);
    }, ms);
    return () => clearInterval(t);
  }, [length, ms]);
  return [index, setIndex] as const;
}
