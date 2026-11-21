import { createFileRoute, redirect } from "@tanstack/react-router";

/* Old sign-in address; accounts are now Shopify's, reached through /account. */
export const Route = createFileRoute("/_site/auth")({
  beforeLoad: () => {
    throw redirect({ href: "/account" });
  },
});
