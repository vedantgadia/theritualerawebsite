import { createServerFn } from "@tanstack/react-start";
import { createPublicClient } from "@/integrations/supabase/client";
import { contactSchema, fieldErrors, mtmSchema, type FormResult } from "@/lib/forms";

/*
 * Form submissions are saved with the publishable key, so the database's own
 * rules apply: visitors can add rows but never read them back. The owner sees
 * them in the Supabase Table Editor (contact_messages, mtm_requests).
 */
const db = () =>
  createPublicClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!);

const failed = (message: string): FormResult => ({ ok: false, errors: { form: message } });
const SAVE_FAILED = "Sorry, that didn't go through. Please try again, or message us on WhatsApp.";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<FormResult> => {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
    const { website, ...m } = parsed.data;
    if (website) return { ok: true };
    const { error } = await db()
      .from("contact_messages")
      .insert({ name: m.name, email: m.email, phone: m.phone ?? "", message: m.message });
    if (error) {
      console.error("Could not save contact message", error);
      return failed(SAVE_FAILED);
    }
    return { ok: true };
  });

export const submitMtmRequest = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<FormResult> => {
    const parsed = mtmSchema.safeParse(data);
    if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
    const { website, productSlug, ...r } = parsed.data;
    if (website) return { ok: true };
    const { error } = await db()
      .from("mtm_requests")
      .insert({
        name: r.name,
        phone: r.phone,
        email: r.email,
        product_slug: productSlug || null,
        bust: r.bust ?? "",
        waist: r.waist ?? "",
        hip: r.hip ?? "",
        shoulder: r.shoulder ?? "",
        length: r.length ?? "",
        height: r.height ?? "",
        notes: r.notes ?? "",
      });
    if (error) {
      console.error("Could not save made-to-measure request", error);
      return failed(SAVE_FAILED);
    }
    return { ok: true };
  });
