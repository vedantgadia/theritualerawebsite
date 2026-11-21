/*
 * Validation for the contact and made-to-measure forms. Shared by the browser
 * (instant feedback) and the server functions (the real check before saving).
 * Limits mirror the database constraints in
 * supabase/migrations/20261121091520_ritual_era_content_tables.sql.
 */
import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);

const email = z
  .string()
  .trim()
  .max(320)
  .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Please enter a valid email address.");

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9][0-9 ()-]{4,28}$/, "Please enter a phone number we can reach you on.");

/*
 * `website` is a honeypot: hidden from people, but spam bots fill it in.
 * A submission with it set is accepted silently and not saved.
 */
const honeypot = { website: z.string().max(200).optional() };

export const contactSchema = z.object({
  name: trimmed(200).min(1, "Please tell us your name."),
  email,
  phone: z.union([z.literal(""), phone]).optional(),
  message: trimmed(5000).min(1, "Please write a message."),
  ...honeypot,
});
export type ContactInput = z.input<typeof contactSchema>;

/* Body measurements in inches, as free text ("34", "34.5", "about 35"). */
const measurement = trimmed(40).optional();

export const MEASUREMENTS = [
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "length", label: "Length" },
  { key: "height", label: "Your height" },
] as const;

export const mtmSchema = z.object({
  name: trimmed(200).min(1, "Please tell us your name."),
  phone,
  email,
  productSlug: z
    .string()
    .trim()
    .max(120)
    .regex(/^[a-z0-9-]*$/)
    .optional(),
  bust: measurement,
  waist: measurement,
  hip: measurement,
  shoulder: measurement,
  length: measurement,
  height: measurement,
  notes: trimmed(5000).optional(),
  ...honeypot,
});
export type MtmInput = z.input<typeof mtmSchema>;

/** First validation message per field, for showing under each input. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

export type FormResult = { ok: true } | { ok: false; errors: Record<string, string> };
