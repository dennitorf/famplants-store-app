import type { FamPlantsUserDto } from "@/models/users/user";
import { apiBaseUrl } from "@/lib/config";

type AuthenticatedProfile = {
  sub?: string;
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
};

export async function synchronizeCurrentUser(
  accessToken: string,
  profile: AuthenticatedProfile,
): Promise<FamPlantsUserDto> {
  const email = profile.email?.trim() ?? "";
  const displayNameParts = (profile.name ?? "").trim().split(/\s+/).filter(Boolean);
  const firstName = profile.given_name?.trim() || displayNameParts[0] || "FamPlants";
  const lastName =
    profile.family_name?.trim() || displayNameParts.slice(1).join(" ") || "User";

  if (!profile.sub?.trim()) {
    throw new Error("The authenticated profile does not contain a subject.");
  }
  if (!email) {
    throw new Error("The authenticated profile does not contain an email address.");
  }

  const response = await fetch(`${apiBaseUrl}/ns-users/api/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, firstName, lastName }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to synchronize current user: ${response.status}`);
  }

  return (await response.json()) as FamPlantsUserDto;
}
