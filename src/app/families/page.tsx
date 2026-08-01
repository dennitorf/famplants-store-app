import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import { FamiliesService } from "@/utils/services/plants/families-service";
import { plainText } from "@/lib/text";
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
            {response.data.map((family) => (
              <article key={family.id} className="catalog-card group">
                <Link href={`/families/${family.id}`}>
                  <div className="catalog-image">
                    {family.thumbnailUrl || family.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={family.thumbnailUrl || family.url} alt={family.altText || family.name || "Plant family"} />
                    ) : <div className="image-placeholder">Family photo coming soon</div>}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-[#153f2f]">{family.name || "Unnamed family"}</h2>
                      <ArrowUpRight className="h-5 w-5 text-[#4d725f]" />
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#637b70]">{plainText(family.mustKnow) || "Explore the plants in this family."}</p>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        ) : <EmptyState title="No families yet" description="Published families will appear here." />}
    </StoreShell>
  );
}
