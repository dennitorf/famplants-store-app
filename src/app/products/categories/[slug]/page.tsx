import { ProductCatalog } from "@/app/products/page";

export default async function ProductCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  return (
    <ProductCatalog
      selectedCategoryKey={slug}
      searchQuery={q}
      catalogPath={`/products/categories/${encodeURIComponent(slug)}`}
    />
  );
}
