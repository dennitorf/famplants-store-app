import ProtectedContent from "@/app/components/common/protected-content";
import StoreShell from "@/app/components/layout/store-shell";
import { auth0 } from "@/lib/auth0";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import GardenPlantDetailClient from "./garden-plant-detail-client";

export const dynamic = "force-dynamic";

export default async function GardenPlantDetailPage({
  params,
}: {
  params: Promise<{ id: string; gardenPlantId: string }>;
}) {
  const { id, gardenPlantId } = await params;
  const session = await auth0.getSession();
  if (session?.user) await ensureCurrentUser();

  return (
    <StoreShell>
      <ProtectedContent>
        <GardenPlantDetailClient gardenId={id} gardenPlantId={gardenPlantId} />
      </ProtectedContent>
    </StoreShell>
  );
}
