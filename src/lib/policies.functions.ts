import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { POLICY_KINDS, type Policy } from "@/lib/policies";
import { shopifyEnabled, shopifyPolicies } from "@/lib/shopify/storefront.server";

/*
 * One store policy as written in Shopify admin, or null when Shopify isn't
 * connected, the policy hasn't been written yet, or Shopify can't be reached —
 * the page then shows a short "being finalised" note instead of failing.
 */
export const getPolicy = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ kind: z.enum(POLICY_KINDS) }).parse(d))
  .handler(async ({ data }): Promise<Policy | null> => {
    if (!shopifyEnabled()) return null;
    try {
      return (await shopifyPolicies())[data.kind] ?? null;
    } catch (err) {
      console.error("Could not load store policy from Shopify", err);
      return null;
    }
  });
