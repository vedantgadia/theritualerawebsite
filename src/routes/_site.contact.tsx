import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactForm } from "@/components/site/forms";
import { CONTACT_EMAIL, PHONE_DISPLAY, whatsappLink } from "@/lib/contact";
import { StitchDivider } from "@/components/site/motion";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/contact")({
  head: () => ({
    meta: seo({
      title: "Contact",
      description:
        "Write to The Ritual Era studio in Mumbai: WhatsApp +91 97697 28791, email info@theritualera.com, 10am–7pm.",
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      <header className="max-w-2xl">
        <p className="eyebrow mb-3">The Ritual Era</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Write to the <em className="font-normal italic text-ritual">studio</em>
        </h1>
        <p className="mt-5 text-sm font-light leading-relaxed text-washed">
          Questions about a piece, its fit or an order? We're happy to help. The quickest way to
          reach us is WhatsApp.
        </p>
      </header>

      <StitchDivider className="my-12 max-w-xs" />

      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <aside className="space-y-9">
          <ContactItem label="WhatsApp & phone">
            <a
              href={whatsappLink("Hi! I have a question for The Ritual Era.")}
              target="_blank"
              rel="noreferrer"
              className="text-ritual underline underline-offset-4"
            >
              {PHONE_DISPLAY}
            </a>
          </ContactItem>
          <ContactItem label="Email">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-ritual underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </ContactItem>
          <ContactItem label="Studio">Mumbai, India</ContactItem>
          <ContactItem label="Hours">10am–7pm, closed on public holidays</ContactItem>
          <div className="border-t border-border pt-8">
            <p className="font-display text-xl text-ink">Made to your measure</p>
            <p className="mt-2 text-sm font-light leading-relaxed text-washed">
              Any piece can be made to your measurements.
            </p>
            <Link
              to="/made-to-measure"
              className="mt-4 inline-block font-sans text-sm font-medium text-ritual underline underline-offset-4"
            >
              Request made-to-measure
            </Link>
          </div>
        </aside>

        <section aria-labelledby="contact-form-title">
          <h2 id="contact-form-title" className="mb-6 font-display text-2xl text-ink">
            Send us a message
          </h2>
          <ContactForm />
        </section>
      </div>
    </div>
  );
}

function ContactItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <p className="text-base font-light text-ink">{children}</p>
    </div>
  );
}
