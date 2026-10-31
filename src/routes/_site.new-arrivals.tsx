import { createFileRoute } from "@tanstack/react-router";
import { getCatalog } from "@/lib/shop.functions";
import { ProductListing } from "@/components/site/product-listing";

export const Route = createFileRoute("/_site/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — The Ritual Era" },
      { name: "description", content: "The newest pieces from The Ritual Era: denim, crochet, ajrakh and chanderi, designed and made in Mumbai." },
    ],
  }),
  loader: () => getCatalog({ data: { isNew: true } }),
  component: NewArrivals,
});

function NewArrivals() {
  const products = Route.useLoaderData();
  return (
    <ProductListing
      eyebrow="Just in · October"
      title={<>New <em className="font-normal italic">Arrivals</em></>}
      intro="Fresh off the cutting table. Small runs, made in-house — when a size is gone, it's usually gone for good."
      products={products}
      defaultSort="newest"
    />
  );
}
