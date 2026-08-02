import Link from "next/link";
import FamilyCard from "@/app/components/common/family-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import type { Family } from "@/models/plants/family";

interface PlantCategoryShopProps {
  families: Family[];
  error?: string;
}

export default function PlantCategoryShop({ families, error }: PlantCategoryShopProps) {
  return (
    <section className="py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Plant families</p>
          <h2 className="mt-1 text-3xl font-bold text-foreground">Explore families</h2>
        </div>
        <Link href="/families" className="text-sm font-bold text-[#12613f] hover:underline">
          View all families
        </Link>
      </div>
      {error ? (
        <ErrorState message={error} />
      ) : families.length ? (
        <div className="catalog-grid">
          {families.map((family) => <FamilyCard key={family.id} family={family} />)}
        </div>
      ) : (
        <EmptyState title="No families yet" description="Published plant families will appear here." />
      )}
    </section>
  );
}
