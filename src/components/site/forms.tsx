import { useId, useState, type ReactNode } from "react";
import { Button, Input, Textarea } from "@/components/ui/brand";
import { contactSchema, fieldErrors, MEASUREMENTS, mtmSchema, type FormResult } from "@/lib/forms";
import { submitContact, submitMtmRequest } from "@/lib/forms.functions";
import { whatsappLink } from "@/lib/contact";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string;
  children: (id: string, describedBy: string | undefined) => ReactNode;
}) {
  const id = useId();
  const msgId = `${id}-msg`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      {children(id, error || hint ? msgId : undefined)}
      {(error || hint) && (
        <p
          id={msgId}
          className={`mt-1.5 text-xs font-light ${error ? "text-terracotta" : "text-taupe"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

/* Hidden from people and screen readers; bots that fill every field reveal themselves. */
function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

function useFormState<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const set = (key: keyof T) => (v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    setErrors((e) => {
      const { [key as string]: _, form: __, ...rest } = e;
      return rest;
    });
  };
  async function send(
    validate: (v: T) => { success: boolean; error?: import("zod").ZodError },
    submit: (v: T) => Promise<FormResult>,
  ) {
    const check = validate(values);
    if (!check.success && check.error) {
      setErrors(fieldErrors(check.error));
      return;
    }
    setStatus("sending");
    try {
      const result = await submit(values);
      if (result.ok) setStatus("done");
      else {
        setErrors(result.errors);
        setStatus("idle");
      }
    } catch {
      setErrors({
        form: "Sorry, that didn't go through. Please try again, or message us on WhatsApp.",
      });
      setStatus("idle");
    }
  }
  return { values, errors, status, set, send };
}

function FormError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm font-light text-terracotta">
      {message}
    </p>
  );
}

function ThankYou({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div role="status" className="border border-border bg-card px-6 py-10 text-center">
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-sm font-light leading-relaxed text-washed">
        {children}
      </p>
    </div>
  );
}

/* --------------------------------- Contact --------------------------------- */

export function ContactForm() {
  const f = useFormState({ name: "", email: "", phone: "", message: "", website: "" });
  if (f.status === "done") {
    return (
      <ThankYou title="Thank you. Your message is with us.">
        We'll reply by email or phone, 10am–7pm. For anything urgent, message us on WhatsApp.
      </ThankYou>
    );
  }
  return (
    <form
      noValidate
      className="relative space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        void f.send(
          (v) => contactSchema.safeParse(v),
          (v) => submitContact({ data: v }),
        );
      }}
    >
      <Honeypot value={f.values.website} onChange={f.set("website")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={f.errors["name"]}>
          {(id, d) => (
            <Input
              id={id}
              aria-describedby={d}
              aria-invalid={!!f.errors["name"]}
              autoComplete="name"
              value={f.values.name}
              onChange={(e) => f.set("name")(e.target.value)}
            />
          )}
        </Field>
        <Field label="Email" error={f.errors["email"]}>
          {(id, d) => (
            <Input
              id={id}
              type="email"
              aria-describedby={d}
              aria-invalid={!!f.errors["email"]}
              autoComplete="email"
              value={f.values.email}
              onChange={(e) => f.set("email")(e.target.value)}
            />
          )}
        </Field>
      </div>
      <Field label="Phone (optional)" error={f.errors["phone"]}>
        {(id, d) => (
          <Input
            id={id}
            type="tel"
            aria-describedby={d}
            aria-invalid={!!f.errors["phone"]}
            autoComplete="tel"
            value={f.values.phone}
            onChange={(e) => f.set("phone")(e.target.value)}
          />
        )}
      </Field>
      <Field label="Message" error={f.errors["message"]}>
        {(id, d) => (
          <Textarea
            id={id}
            rows={6}
            aria-describedby={d}
            aria-invalid={!!f.errors["message"]}
            value={f.values.message}
            onChange={(e) => f.set("message")(e.target.value)}
          />
        )}
      </Field>
      <FormError message={f.errors["form"]} />
      <Button type="submit" className="w-full sm:w-auto" disabled={f.status === "sending"}>
        {f.status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

/* ----------------------------- Made-to-measure ----------------------------- */

export function MtmForm({
  productSlug,
  productName,
}: {
  productSlug?: string | undefined;
  productName?: string | undefined;
}) {
  const f = useFormState({
    name: "",
    phone: "",
    email: "",
    productSlug: productSlug ?? "",
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    length: "",
    height: "",
    notes: "",
    website: "",
  });
  if (f.status === "done") {
    return (
      <ThankYou title="Request received.">
        Thank you{f.values.name ? `, ${f.values.name.split(" ")[0]}` : ""}. Our studio will call or
        WhatsApp you to confirm your measurements, fabric, price and timeline before anything is
        made. Nothing is charged until you confirm.
      </ThankYou>
    );
  }
  return (
    <form
      noValidate
      className="relative space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        void f.send(
          (v) => mtmSchema.safeParse(v),
          (v) => submitMtmRequest({ data: v }),
        );
      }}
    >
      <Honeypot value={f.values.website} onChange={f.set("website")} />
      {productName && (
        <p className="border-l border-sand pl-4 text-sm font-light text-washed">
          For: <span className="text-ink">{productName}</span>
        </p>
      )}
      <div className="space-y-5">
        <Field label="Name" error={f.errors["name"]}>
          {(id, d) => (
            <Input
              id={id}
              aria-describedby={d}
              aria-invalid={!!f.errors["name"]}
              autoComplete="name"
              value={f.values.name}
              onChange={(e) => f.set("name")(e.target.value)}
            />
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone / WhatsApp" error={f.errors["phone"]}>
            {(id, d) => (
              <Input
                id={id}
                type="tel"
                aria-describedby={d}
                aria-invalid={!!f.errors["phone"]}
                autoComplete="tel"
                value={f.values.phone}
                onChange={(e) => f.set("phone")(e.target.value)}
              />
            )}
          </Field>
          <Field label="Email" error={f.errors["email"]}>
            {(id, d) => (
              <Input
                id={id}
                type="email"
                aria-describedby={d}
                aria-invalid={!!f.errors["email"]}
                autoComplete="email"
                value={f.values.email}
                onChange={(e) => f.set("email")(e.target.value)}
              />
            )}
          </Field>
        </div>
      </div>

      <fieldset>
        <legend className="eyebrow mb-1">Measurements, in inches (optional)</legend>
        <p className="mb-4 text-xs font-light text-taupe">
          Fill in what you know. We'll take the rest together on a call.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {MEASUREMENTS.map((m) => (
            <Field key={m.key} label={m.label} error={f.errors[m.key]}>
              {(id, d) => (
                <Input
                  id={id}
                  inputMode="decimal"
                  aria-describedby={d}
                  value={f.values[m.key]}
                  onChange={(e) => f.set(m.key)(e.target.value)}
                />
              )}
            </Field>
          ))}
        </div>
      </fieldset>

      <Field
        label="Anything else? (optional)"
        error={f.errors["notes"]}
        hint="Fit preferences, the occasion, sleeve or length changes."
      >
        {(id, d) => (
          <Textarea
            id={id}
            rows={4}
            aria-describedby={d}
            value={f.values.notes}
            onChange={(e) => f.set("notes")(e.target.value)}
          />
        )}
      </Field>

      <FormError message={f.errors["form"]} />
      <Button type="submit" className="w-full" disabled={f.status === "sending"}>
        {f.status === "sending" ? "Sending…" : "Send request"}
      </Button>
      <p className="text-center text-xs font-light text-washed">
        Prefer to talk?{" "}
        <a
          href={whatsappLink(
            productName
              ? `Hi! I'd like to request the ${productName} made to measure.`
              : "Hi! I'd like to request a piece made to measure.",
          )}
          target="_blank"
          rel="noreferrer"
          className="text-ritual underline underline-offset-4"
        >
          Message us on WhatsApp
        </a>
      </p>
    </form>
  );
}
