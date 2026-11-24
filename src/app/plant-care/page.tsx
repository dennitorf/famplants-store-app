import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import { ErrorState } from "@/app/components/common/async-state";
import { loadResult } from "@/lib/result";
import { PlantsService } from "@/utils/services/plants/plants-service";
import PlantCareContent from "./plant-care-content";

export const dynamic = "force-dynamic";

export default async function Page() {
  // An empty search loads every public catalog page, keeping directory search complete.
  const result = await loadResult(PlantsService.search(""));
  return (
    <StoreShell>
      <PageHero eyebrow="Grow with confidence" title="Plant Care Guides" description="Find your plant and explore care guidance for your growing conditions." />
      <section className="pb-12">
        {result.data ? <PlantCareContent plants={result.data.data} /> : <ErrorState message="The plant catalog is unavailable. Please try again shortly." />}
      </section>
    </StoreShell>
  );
}
