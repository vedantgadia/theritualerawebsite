import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/shipping-policy")({
  head: () => ({
    meta: seo({
      title: "Shipping Policy",
      description: "Where we ship, what it costs and how long delivery takes.",
    }),
  }),
  loader: () => getPolicy({ data: { kind: "shipping" } }),
  component: Page,
});

function Page() {
  return <PolicyPage title="Shipping Policy" policy={Route.useLoaderData()} />;
}
