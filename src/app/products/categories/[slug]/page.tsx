import { ProductCatalog } from "@/app/products/page";

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductCatalog selectedCategoryKey={slug} />;
}
