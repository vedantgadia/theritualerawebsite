import { describe, expect, it } from "vitest";
import { contactSchema, fieldErrors, mtmSchema } from "@/lib/forms";

describe("contact form", () => {
  it("accepts a normal message and trims it", () => {
    const r = contactSchema.parse({
      name: "  Asha  ",
      email: "asha@example.com",
      phone: "",
      message: " Does the Dune Shirt run large? ",
    });
    expect(r.name).toBe("Asha");
    expect(r.message).toBe("Does the Dune Shirt run large?");
  });

  it("explains each missing or invalid field", () => {
    const r = contactSchema.safeParse({ name: " ", email: "nope", phone: "12", message: "" });
    expect(r.success).toBe(false);
    const errors = fieldErrors(r.error!);
    expect(Object.keys(errors).sort()).toEqual(["email", "message", "name", "phone"]);
    expect(errors["email"]).toBe("Please enter a valid email address.");
  });
});

describe("made-to-measure form", () => {
  const base = { name: "Meera", phone: "+91 98765 43210", email: "meera@example.com" };

  it("needs only name, phone and email; measurements are optional", () => {
    expect(mtmSchema.safeParse(base).success).toBe(true);
    expect(
      mtmSchema.safeParse({ ...base, productSlug: "dune-shirt", bust: "34", notes: "Longer" })
        .success,
    ).toBe(true);
  });

  it("requires a reachable phone number", () => {
    const r = mtmSchema.safeParse({ ...base, phone: "call me" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r.error!)["phone"]).toMatch(/phone number/);
  });

  it("rejects a product slug that isn't one", () => {
    expect(mtmSchema.safeParse({ ...base, productSlug: "<script>" }).success).toBe(false);
  });

  it("keeps the database limits", () => {
    expect(mtmSchema.safeParse({ ...base, notes: "x".repeat(5001) }).success).toBe(false);
    expect(mtmSchema.safeParse({ ...base, bust: "x".repeat(41) }).success).toBe(false);
  });
});
