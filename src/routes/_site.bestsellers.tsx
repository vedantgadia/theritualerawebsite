import { createFileRoute } from "@tanstack/react-router";
import { getCatalog } from "@/lib/shop.functions";
import { ProductListing } from "@/components/site/product-listing";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/bestsellers")({
  head: () => ({
    meta: seo({ title: "Bestsellers", description: "The pieces our community returns to again and again." }),
  }),
  loader: () => getCatalog({ data: { bestseller: true } }),
  component: Bestsellers,
});

function Bestsellers() {
  const products = Route.useLoaderData();
  return (
    <ProductListing
      eyebrow="Most loved"
      title="Bestsellers"
      intro="The pieces our community reaches for again and again — worn, repeated and reimagined. Start here if you're new to us."
      products={products}
    />
  );
}
