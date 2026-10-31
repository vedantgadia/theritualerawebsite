import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";

export const Route = createFileRoute("/_site/returns-policy")({
  component: () => <PolicyPage title="Returns & Exchange Policy" body="Placeholder — returns and exchange policy text goes here." />,
});
