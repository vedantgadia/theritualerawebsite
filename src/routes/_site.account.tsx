import { createFileRoute, redirect } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/page-placeholder";
import { getAccountUrl } from "@/lib/account.functions";

/* Sign-in, orders and addresses live in Shopify customer accounts. */
export const Route = createFileRoute("/_site/account")({
  loader: async () => {
    const href = await getAccountUrl();
    if (href) throw redirect({ href });
    return null;
  },
  component: () => <PagePlaceholder title="Your Account" />,
});
