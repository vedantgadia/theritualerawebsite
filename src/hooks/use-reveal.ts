import { useEffect, useRef } from "react";

/** Adds .is-visible to elements with .reveal / .reveal-img / .thread-draw once they enter the viewport. */
export function useReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = ref.current ?? document.body;
    const targets = Array.from(root.querySelectorAll<HTMLElement>(".reveal, .reveal-img, .thread-draw"));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
