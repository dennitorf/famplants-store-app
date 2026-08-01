import StoreShell from "@/app/components/layout/store-shell";
import ProtectedContent from "@/app/components/common/protected-content";
import GardenDetailClient from "./garden-detail-client";
import { auth0 } from "@/lib/auth0";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";

export const dynamic = "force-dynamic";

export default async function GardenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth0.getSession();
  if (session?.user) await ensureCurrentUser();

  return <StoreShell><ProtectedContent><GardenDetailClient gardenId={id} /></ProtectedContent></StoreShell>;
}
