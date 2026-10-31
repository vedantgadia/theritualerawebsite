import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/page-placeholder";

export const Route = createFileRoute("/_site/account")({
  component: () => <PagePlaceholder title="Your Account" />,
});
