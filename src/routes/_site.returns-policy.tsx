import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/returns-policy")({
  head: () => ({
    meta: seo({
      title: "Returns & Exchange Policy",
      description: "How exchanges and refunds work at The Ritual Era.",
    }),
  }),
  loader: () => getPolicy({ data: { kind: "returns" } }),
  component: Page,
});

function Page() {
  return <PolicyPage title="Returns & Exchange Policy" policy={Route.useLoaderData()} />;
}
