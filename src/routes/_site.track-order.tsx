import { createFileRoute } from "@tanstack/react-router";
import { StitchDivider } from "@/components/site/motion";
import { whatsappLink } from "@/lib/contact";
import { seo } from "@/lib/seo";

/*
 * Orders, their status and tracking live in Shopify. Shoppers sign in to their
 * Shopify customer account (one-time code sent to the email used at checkout,
 * guest orders included) or follow the link in their order emails.
 */
export const Route = createFileRoute("/_site/track-order")({
  head: () => ({
    meta: seo({
      title: "Track Your Order",
      description: "See the status and tracking of your Ritual Era order.",
    }),
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="eyebrow mb-3">The Ritual Era</p>
      <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
        Track your <em className="font-normal italic text-ritual">order</em>
      </h1>
      <p className="mt-5 text-sm font-light leading-relaxed text-washed">
        Sign in with the email address you used at checkout — we'll send you a one-time code, no
        password needed. You'll see every order placed with that email, its status and, once it has
        shipped, its tracking.
      </p>
      {/* A full page load: /account forwards to Shopify's customer account pages. */}
      <a
        href="/account"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-[2px] bg-primary px-8 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-[#2a4a76]"
      >
        View my orders
      </a>

      <StitchDivider className="my-12 max-w-xs" />

      <div className="space-y-8 text-sm font-light leading-relaxed text-washed">
        <div>
          <p className="font-display text-lg text-ink">From your order email</p>
          <p className="mt-1">
            Your order confirmation and shipping emails each have a link to your order's status
            page. When your order ships, the shipping email includes the courier and tracking
            number.
          </p>
        </div>
        <div>
          <p className="font-display text-lg text-ink">Still can't find it?</p>
          <p className="mt-1">
            Message us with your order number and we'll check for you.{" "}
            <a
              href={whatsappLink("Hi! Could you help me track my order? My order number is ")}
              target="_blank"
              rel="noreferrer"
              className="text-ritual underline underline-offset-4"
            >
              WhatsApp us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
