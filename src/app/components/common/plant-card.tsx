import Link from "next/link";
import { ArrowUpRight, Droplets, Sun } from "lucide-react";
import type { Plant } from "@/models/plants/plant";
import CatalogImage from "@/app/components/common/catalog-image";
import { getCardImageUrl } from "@/utils/helpers/image-catalog";
import { PlantImagesService } from "@/utils/services/plants/plant-images-service";

interface PlantCardProps {
  plant: Plant;
  returnTo?: string;
}

export default async function PlantCard({ plant, returnTo = "/plants" }: PlantCardProps) {
  const imageCatalog = await PlantImagesService.getAll(plant.id).catch(() => []);
  const primaryImage = imageCatalog.find((image) => image.isPrimary) ?? imageCatalog[0];
  const image = getCardImageUrl(primaryImage)
    || plant.mainImage?.thumbnailUrl
    || plant.mainImage?.url
    || plant.thumbnailUrl
    || plant.url;
  const imageAlt = plant.mainImage?.altText || plant.altText || plant.name || "Plant";

  return (
    <article className="catalog-card group">
      <Link
        href={`/plants/${plant.slug}?returnTo=${encodeURIComponent(returnTo)}`}
        className="block"
      >
        <div className="catalog-image">
          <CatalogImage
            src={image}
            alt={imageAlt}
            placeholderLabel="Plant photo coming soon"
          />
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
