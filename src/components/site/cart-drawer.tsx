import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useBag } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { getSettings } from "@/lib/shop.functions";

export function CartDrawer() {
  const bag = useBag();
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });

  const freeThreshold = settings?.freeShippingThreshold ?? 5000;
  const shippingFee = settings?.shippingFee ?? 150;
  const freeShipping = bag.subtotal >= freeThreshold;
  const remaining = Math.max(0, freeThreshold - bag.subtotal);

  return (
    <div aria-hidden={!bag.isOpen} className={bag.isOpen ? "fixed inset-0 z-[80]" : "hidden"}>
      <div className="absolute inset-0 bg-ink/40" onClick={bag.closeBag} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`drawer-panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-[0_0_60px_rgba(15,34,51,0.18)] ${bag.isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <span className="font-display text-lg text-ink">Your Bag</span>
          <button onClick={bag.closeBag} aria-label="Close bag" className="text-washed transition-colors hover:text-ink">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M1 1l16 16M17 1L1 17" />
            </svg>
          </button>
        </div>

        {bag.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="font-script text-4xl text-taupe">Your bag is quiet</span>
            <p className="mt-3 text-sm font-light text-washed">Nothing chosen yet. The collection is small and made to last.</p>
            <Link to="/shop" onClick={bag.closeBag} className="mt-8 inline-flex h-11 items-center rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]">
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {bag.items.map((item) => (
                <div key={item.productId + item.size} className="flex gap-4 py-5">
                  <Link to="/product/$slug" params={{ slug: item.slug }} onClick={bag.closeBag} className="img-zoom block h-28 w-21 flex-none overflow-hidden bg-sand/40" style={{ width: 84 }}>
                    <img src={item.image} alt={item.name} className="h-28 w-full object-cover" loading="lazy" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link to="/product/$slug" params={{ slug: item.slug }} onClick={bag.closeBag} className="text-sm font-light leading-snug text-ink hover:text-ritual">
                        {item.name}
                      </Link>
                      <button
                        aria-label={`Remove ${item.name} size ${item.size}`}
                        onClick={() => bag.removeItem(item.productId, item.size)}
                        className="mt-0.5 text-taupe transition-colors hover:text-terracotta"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1" fill="none"><path d="M1 1l10 10M11 1L1 11" /></svg>
                      </button>
                    </div>
                    <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-taupe">Size {item.size}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button aria-label="Decrease quantity" className="px-2.5 py-1 text-washed hover:text-ink" onClick={() => bag.updateQuantity(item.productId, item.size, item.quantity - 1)}>−</button>
                        <span className="min-w-6 text-center text-xs text-ink">{item.quantity}</span>
                        <button aria-label="Increase quantity" className="px-2.5 py-1 text-washed hover:text-ink" onClick={() => bag.updateQuantity(item.productId, item.size, item.quantity + 1)}>+</button>
                      </div>
                      <span className="text-sm text-ink">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="font-light text-washed">Subtotal</span>
                <span className="text-ink">{formatINR(bag.subtotal)}</span>
              </div>
              <p className="mt-1 text-xs font-light text-taupe">
                {freeShipping
                  ? "Shipping is on us — your order qualifies for free delivery."
                  : `${formatINR(shippingFee)} shipping · add ${formatINR(remaining)} for free shipping`}
              </p>
              <Link
                to="/checkout"
                onClick={bag.closeBag}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-[2px] bg-primary font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]"
              >
                Checkout
              </Link>
              <Link to="/cart" onClick={bag.closeBag} className="mt-2 flex h-12 w-full items-center justify-center rounded-[2px] border border-ink/25 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:border-ink">
                View bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
