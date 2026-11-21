import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({
    meta: seo({
      title: "Terms & Conditions",
      description: "The terms that apply when you shop with The Ritual Era.",
    }),
  }),
  loader: () => getPolicy({ data: { kind: "terms" } }),
  component: Page,
});

function Page() {
  return <PolicyPage title="Terms & Conditions" policy={Route.useLoaderData()} />;
}
