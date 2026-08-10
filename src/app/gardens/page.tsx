import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import ProtectedContent from "@/app/components/common/protected-content";
import GardensClient from "./gardens-client";

export const dynamic = "force-dynamic";

export default async function GardensPage() {
  return (
    <StoreShell>
      <PageHero eyebrow="Your growing space" title="Every garden has a story." description="Organize your plants by space, track what is growing where, and build a living collection that feels like home." />
      <ProtectedContent><GardensClient /></ProtectedContent>
    </StoreShell>
  );
}
