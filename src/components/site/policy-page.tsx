import type { Policy } from "@/lib/policies";

/*
 * A store policy page. The text is written in Shopify admin → Settings → Policies
 * and arrives already sanitised (see src/lib/policies.ts). Until it exists, a short
 * note points people to the studio instead.
 */
export function PolicyPage({ title, policy }: { title: string; policy: Policy | null }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="eyebrow mb-3">The Ritual Era</p>
      <h1 className="font-display text-3xl text-ink sm:text-4xl">{title}</h1>
      <div className="mt-6 h-px w-16 bg-sand" />
      {policy ? (
        <div className="policy-body mt-10" dangerouslySetInnerHTML={{ __html: policy.html }} />
      ) : (
        <div className="mt-10 space-y-4 text-sm font-light leading-relaxed text-washed">
          <p>We're putting the finishing touches to this page.</p>
          <p>
            In the meantime, message us on{" "}
            <a
              href="https://wa.me/919769728791"
              target="_blank"
              rel="noreferrer"
              className="text-ritual underline underline-offset-4"
            >
              WhatsApp
            </a>{" "}
            and we'll be happy to help.
          </p>
        </div>
      )}
    </div>
  );
}
