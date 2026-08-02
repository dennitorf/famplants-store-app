import { PlantsService } from "@/utils/services/plants/plants-service";
import { PlantTagsService } from "@/utils/services/plants/plant-tags-service";
import { TagsService } from "@/utils/services/plants/tags-service";
import { loadResult } from "@/lib/result";
import PageHero from "@/app/components/common/page-hero";
import PlantCard from "@/app/components/common/plant-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import StoreShell from "@/app/components/layout/store-shell";
import PlantDiscoverySidebar from "@/app/components/plants/plant-discovery-sidebar";

export const dynamic = "force-dynamic";

interface PlantsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function PlantsPage({ searchParams }: PlantsPageProps) {
  const { tag: selectedTagId } = await searchParams;
  const [tagsResult, plantsResult] = await Promise.all([
    loadResult(TagsService.getAll(1, 100)),
    selectedTagId
      ? loadResult(PlantTagsService.getPlantsByTag(selectedTagId))
      : loadResult(PlantsService.getAll(1, 60)),
  ]);

  const tags = tagsResult.data?.data ?? [];
  const selectedTag = tags.find((tag) => tag.id === selectedTagId);
  const plants = plantsResult.data === null
    ? []
    : Array.isArray(plantsResult.data)
      ? plantsResult.data
      : plantsResult.data.data;
  const total = plantsResult.data === null
    ? 0
    : Array.isArray(plantsResult.data)
      ? plantsResult.data.length
      : plantsResult.data.total;
  const returnTo = selectedTagId
    ? `/plants?tag=${encodeURIComponent(selectedTagId)}`
    : "/plants";

  return (
    <StoreShell>
      <PageHero
        eyebrow={selectedTag ? "Plants by tag" : "Plant library"}
        title={selectedTag?.name || "Meet your next favorite plant."}
        description={selectedTag?.description || "Browse the public FamPlants catalog, learn what each plant needs, and find the right fit for your home or garden."}
      />
      {tagsResult.error ? <div className="mb-8"><ErrorState message={tagsResult.error} /></div> : null}
      <div className="grid gap-8 pb-12 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <PlantDiscoverySidebar
          tags={tags}
          selectedSection={selectedTagId ? "tag" : "all"}
          selectedTagId={selectedTagId}
        />
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Explore</p>
              <h2 className="mt-1 text-2xl font-bold text-[#153f2f]">
                {selectedTag?.name || "All Plants"}
              </h2>
            </div>
            <p className="text-sm text-[#637b70]">{total} {total === 1 ? "plant" : "plants"}</p>
          </div>
          {plantsResult.error ? (
            <ErrorState message={plantsResult.error} />
          ) : plants.length ? (
            <div className="catalog-grid">
              {plants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} returnTo={returnTo} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={selectedTag ? `No plants tagged ${selectedTag.name || "this way"}` : "No public plants yet"}
              description={selectedTag ? "Try another tag or browse all plants." : "Published plants will appear here."}
            />
          )}
        </section>
      </div>
    </StoreShell>
  );
}
