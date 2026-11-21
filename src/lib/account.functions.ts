import { createServerFn } from "@tanstack/react-start";

/*
 * Customer accounts (sign-in by email code, order history, addresses) are
 * Shopify's. The store's /account address sends shoppers to its customer
 * account pages; null while Shopify isn't connected (local development).
 */
export const getAccountUrl = createServerFn({ method: "GET" }).handler(async () => {
  const domain = process.env["SHOPIFY_STORE_DOMAIN"]
    ?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  return domain ? `https://${domain}/account` : null;
});
