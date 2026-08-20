import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import type { FamPlantsUserDto } from "@/models/users/user";
import { getFamPlantsApiAccessToken } from "@/lib/auth/access-token";
import { synchronizeCurrentUser } from "@/utils/services/auth/synchronize-current-user";

export const ensureCurrentUser = cache(async (): Promise<FamPlantsUserDto | null> => {
  const session = await auth0.getSession();
  if (!session?.user) {
    return null;
  }

  const accessToken = await getFamPlantsApiAccessToken();
  return synchronizeCurrentUser(accessToken, session.user);
});
