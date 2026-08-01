import { auth0, auth0Audience } from "@/lib/auth0";

export async function getFamPlantsApiAccessToken(): Promise<string> {
  const tokenResponse = await auth0.getAccessToken({ audience: auth0Audience });
  const accessToken = tokenResponse.token?.trim();

  if (!accessToken) {
    throw new Error("Auth0 did not return an access token for the FamPlants API audience.");
  }

  return accessToken;
}
