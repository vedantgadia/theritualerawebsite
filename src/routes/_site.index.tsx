import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/")({
  component: () => <PagePlaceholder title="Her Forever Prêt" />,
});
