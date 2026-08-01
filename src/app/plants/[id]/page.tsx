import Link from "next/link";
import { ArrowLeft, Droplets, Leaf, MapPin, Sprout, Sun, ThermometerSun } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import { ErrorState } from "@/app/components/common/async-state";
import { PlantsService } from "@/utils/services/plants/plants-service";
import { errorMessage, plainText } from "@/lib/text";
import PlantCareInformation from "@/app/components/plants/plant-care-information";

export const dynamic = "force-dynamic";

export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [plant, images] = await Promise.all([
      PlantsService.getById(id),
      PlantsService.getImages(id).catch(() => []),
    ]);
    const primaryImage = images.find((image) => image.isPrimary) ?? images[0];
    const image = primaryImage?.url || plant.url || plant.thumbnailUrl;
    const traits = [
      { label: "Light", value: plant.lightRequirement, icon: Sun },
      { label: "Water", value: plant.wateringFrequency, icon: Droplets },
      { label: "Temperature", value: plant.temperature, icon: ThermometerSun },
      { label: "Climate", value: plant.climate, icon: MapPin },
      { label: "Soil", value: plant.soilType, icon: Sprout },
      { label: "Habit", value: plant.plantHabit, icon: Leaf },
    ].filter((trait) => trait.value);

    return (
      <StoreShell>
        <div className="py-6">
          <Link href="/plants" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58] hover:text-[#0A3D27]">
            <ArrowLeft className="h-4 w-4" /> Back to plants
          </Link>
        </div>
        <section className="grid gap-8 pb-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="overflow-hidden rounded-[2rem] bg-[#eaf4e5] lg:sticky lg:top-24 lg:h-fit">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={primaryImage?.altText || plant.altText || plant.name || "Plant"} className="aspect-square w-full object-cover" />
            ) : (
              <div className="image-placeholder aspect-square">Plant photo coming soon</div>
            )}
          </div>
          <div className="py-3">
            <p className="eyebrow">{plant.family?.name || "Plant profile"}</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl leading-tight text-[#0A3D27] md:text-6xl">
              {plant.name || "Unnamed plant"}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#557064]">
              {plainText(plant.description) || "Care details for this plant are being prepared."}
            </p>
            {traits.length ? (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {traits.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="detail-panel flex items-center gap-3 !p-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e4f4dc] text-[#12613f]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#71877c]">{label}</p>
                      <p className="font-bold text-[#153f2f]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/gardens?plantId=${plant.id}`} className="auth-button auth-button-primary">Add to my garden</Link>
              {plant.familyId ? <Link href={`/families/${plant.familyId}`} className="auth-button auth-button-secondary">Explore its family</Link> : null}
            </div>
          </div>
        </section>
        <PlantCareInformation plantId={plant.id} />
      </StoreShell>
    );
  } catch (error) {
    return <StoreShell><div className="py-14"><ErrorState message={errorMessage(error)} /></div></StoreShell>;
  }
}
