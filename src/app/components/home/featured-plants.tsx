import Link from "next/link";
import PlantCard from "@/app/components/common/plant-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import type { Plant } from "@/models/api";

interface FeaturedPlantsProps {
  plants: Plant[];
  error?: string;
}

export default function FeaturedPlants({ plants, error }: FeaturedPlantsProps) {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Plant library</p>
          <h2 className="mt-1 text-3xl font-bold text-foreground">Discover plants</h2>
        </div>
        <Link href="/plants" className="text-sm font-bold text-[#12613f] hover:underline">
          View all plants
        </Link>
      </div>
      {error ? (
        <ErrorState message={error} />
      ) : plants.length ? (
        <div className="catalog-grid">
          {plants.map((plant) => <PlantCard key={plant.id} plant={plant} />)}
        </div>
      ) : (
        <EmptyState title="No public plants yet" description="Published plants will appear here." />
      )}
    </section>
  );
}
