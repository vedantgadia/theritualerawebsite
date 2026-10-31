import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";

export const Route = createFileRoute("/_site/terms")({
  component: () => <PolicyPage title="Terms & Conditions" body="Placeholder — terms and conditions text goes here." />,
});
