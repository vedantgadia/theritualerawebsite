import { createFileRoute } from "@tanstack/react-router";
import { PagePlaceholder } from "@/components/site/page-placeholder";

export const Route = createFileRoute("/_site/pop-ups")({
  component: () => <PagePlaceholder title="Pop-ups & Events" />,
});
