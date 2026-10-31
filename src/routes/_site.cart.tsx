import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useBag } from "@/lib/cart";
import { formatINR } from "@/lib/format";
import { getSettings } from "@/lib/shop.functions";

export const Route = createFileRoute("/_site/cart")({
  head: () => ({ meta: [{ title: "Your Bag — The Ritual Era" }] }),
  component: CartPage,
});

function CartPage() {
  const bag = useBag();
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: () => getSettings() });
  const freeThreshold = settings?.freeShippingThreshold ?? 5000;
  const shipping = bag.subtotal >= freeThreshold || bag.subtotal === 0 ? 0 : (settings?.shippingFee ?? 150);

  if (bag.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <p className="font-script text-5xl text-taupe">Your bag is quiet</p>
        <p className="mt-4 text-sm font-light text-washed">Nothing chosen yet. Start with what's new, or what everyone loves.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/new-arrivals" className="inline-flex h-12 items-center rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground hover:bg-[#2a4a76]">
            New arrivals
          </Link>
          <Link to="/bestsellers" className="inline-flex h-12 items-center rounded-[2px] border border-ink/25 px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink hover:border-ink">
            Bestsellers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-4xl text-ink">Your Bag</h1>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-border border-y border-border">
          {bag.items.map((item) => (
            <li key={item.productId + item.size} className="flex gap-5 py-6">
              <Link to="/product/$slug" params={{ slug: item.slug }} className="block w-24 flex-none sm:w-28">
                <img src={item.image} alt={item.name} className="aspect-[4/5] w-full object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link to="/product/$slug" params={{ slug: item.slug }} className="text-sm text-ink hover:text-ritual">{item.name}</Link>
                  <span className="text-sm text-ink">{formatINR(item.price * item.quantity)}</span>
                </div>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-taupe">Size {item.size}</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-border">
                    <button aria-label="Decrease quantity" className="px-3 py-1.5 text-washed hover:text-ink" onClick={() => bag.updateQuantity(item.productId, item.size, item.quantity - 1)}>−</button>
                    <span className="min-w-6 text-center text-xs text-ink">{item.quantity}</span>
                    <button aria-label="Increase quantity" className="px-3 py-1.5 text-washed hover:text-ink" onClick={() => bag.updateQuantity(item.productId, item.size, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => bag.removeItem(item.productId, item.size)} className="font-sans text-[10px] uppercase tracking-[0.18em] text-taupe underline underline-offset-4 hover:text-terracotta">
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit border border-border bg-card p-6">
          <p className="eyebrow mb-5">Summary</p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="font-light text-washed">Subtotal</dt><dd className="text-ink">{formatINR(bag.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="font-light text-washed">Shipping</dt><dd className="text-ink">{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
            <div className="flex justify-between border-t border-border pt-3 text-base"><dt className="text-ink">Total</dt><dd className="text-ink">{formatINR(bag.subtotal + shipping)}</dd></div>
          </dl>
          {shipping > 0 && (
            <p className="mt-3 text-xs font-light text-taupe">Add {formatINR(freeThreshold - bag.subtotal)} more for free shipping.</p>
          )}
          <Link to="/checkout" className="mt-6 flex h-12 w-full items-center justify-center rounded-[2px] bg-primary font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground hover:bg-[#2a4a76]">
            Checkout
          </Link>
          <Link to="/shop" className="mt-3 block text-center font-sans text-[10px] uppercase tracking-[0.18em] text-ink underline underline-offset-4">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
