import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { rememberCheckout, useBag } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout.functions";

/*
 * Sends the bag to Shopify's secure checkout. Until Shopify is connected it
 * falls back to the on-site /checkout page.
 */
export function CheckoutButton({
  className,
  onNavigate,
}: {
  className: string;
  onNavigate?: () => void;
}) {
  const bag = useBag();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  async function go() {
    setBusy(true);
    setProblems([]);
    try {
      const res = await startCheckout({
        data: {
          lines: bag.items.map((i) => ({ slug: i.slug, size: i.size, quantity: i.quantity })),
        },
      });
      if (res.status === "redirect") {
        rememberCheckout(res.cartId);
        window.location.assign(res.url);
        return; // keep the button busy while the browser leaves
      }
      if (res.status === "unavailable") {
        onNavigate?.();
        await navigate({ to: "/checkout" });
      } else {
        setProblems(res.problems);
      }
    } catch {
      setProblems([
        "We couldn't reach checkout just now. Please try again, or message us on WhatsApp.",
      ]);
    }
    setBusy(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={go}
        disabled={busy || bag.items.length === 0}
        aria-busy={busy}
        className={`${className} disabled:cursor-wait disabled:opacity-70`}
      >
        {busy ? "One moment…" : "Checkout"}
      </button>
      {problems.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 text-xs font-light text-terracotta">
          {problems.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </>
  );
}
