import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import FamilyCard from "@/app/components/common/family-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import { FamiliesService } from "@/utils/services/plants/families-service";
import { loadResult } from "@/lib/result";

export const dynamic = "force-dynamic";

export default async function FamiliesPage() {
  const result = await loadResult(FamiliesService.getAll(1, 60));
  if (result.data === null) {
    return <StoreShell><PageHero eyebrow="Plant families" title="Know the family." description="Learn how related plants grow." /><ErrorState message={result.error} /></StoreShell>;
  }
  const response = result.data;
  return (
    <StoreShell>
        <PageHero eyebrow="Plant families" title="Know the family. Understand the plant." description="Related plants often share rhythms, preferences, and care needs. Start with a family and explore from there." />
        {response.data.length ? (
          <section className="catalog-grid pb-12">
            {response.data.map((family) => <FamilyCard key={family.id} family={family} />)}
          </section>
        ) : <EmptyState title="No families yet" description="Published families will appear here." />}
    </StoreShell>
  );
}
