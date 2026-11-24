import Link from "next/link";
import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import { ErrorState } from "@/app/components/common/async-state";
import PlantCareInformation from "@/app/components/plants/plant-care-information";
import ShareButton from "@/app/components/share/share-button";
import { PlantsService } from "@/utils/services/plants/plants-service";

export const dynamic = "force-dynamic";

export default async function PlantCarePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let plant;
  try {
    plant = await PlantsService.getBySlug(slug);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    return <StoreShell><div className="py-12"><ErrorState message="This plant could not be loaded. Please try again shortly." /></div></StoreShell>;
  }
  if (!plant) notFound();

  return (
    <StoreShell>
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <Link href="/plant-care" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to care guides</Link>
        <ShareButton label={`Share ${plant.name || "plant"} care guide`} />
      </div>
      <PageHero eyebrow="Plant care" title={plant.name || "Plant care guide"} description="Explore care guides and recommendations for your plant." />
      <div className="pb-12"><PlantCareInformation key={plant.id} plantId={plant.id} /></div>
    </StoreShell>
  );
}
