import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";

export const Route = createFileRoute("/_site/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — The Ritual Era" },
      {
        name: "description",
        content: "How The Ritual Era collects, uses and protects your personal information.",
      },
    ],
  }),
  loader: () => getPolicy({ data: { kind: "privacy" } }),
  component: () => <PolicyPage title="Privacy Policy" policy={Route.useLoaderData()} />,
});
