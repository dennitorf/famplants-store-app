import Link from "next/link";
import { ArrowLeft, Droplets, Leaf, MapPin, Sprout, Sun, ThermometerSun } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import { ErrorState } from "@/app/components/common/async-state";
import { PlantsService } from "@/utils/services/plants/plants-service";
import { PlantImagesService } from "@/utils/services/plants/plant-images-service";
import { PlantIssuesService } from "@/utils/services/plants/plant-issues-service";
import { PlantTagsService } from "@/utils/services/plants/plant-tags-service";
import { errorMessage, plainText } from "@/lib/text";
import { loadResult } from "@/lib/result";
import PlantCareInformation from "@/app/components/plants/plant-care-information";
import PlantCommonIssues from "@/app/components/plants/plant-common-issues";
import PlantDetailTabs from "@/app/components/plants/plant-detail-tabs";
import PlantImageGallery from "@/app/components/plants/plant-image-gallery";
import TagIcon from "@/app/components/plants/tag-icon";
import ShareButton from "@/app/components/share/share-button";
import { isGuid } from "@/utils/helpers/entity-key";

export const dynamic = "force-dynamic";

interface PlantDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}

function getReturnDestination(returnTo?: string): string {
  return returnTo?.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : "/plants";
}

function getReturnLabel(returnTo: string): string {
  if (returnTo.startsWith("/collections/")) return "Back to collection";
  if (returnTo.startsWith("/families/")) return "Back to family";
  if (returnTo === "/home") return "Back to home";
  return "Back to plants";
}

export default async function PlantDetailPage({ params, searchParams }: PlantDetailPageProps) {
  const { slug } = await params;
  const { returnTo } = await searchParams;
  const returnDestination = getReturnDestination(returnTo);

  try {
    const plant = isGuid(slug)
      ? await PlantsService.getById(slug)
      : await PlantsService.getBySlug(slug);
    const [images, tags, issuesResult] = await Promise.all([
      PlantImagesService.getAll(plant.id).catch(() => []),
      PlantTagsService.getTagsByPlant(plant.id).catch(() => []),
      loadResult(PlantIssuesService.getAll(plant.id)),
    ]);
    const orderedTags = [...tags].sort((left, right) => left.order - right.order);
    const issues = issuesResult.data?.data ?? [];
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
        <div className="flex flex-wrap items-center justify-between gap-3 py-6">
          <Link href={returnDestination} className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58] hover:text-[#0A3D27]">
            <ArrowLeft className="h-4 w-4" /> {getReturnLabel(returnDestination)}
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Link href={`/gardens?plantId=${plant.id}`} className="auth-button auth-button-primary">Add to my garden</Link>
            {plant.family?.slug ? <Link href={`/families/${plant.family.slug}`} className="auth-button auth-button-secondary">Explore its family</Link> : null}
            <ShareButton
              label={`Share ${plant.name || "plant"}`}
              path={`/plants/${plant.slug}`}
              className="size-10 rounded-full border-emerald-950/15 text-[#0A3D27]"
            />
          </div>
        </div>
        <section className="grid gap-8 pb-12 lg:grid-cols-[1.05fr_.95fr]">
          <PlantImageGallery
            images={images}
            plantName={plant.name || "Plant"}
            fallbackUrl={plant.mainImage?.url || plant.mainImage?.thumbnailUrl || plant.url || plant.thumbnailUrl}
            fallbackAlt={plant.mainImage?.altText || plant.altText}
          />
          <div className="py-3">
            <p className="eyebrow">{plant.family?.name || "Plant profile"}</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl leading-tight text-[#0A3D27] md:text-6xl">
              {plant.name || "Unnamed plant"}
            </h1>
            {orderedTags.length ? (
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Plant tags">
                {orderedTags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/plants/tags/${encodeURIComponent(tag.slug)}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#eef8e9] px-3 py-1.5 text-xs font-bold text-[#37634f] transition-colors hover:bg-[#dff2d7]"
                  >
                    <TagIcon icon={tag.icon} className="h-3.5 w-3.5" />
                    {tag.name || "Plant tag"}
                  </Link>
                ))}
              </div>
            ) : null}
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
          </div>
        </section>
        <PlantDetailTabs
          issueCount={issues.length}
          careInformation={<PlantCareInformation plantId={plant.id} />}
          commonIssues={<PlantCommonIssues issues={issues} error={issuesResult.error ?? undefined} />}
        />
      </StoreShell>
    );
  } catch (error) {
    return <StoreShell><div className="py-14"><ErrorState message={errorMessage(error)} /></div></StoreShell>;
  }
}
