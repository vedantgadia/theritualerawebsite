import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCatalog, getCategories } from "@/lib/shop.functions";
import { ProductListing } from "@/components/site/product-listing";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/_site/shop/$category")({
  loader: async ({ params }) => {
    const [products, categories] = await Promise.all([
      getCatalog({ data: { category: params.category } }),
      getCategories(),
    ]);
    const category = categories.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { products, categories, category };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? seo({
          title: loaderData.category.name,
          description: loaderData.category.blurb,
          image: loaderData.category.image,
        })
      : [],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { products, categories, category } = Route.useLoaderData();
  return (
    <ProductListing
      eyebrow="Clothing"
      title={category.name}
      intro={category.blurb}
      products={products}
      tabs={[
        { label: "All", active: false },
        ...categories.map((c) => ({
          label: c.name,
          category: c.slug,
          active: c.slug === category.slug,
        })),
      ]}
    />
  );
}
