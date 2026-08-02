import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PlantCard from "@/app/components/common/plant-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import StoreShell from "@/app/components/layout/store-shell";
import { loadResult } from "@/lib/result";
import { plainText } from "@/lib/text";
import { isGuid } from "@/utils/helpers/entity-key";
import { CollectionsService } from "@/utils/services/plants/collections-service";
import { PlantCollectionsService } from "@/utils/services/plants/plant-collections-service";
import ShareButton from "@/app/components/share/share-button";

export const dynamic = "force-dynamic";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collectionResult = await loadResult(
    isGuid(slug) ? CollectionsService.getById(slug) : CollectionsService.getBySlug(slug),
  );
  const collection = collectionResult.data;
  const plantsResult = collection
    ? await loadResult(PlantCollectionsService.getPlants(collection.id))
    : { data: null, error: collectionResult.error };
  const collectionPlants = plantsResult.data;
  const collectionPath = `/collections/${collection?.slug || slug}`;

  return (
    <StoreShell>
      <div className="flex items-center justify-between gap-3 py-6">
        <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]">
          <ArrowLeft className="h-4 w-4" /> Back to collections
        </Link>
        {collection ? (
          <ShareButton
            label={`Share ${collection.name || "collection"}`}
            path={collectionPath}
            className="size-10 rounded-full border-emerald-950/15 text-[#0A3D27]"
          />
        ) : null}
      </div>
      <section className="pb-12">
        {!collection ? (
          <ErrorState message={collectionResult.error} />
        ) : (
          <div className="mb-8 rounded-3xl bg-[#eaf4e5] p-6 sm:p-8">
            <p className="eyebrow">Plant collection</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl text-[#0A3D27] sm:text-5xl">
              {collection.name || "Plant collection"}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#557064]">
              {plainText(collection.description || collection.shortDescription)
                || "Explore the plants selected for this collection."}
            </p>
          </div>
        )}

        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Explore</p>
            <h2 className="mt-1 text-2xl font-bold text-[#153f2f]">Plants in this collection</h2>
          </div>
          {collectionPlants ? (
            <p className="text-sm text-[#637b70]">
              {collectionPlants.total} {collectionPlants.total === 1 ? "plant" : "plants"}
            </p>
          ) : null}
        </div>
        {!collectionPlants ? (
          <ErrorState message={plantsResult.error} />
        ) : collectionPlants.data.length ? (
          <div className="catalog-grid">
            {collectionPlants.data.map((plant) => (
              <PlantCard key={plant.id} plant={plant} returnTo={collectionPath} />
            ))}
          </div>
        ) : (
          <EmptyState title="No public plants in this collection" description="Check back as this collection grows." />
        )}
      </section>
    </StoreShell>
  );
}
