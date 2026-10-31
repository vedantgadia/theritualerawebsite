import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";

export const Route = createFileRoute("/_site/shipping-policy")({
  component: () => <PolicyPage title="Shipping Policy" body={SHIPPING} />,
});

const SHIPPING = "Placeholder — shipping policy text goes here.";
