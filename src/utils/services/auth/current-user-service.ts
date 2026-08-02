import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import type { FamPlantsUserDto } from "@/models/users/user";
import { getFamPlantsApiAccessToken } from "@/lib/auth/access-token";
import { apiBaseUrl } from "@/lib/config";

export const ensureCurrentUser = cache(async (): Promise<FamPlantsUserDto | null> => {
  const session = await auth0.getSession();
  if (!session?.user) {
    return null;
  }

  const authProviderUserId = session.user.sub ?? session.user.email ?? "";
  const [nameFirst, ...nameLast] = (session.user.name ?? "").split(" ");
  const accessToken = await getFamPlantsApiAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const lookup = await fetch(
    `${apiBaseUrl}/ns-users/api/users/by-auth-provider-user-id?authProviderUserId=${encodeURIComponent(authProviderUserId)}`,
    { headers, cache: "no-store" },
  );

  if (lookup.ok) {
    return (await lookup.json()) as FamPlantsUserDto;
  }
  if (lookup.status !== 404) {
    throw new Error(`Failed to lookup current user: ${lookup.status}`);
  }

  const create = await fetch(`${apiBaseUrl}/ns-users/api/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: session.user.email ?? "",
      firstName: session.user.given_name ?? nameFirst ?? "",
      lastName: session.user.family_name ?? nameLast.join(" "),
      authProvider: "auth0",
      authProviderUserId,
    }),
  });
  if (!create.ok) {
    throw new Error(`Failed to register current user: ${create.status}`);
  }
  return (await create.json()) as FamPlantsUserDto;
});
