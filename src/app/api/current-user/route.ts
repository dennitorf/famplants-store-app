import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { requiresReauthentication } from "@/lib/auth/reauthentication";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await ensureCurrentUser();
    return NextResponse.json(user, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Failed to synchronize the current user", error);
    return NextResponse.json(
      {
        message: "Failed to synchronize the current user",
        reauthenticationRequired: requiresReauthentication(error),
      },
      { status: requiresReauthentication(error) ? 401 : 500 },
    );
  }
}
