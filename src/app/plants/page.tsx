import { PlantsService } from "@/utils/services/plants/plants-service";
import { loadResult } from "@/lib/result";
import PageHero from "@/app/components/common/page-hero";
import PlantCard from "@/app/components/common/plant-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import StoreShell from "@/app/components/layout/store-shell";

export const dynamic = "force-dynamic";

export default async function PlantsPage() {
  const result = await loadResult(PlantsService.getAll(1, 60));
  if (result.data === null) {
    return <StoreShell><PageHero eyebrow="Plant library" title="Meet your next favorite plant." description="Care knowledge for growers at every level." /><ErrorState message={result.error} /></StoreShell>;
  }
  const response = result.data;
  return (
    <StoreShell>
        <PageHero
          eyebrow="Plant library"
          title="Meet your next favorite plant."
          description="Browse the public FamPlants catalog, learn what each plant needs, and find the right fit for your home or garden."
        />
        <section className="pb-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Explore</p>
              <h2 className="mt-1 text-2xl font-bold text-[#153f2f]">All public plants</h2>
            </div>
            <p className="text-sm text-[#637b70]">{response.total} plants</p>
          </div>
          {response.data.length ? (
            <div className="catalog-grid">
              {response.data.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
            </div>
          ) : (
            <EmptyState title="No public plants yet" description="Published plants will appear here." />
          )}
        </section>
    </StoreShell>
  );
}
