import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { getFamPlantsApiAccessToken } from "@/lib/auth/access-token";

export async function GET() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = await getFamPlantsApiAccessToken();
    return NextResponse.json(
      { accessToken },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to get the FamPlants API access token", error);
    return NextResponse.json(
      { message: "Failed to get the FamPlants API access token" },
      { status: 500 },
    );
  }
}
