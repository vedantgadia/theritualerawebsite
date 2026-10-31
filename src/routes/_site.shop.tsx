import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/page-placeholder";

export const Route = createFileRoute("/_site/shop")({
  component: () => <PagePlaceholder title="The Collection" />,
});
