import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import PlantCard from "@/app/components/common/plant-card";
import { ErrorState, EmptyState } from "@/app/components/common/async-state";
import { FamiliesService } from "@/utils/services/plants/families-service";
import { FamilyPlantsService } from "@/utils/services/plants/family-plants-service";
import { plainText } from "@/lib/text";
import RichHtml from "@/app/components/common/rich-html";
import { loadResult } from "@/lib/result";
import { isGuid } from "@/utils/helpers/entity-key";

export const dynamic = "force-dynamic";

export default async function FamilyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const familyResult = await loadResult(
    isGuid(slug) ? FamiliesService.getById(slug) : FamiliesService.getBySlug(slug),
  );
  if (familyResult.data === null) {
    return <StoreShell><div className="py-14"><ErrorState message={familyResult.error} /></div></StoreShell>;
  }
  const family = familyResult.data;
  const result = await loadResult(FamilyPlantsService.getAll(family.id, 1, 60));
  if (result.data === null) {
    return <StoreShell><div className="py-14"><ErrorState message={result.error} /></div></StoreShell>;
  }
  const plants = result.data;
  const familyImage = family.mainImage?.url || family.mainImage?.thumbnailUrl;
  return (
    <StoreShell>
        <div className="py-6"><Link href="/families" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]"><ArrowLeft className="h-4 w-4" /> Back to families</Link></div>
        <section className="grid gap-8 pb-10 lg:grid-cols-[.8fr_1.2fr]">
          <div className="overflow-hidden rounded-[2rem] bg-[#eaf4e5]">
            {familyImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={familyImage} alt={family.mainImage?.altText || family.name || "Plant family"} className="h-full min-h-80 w-full object-cover" />
            ) : <div className="image-placeholder min-h-80">Family photo coming soon</div>}
          </div>
          <div className="self-center py-4">
            <p className="eyebrow">Plant family</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-5xl text-[#0A3D27]">{family.name}</h1>
            {plainText(family.mustKnow) ? <RichHtml content={family.mustKnow ?? ""} className="mt-5 text-lg" /> : <p className="mt-5 text-lg leading-8 text-[#557064]">Care guidance is coming soon.</p>}
          </div>
        </section>
        <section className="pb-12">
          <h2 className="mb-5 text-2xl font-bold text-[#153f2f]">Plants in this family</h2>
          {plants.data.length ? <div className="catalog-grid">{plants.data.map((plant) => <PlantCard key={plant.id} plant={plant} returnTo={`/families/${family.slug}`} />)}</div> : <EmptyState title="No public plants in this family" description="Check back as the catalog grows." />}
        </section>
    </StoreShell>
  );
}
