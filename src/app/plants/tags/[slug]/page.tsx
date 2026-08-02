import { PlantCatalog } from "@/app/plants/page";

export const dynamic = "force-dynamic";

export default async function PlantTagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlantCatalog selectedTagSlug={slug} />;
}
