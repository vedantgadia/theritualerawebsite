import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";
import { getPolicy } from "@/lib/policies.functions";

export const Route = createFileRoute("/_site/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — The Ritual Era" },
      { name: "description", content: "The terms that apply when you shop with The Ritual Era." },
    ],
  }),
  loader: () => getPolicy({ data: { kind: "terms" } }),
  component: () => <PolicyPage title="Terms & Conditions" policy={Route.useLoaderData()} />,
});
