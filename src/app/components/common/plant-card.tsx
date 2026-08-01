import Link from "next/link";
import { ArrowUpRight, Droplets, Sun } from "lucide-react";
import type { Plant } from "@/models/api";

export default function PlantCard({ plant }: { plant: Plant }) {
  const image = plant.thumbnailUrl || plant.url;

  return (
    <article className="catalog-card group">
      <Link href={`/plants/${plant.id}`} className="block">
        <div className="catalog-image">
          {image ? (
            // API media can come from multiple storage providers.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={plant.altText || plant.name || "Plant"} />
          ) : (
            <div className="image-placeholder">Plant photo coming soon</div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">{plant.family?.name || "Plant"}</p>
              <h2 className="mt-1 text-xl font-bold text-[#153f2f]">{plant.name || "Unnamed plant"}</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#4d725f] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-[#4d725f]">
            {plant.lightRequirement ? (
              <span className="trait-pill"><Sun className="h-3.5 w-3.5" />{plant.lightRequirement}</span>
            ) : null}
            {plant.wateringFrequency ? (
              <span className="trait-pill"><Droplets className="h-3.5 w-3.5" />{plant.wateringFrequency}</span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
