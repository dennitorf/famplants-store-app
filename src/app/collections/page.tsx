import CollectionCard from "@/app/components/common/collection-card";
import PageHero from "@/app/components/common/page-hero";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import StoreShell from "@/app/components/layout/store-shell";
import { loadResult } from "@/lib/result";
import { CollectionsService } from "@/utils/services/plants/collections-service";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const collectionsResult = await loadResult(CollectionsService.getAll(1, 60));
  const collections = collectionsResult.data?.data ?? [];

  return (
    <StoreShell>
      <PageHero
        eyebrow="Plant collections"
        title="Plants, thoughtfully grouped."
        description="Explore curated groups of plants selected around a shared idea, setting, or growing experience."
      />
      <section className="pb-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Curated for discovery</p>
            <h2 className="mt-1 text-2xl font-bold text-[#153f2f]">All collections</h2>
          </div>
          {collectionsResult.data ? (
            <p className="text-sm text-[#637b70]">
              {collectionsResult.data.total} {collectionsResult.data.total === 1 ? "collection" : "collections"}
            </p>
          ) : null}
        </div>
        {collectionsResult.error ? (
          <ErrorState message={collectionsResult.error} />
        ) : collections.length ? (
          <div className="catalog-grid">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <EmptyState title="No public collections yet" description="Published collections will appear here." />
        )}
      </section>
    </StoreShell>
  );
}
