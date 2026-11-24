import Link from "next/link";
import type { Plant } from "@/models/plants/plant";
import { plainText } from "@/lib/text";
import { PlantImagesService } from "@/utils/services/plants/plant-images-service";
import { getThumbnailImageUrl } from "@/utils/helpers/image-catalog";
import PlantTableThumbnail from "./plant-table-thumbnail";

const attributes = [
  ["lightRequirement", "Light"],
  ["wateringFrequency", "Watering"],
  ["sizeCategory", "Size"],
  ["temperature", "Temperature"],
  ["climate", "Climate"],
  ["soilType", "Soil"],
  ["substrateType", "Substrate"],
  ["plantHabit", "Growth habit"],
  ["plantUse", "Uses"],
  ["bloomingSeason", "Blooming seasons"],
  ["bloomingFrequency", "Blooming frequency"],
  ["flowerColor", "Flower colors"],
  ["flowerType", "Flower type"],
  ["leafColor", "Leaf colors"],
  ["leafType", "Leaf type"],
] as const satisfies ReadonlyArray<readonly [keyof Plant, string]>;

export default async function PlantComparisonTable({ plants, returnTo }: { plants: Plant[]; returnTo: string }) {
  const images = new Map(await Promise.all(plants.map(async (plant) => {
    const catalog = await PlantImagesService.getAll(plant.id).catch(() => []);
    const primary = catalog.find((image) => image.isPrimary) ?? catalog[0];
    return [plant.id, getThumbnailImageUrl(primary)
      || plant.mainImage?.thumbnailUrl || plant.mainImage?.url
      || plant.thumbnailUrl || plant.url] as const;
  })));
  // Omit attributes absent across the entire family, but make individual gaps explicit.
  const columns = attributes.filter(([key]) => plants.some((plant) => plainText(plant[key])));

  return (
    <div>
      <p className="mb-3 text-sm text-[#557064]">
        {columns.length
          ? "Compare growing needs and characteristics. Scroll across to see all attributes. Not provided means this detail is not available yet."
          : "Comparison attributes are not available for these plants yet. Select a plant to view its details."}
      </p>
      <div role="region" aria-label="Plant comparison table" tabIndex={0} className="max-h-[70vh] overflow-auto rounded-2xl border border-emerald-950/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#256044]">
        <table className="w-full border-separate border-spacing-0 text-left text-sm">
          <caption className="sr-only">Plants in this family and their growing attributes</caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 top-0 z-30 min-w-44 border-b border-r border-emerald-950/10 bg-[#eaf6e5] p-4 font-bold text-[#153f2f]">Plant</th>
              {columns.map(([key, label]) => (
                <th key={key} scope="col" className="sticky top-0 z-20 min-w-40 border-b border-emerald-950/10 bg-[#eaf6e5] p-4 font-bold text-[#153f2f]">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plants.map((plant, index) => (
              <tr key={plant.id} className={index % 2 ? "bg-[#f5faf2]" : "bg-white"}>
                <th scope="row" className={`sticky left-0 z-10 max-w-60 border-b border-r border-emerald-950/10 p-4 align-top font-bold ${index % 2 ? "bg-[#f5faf2]" : "bg-white"}`}>
                  <Link href={`/plants/${encodeURIComponent(plant.slug)}?returnTo=${encodeURIComponent(returnTo)}`} className="flex items-center gap-3 text-[#0A3D27] underline decoration-[#0A3D27]/25 underline-offset-4 hover:decoration-[#0A3D27]">
                    <PlantTableThumbnail src={images.get(plant.id)} alt={plant.mainImage?.altText || plant.altText || plant.name || "Plant"} />
                    <span>{plant.name || "Unnamed plant"}</span>
                  </Link>
                </th>
                {columns.map(([key]) => (
                  <td key={key} className="border-b border-emerald-950/10 p-4 align-top text-[#456756]">
                    {plainText(plant[key]) || <span className="text-[#70857b]">Not provided</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
