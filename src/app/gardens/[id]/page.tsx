import StoreShell from "@/app/components/layout/store-shell";
import ProtectedContent from "@/app/components/common/protected-content";
import GardenDetailClient from "./garden-detail-client";

export const dynamic = "force-dynamic";

export default async function GardenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <StoreShell><ProtectedContent><GardenDetailClient gardenId={id} /></ProtectedContent></StoreShell>;
}
