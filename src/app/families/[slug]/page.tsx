import Link from "next/link";
import { ArrowLeft, LayoutGrid, Table2 } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import PlantCard from "@/app/components/common/plant-card";
import { ErrorState, EmptyState } from "@/app/components/common/async-state";
import { FamiliesService } from "@/utils/services/plants/families-service";
import { FamilyPlantsService } from "@/utils/services/plants/family-plants-service";
import { plainText } from "@/lib/text";
import RichHtml from "@/app/components/common/rich-html";
import { loadResult } from "@/lib/result";
import { isGuid } from "@/utils/helpers/entity-key";
import { FamilyImagesService } from "@/utils/services/plants/family-images-service";
import CatalogImageGallery from "@/app/components/common/catalog-image-gallery";
import PlantComparisonTable from "@/app/components/plants/plant-comparison-table";

export const dynamic = "force-dynamic";

export default async function FamilyPage({ params, searchParams }: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { slug } = await params;
  const { view } = await searchParams;
  const tableView = view === "table";
  const familyResult = await loadResult(
    isGuid(slug) ? FamiliesService.getById(slug) : FamiliesService.getBySlug(slug),
  );
  if (familyResult.data === null) {
    return <StoreShell><div className="py-14"><ErrorState message={familyResult.error} /></div></StoreShell>;
  }
  const family = familyResult.data;
  const [result, familyImages] = await Promise.all([
    loadResult(FamilyPlantsService.getAll(family.id, 1, 60)),
    FamilyImagesService.getAll(family.id).catch(() => []),
  ]);
  if (result.data === null) {
    return <StoreShell><div className="py-14"><ErrorState message={result.error} /></div></StoreShell>;
  }
  const plants = result.data;
  const familyPath = `/families/${encodeURIComponent(family.slug || slug)}`;
  const returnTo = tableView ? `${familyPath}?view=table` : familyPath;
  return (
    <StoreShell>
        <div className="py-6"><Link href="/families" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]"><ArrowLeft className="h-4 w-4" /> Back to families</Link></div>
        <section className="grid gap-8 pb-10 lg:grid-cols-[.8fr_1.2fr]">
          <CatalogImageGallery
            images={familyImages}
            subjectName={family.name || "Plant family"}
            fallbackUrl={family.mainImage?.url || family.mainImage?.thumbnailUrl}
            fallbackAlt={family.mainImage?.altText}
            placeholderLabel="Family photo coming soon"
            chooserLabel="Choose a family image"
          />
          <div className="self-center py-4">
            <p className="eyebrow">Plant family</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-5xl text-[#0A3D27]">{family.name}</h1>
            {plainText(family.mustKnow) ? <RichHtml content={family.mustKnow ?? ""} className="mt-5 text-lg" /> : <p className="mt-5 text-lg leading-8 text-[#557064]">Care guidance is coming soon.</p>}
          </div>
        </section>
        <section className="pb-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#153f2f]">Plants in this family</h2>
            {plants.data.length > 0 ? (
              <nav aria-label="Plant display" className="inline-flex gap-1 rounded-full border border-emerald-950/15 bg-[#eef8e9] p-1">
                {[
                  { label: "Cards", href: familyPath, selected: !tableView, Icon: LayoutGrid },
                  { label: "Table", href: `${familyPath}?view=table`, selected: tableView, Icon: Table2 },
                ].map(({ label, href, selected, Icon }) => (
                  <Link key={label} href={href} scroll={false} aria-current={selected ? "page" : undefined} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${selected ? "bg-[#0A3D27] text-white" : "text-[#456756] hover:bg-[#dff2d7]"}`}>
                    <Icon aria-hidden="true" className="h-4 w-4" />{label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
          {plants.data.length ? (
            tableView ? <PlantComparisonTable plants={plants.data} returnTo={returnTo} />
              : <div className="catalog-grid">{plants.data.map((plant) => <PlantCard key={plant.id} plant={plant} returnTo={returnTo} />)}</div>
          ) : <EmptyState title="No public plants in this family" description="Check back as the catalog grows." />}
        </section>
    </StoreShell>
  );
}
