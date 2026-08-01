import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requiresReauthentication } from "@/lib/auth/reauthentication";
import { auth0, auth0Audience } from "@/lib/auth0";

export async function proxy(request: NextRequest) {
  const response = await auth0.middleware(request);

  if (!requiresFamPlantsAccessToken(request.nextUrl.pathname)) {
    return response;
  }

  const session = await auth0.getSession(request);
  if (!session?.user) {
    return response;
  }

  try {
    await auth0.getAccessToken(request, response, {
      audience: auth0Audience,
    });
    return response;
  } catch (error) {
    if (!requiresReauthentication(error)) {
      throw error;
    }

    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set(
      "returnTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
    loginUrl.searchParams.set("prompt", "login");
    return NextResponse.redirect(loginUrl);
  }
}

function requiresFamPlantsAccessToken(pathname: string): boolean {
  return pathname === "/profile"
    || pathname.startsWith("/gardens")
    || pathname.startsWith("/checkout")
    || pathname.startsWith("/orders")
    || pathname.startsWith("/api/orders");
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
