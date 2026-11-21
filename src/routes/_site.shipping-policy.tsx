import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";

export const Route = createFileRoute("/_site/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping Policy — The Ritual Era" },
      { name: "description", content: "Where we ship, what it costs and how long delivery takes." },
    ],
  }),
  loader: () => getPolicy({ data: { kind: "shipping" } }),
  component: () => <PolicyPage title="Shipping Policy" policy={Route.useLoaderData()} />,
});
