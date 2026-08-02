import { ProductCatalog } from "@/app/products/page";

export const dynamic = "force-dynamic";

export default async function ProductTagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductCatalog selectedTagSlug={slug} />;
}
