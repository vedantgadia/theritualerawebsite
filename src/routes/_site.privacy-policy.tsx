import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage } from "@/components/site/policy-page";

export const Route = createFileRoute("/_site/privacy-policy")({
  component: () => <PolicyPage title="Privacy Policy" body="Placeholder — privacy policy text goes here." />,
});
