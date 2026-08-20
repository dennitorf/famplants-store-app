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
  const endpoint = `${apiBaseUrl}/ns-users/api/users/me`;
  const headers = { Authorization: `Bearer ${accessToken}` };
  const existingResponse = await fetch(endpoint, {
    headers,
    cache: "no-store",
  });
  if (existingResponse.ok) {
    return (await existingResponse.json()) as FamPlantsUserDto;
  }
  if (existingResponse.status !== 404) {
    throw await synchronizationError(existingResponse, "load");
  }

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

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ email, firstName, lastName }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw await synchronizationError(response, "create");
  }

  return (await response.json()) as FamPlantsUserDto;
}

async function synchronizationError(response: Response, operation: string): Promise<Error> {
  const details = await response.text();
  return new Error(
    `Failed to ${operation} current user (${response.status})${details ? `: ${details}` : ""}`,
  );
}
