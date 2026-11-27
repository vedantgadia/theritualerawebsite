import { useState } from "react";
import { whatsappLink } from "@/lib/contact";
import { rememberCheckout, useBag } from "@/lib/cart";
import { startCheckout } from "@/lib/checkout.functions";

/*
 * Sends the bag to Shopify's secure checkout. If checkout can't start (Shopify
 * not connected, e.g. in local development), it says so here and offers WhatsApp.
 */
export function CheckoutButton({ className }: { className: string }) {
  const bag = useBag();
  const [busy, setBusy] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);
  const [offline, setOffline] = useState(false);

  async function go() {
    setBusy(true);
    setProblems([]);
    setOffline(false);
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
        setOffline(true);
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
      {offline && (
        <p role="alert" className="mt-3 text-xs font-light text-washed">
          Online checkout isn't open just yet.{" "}
          <a
            href={whatsappLink(
              `Hi! I'd like to order: ${bag.items.map((i) => `${i.name} (${i.size}) × ${i.quantity}`).join(", ")}`,
            )}
            target="_blank"
            rel="noreferrer"
            className="text-ritual underline underline-offset-4"
          >
            Order on WhatsApp
          </a>
        </p>
      )}
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
