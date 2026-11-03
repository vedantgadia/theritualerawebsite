import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { resolveBagLines } from "@/lib/checkout";
import {
  createShopifyCart,
  shopifyCartExists,
  shopifyEnabled,
  shopifySnapshot,
} from "@/lib/shopify/storefront.server";

export type StartCheckoutResult =
  | { status: "redirect"; url: string; cartId: string }
  | { status: "problems"; problems: string[] }
  | { status: "unavailable" };

const bagInput = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string().min(1).max(120),
        size: z.string().min(1).max(20),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
});

/*
 * Hands the bag to Shopify and returns the Shopify checkout address. Prices and
 * stock are re-read from Shopify here, and Shopify prices the order again at
 * checkout, so nothing the browser sends can change what is charged.
 */
export const startCheckout = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => bagInput.parse(d))
  .handler(async ({ data }): Promise<StartCheckoutResult> => {
    if (!shopifyEnabled()) return { status: "unavailable" };

    const { products } = await shopifySnapshot(true);
    const resolved = resolveBagLines(data.lines, products);
    if (!resolved.ok) return { status: "problems", problems: resolved.problems };

    const result = await createShopifyCart(resolved.lines);
    if (!result.cart || result.userErrors.length) {
      console.error("Shopify cartCreate failed", result.userErrors);
      return {
        status: "problems",
        problems: ["We couldn't start checkout just now. Please try again in a moment."],
      };
    }
    return { status: "redirect", url: result.cart.checkoutUrl, cartId: result.cart.id };
  });

/* Whether a checkout started earlier was completed (its Shopify cart is gone). */
export const checkoutCompleted = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ cartId: z.string().startsWith("gid://shopify/Cart/").max(200) }).parse(d),
  )
  .handler(async ({ data }): Promise<boolean> => {
    if (!shopifyEnabled()) return false;
    return !(await shopifyCartExists(data.cartId));
  });
