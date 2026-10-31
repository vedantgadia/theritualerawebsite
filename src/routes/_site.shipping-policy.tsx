import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";

export const Route = createFileRoute("/_site/shipping-policy")({
  component: () => <PolicyPage title="Shipping Policy" body="Placeholder — shipping policy text goes here." />,
});
