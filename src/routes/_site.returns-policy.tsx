import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";

export const Route = createFileRoute("/_site/returns-policy")({
  head: () => ({
    meta: [
      { title: "Returns & Exchange Policy — The Ritual Era" },
      { name: "description", content: "How exchanges and refunds work at The Ritual Era." },
    ],
  }),
  loader: () => getPolicy({ data: { kind: "returns" } }),
  component: () => <PolicyPage title="Returns & Exchange Policy" policy={Route.useLoaderData()} />,
});
