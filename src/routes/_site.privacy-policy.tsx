import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/privacy-policy")({
  head: () => ({
    meta: seo({
      title: "Privacy Policy",
      description: "How The Ritual Era collects, uses and protects your personal information.",
    }),
  }),
  loader: () => getPolicy({ data: { kind: "privacy" } }),
  component: Page,
});

function Page() {
  return <PolicyPage title="Privacy Policy" policy={Route.useLoaderData()} />;
}
