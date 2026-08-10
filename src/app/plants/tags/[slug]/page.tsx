import { PlantCatalog } from "@/app/plants/page";

export const dynamic = "force-dynamic";

export default async function PlantTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  return (
    <PlantCatalog
      selectedTagSlug={slug}
      searchQuery={q}
      catalogPath={`/plants/tags/${encodeURIComponent(slug)}`}
    />
  );
}
