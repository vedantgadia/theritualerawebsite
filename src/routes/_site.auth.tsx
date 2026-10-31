import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/page-placeholder";

export const Route = createFileRoute("/_site/auth")({
  component: () => <PagePlaceholder title="Sign in" />,
});
