import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/page-placeholder";

export const Route = createFileRoute("/_site/lookbook/$slug")({
  component: () => <PagePlaceholder title="Campaign" />,
});
