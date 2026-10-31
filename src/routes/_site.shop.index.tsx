import { createFileRoute } from "@tanstack/react-router";
import { getCatalog, getCategories } from "@/lib/shop.functions";
import { ProductListing } from "@/components/site/product-listing";

export const Route = createFileRoute("/_site/shop/")({
  head: () => ({
    meta: [
      { title: "Clothing — The Ritual Era" },
      { name: "description", content: "Shop tops & shirts, dresses, co-ord sets, denim and jackets from The Ritual Era." },
    ],
  }),
  loader: async () => {
    const [products, categories] = await Promise.all([getCatalog({ data: {} }), getCategories()]);
    return { products, categories };
  },
  component: Clothing,
});

function Clothing() {
  const { products, categories } = Route.useLoaderData();
  return (
    <ProductListing
      eyebrow="Clothing"
      title="All Clothing"
      intro="Elevated everyday silhouettes, designed beyond a season. Denim sits at the heart of it all, reimagined through Indian textiles."
      products={products}
      tabs={[
        { label: "All", active: true },
        ...categories.map((c) => ({ label: c.name, category: c.slug, active: false })),
      ]}
    />
  );
}
