import { PlantsService } from "@/utils/services/plants/plants-service";
import { PlantTagsService } from "@/utils/services/plants/plant-tags-service";
import { TagsService } from "@/utils/services/plants/tags-service";
import { loadResult } from "@/lib/result";
import { plainText } from "@/lib/text";
import PageHero from "@/app/components/common/page-hero";
import PlantCard from "@/app/components/common/plant-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import StoreShell from "@/app/components/layout/store-shell";
import PlantDiscoverySidebar from "@/app/components/plants/plant-discovery-sidebar";
import CatalogSearch from "@/app/components/common/catalog-search";

export const dynamic = "force-dynamic";

interface PlantsPageProps {
  searchParams: Promise<{ tag?: string; q?: string }>;
}

export default async function PlantsPage({ searchParams }: PlantsPageProps) {
  const { tag: selectedTagSlug, q: searchQuery } = await searchParams;
  return (
    <PlantCatalog
      selectedTagSlug={selectedTagSlug}
      searchQuery={searchQuery}
      catalogPath="/plants"
    />
  );
}

export async function PlantCatalog({
  selectedTagSlug,
  searchQuery,
  catalogPath = "/plants",
}: {
  selectedTagSlug?: string;
  searchQuery?: string;
  catalogPath?: string;
}) {
  const [tagsResult, selectedTagResult] = await Promise.all([
    loadResult(TagsService.getAll(1, 100)),
    selectedTagSlug ? loadResult(TagsService.getBySlug(selectedTagSlug)) : Promise.resolve(null),
  ]);

  const tags = tagsResult.data?.data ?? [];
  const selectedTag = selectedTagResult?.data ?? undefined;
  const plantsResult = selectedTagSlug
    ? selectedTag
      ? await loadResult(PlantTagsService.getPlantsByTag(selectedTag.id))
      : { data: null, error: selectedTagResult?.error || "Plant tag not found" }
    : await loadResult(PlantsService.getAll(1, 60));
  const catalogPlants = plantsResult.data === null
    ? []
    : Array.isArray(plantsResult.data)
      ? plantsResult.data
      : plantsResult.data.data;
  const normalizedSearch = searchQuery?.trim() ?? "";
  const normalizedSearchLower = normalizedSearch.toLocaleLowerCase();
  const plants = normalizedSearch
    ? catalogPlants.filter((plant) =>
        plant.name?.toLocaleLowerCase().includes(normalizedSearchLower),
      )
    : catalogPlants;
  const total = normalizedSearch
    ? plants.length
    : plantsResult.data === null
    ? 0
    : Array.isArray(plantsResult.data)
      ? plantsResult.data.length
      : plantsResult.data.total;
  const returnParams = new URLSearchParams();
  if (normalizedSearch) returnParams.set("q", normalizedSearch);
  if (catalogPath === "/plants" && selectedTagSlug) returnParams.set("tag", selectedTagSlug);
  const returnQuery = returnParams.toString();
  const returnTo = returnQuery ? `${catalogPath}?${returnQuery}` : catalogPath;

  return (
    <StoreShell>
      <PageHero
        eyebrow={selectedTag ? "Plants by tag" : "Plant library"}
        title={selectedTag?.name || "Meet your next favorite plant."}
        description={plainText(selectedTag?.description) || "Browse the public FamPlants catalog, learn what each plant needs, and find the right fit for your home or garden."}
      />
      {tagsResult.error ? <div className="mb-8"><ErrorState message={tagsResult.error} /></div> : null}
      <div className="grid gap-8 pb-12 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <PlantDiscoverySidebar
          tags={tags}
          selectedSection={selectedTagSlug ? "tag" : "all"}
          selectedTagSlug={selectedTagSlug}
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
          <CatalogSearch
            action={catalogPath}
            query={normalizedSearch}
            placeholder="Search plants by name"
            hiddenFields={catalogPath === "/plants" ? { tag: selectedTagSlug } : undefined}
          />
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
              title={
                normalizedSearch
                  ? `No plants match “${normalizedSearch}”`
                  : selectedTag
                    ? `No plants tagged ${selectedTag.name || "this way"}`
                    : "No public plants yet"
              }
              description={
                normalizedSearch
                  ? "Try a different plant name or clear the search."
                  : selectedTag
                    ? "Try another tag or browse all plants."
                    : "Published plants will appear here."
              }
            />
          )}
        </section>
      </div>
    </StoreShell>
  );
}
