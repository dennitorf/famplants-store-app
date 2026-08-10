import { ProductCatalog } from "@/app/products/page";

export const dynamic = "force-dynamic";

export default async function ProductTagPage({
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
      selectedTagSlug={slug}
      searchQuery={q}
      catalogPath={`/products/tags/${encodeURIComponent(slug)}`}
    />
  );
}
