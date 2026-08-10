import ProtectedContent from "@/app/components/common/protected-content";
import StoreShell from "@/app/components/layout/store-shell";
import GardenPlantDetailClient from "./garden-plant-detail-client";

export const dynamic = "force-dynamic";

export default async function GardenPlantDetailPage({
  params,
}: {
  params: Promise<{ id: string; gardenPlantId: string }>;
}) {
  const { id, gardenPlantId } = await params;

  return (
    <StoreShell>
      <ProtectedContent>
        <GardenPlantDetailClient gardenId={id} gardenPlantId={gardenPlantId} />
      </ProtectedContent>
    </StoreShell>
  );
}
