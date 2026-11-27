import { createFileRoute, redirect } from "@tanstack/react-router";

/* Checkout happens on Shopify (the bag's Checkout button goes there); old links land on the bag. */
export const Route = createFileRoute("/_site/checkout")({
  beforeLoad: () => {
    throw redirect({ to: "/cart" });
  },
});
