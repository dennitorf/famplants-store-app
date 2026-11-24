import { NextResponse } from "next/server";
import type { NotificationPreferences } from "@/models/users/notification-preferences";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import {
  NotificationPreferencesApiError,
  NotificationPreferencesService,
} from "@/utils/services/users/notification-preferences-service";

export async function GET() {
  try {
    if (!await ensureCurrentUser()) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    return NextResponse.json(await NotificationPreferencesService.get());
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request: Request) {
  try {
    if (!await ensureCurrentUser()) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    const body = await request.json() as NotificationPreferences;
    return NextResponse.json(await NotificationPreferencesService.update(body));
  } catch (error) {
    return failure(error);
  }
}

function failure(error: unknown) {
  const status = error instanceof NotificationPreferencesApiError ? error.status : 400;
  const message = status === 409
    ? "Your notification settings changed elsewhere. Reload and try again."
    : "Notification preferences could not be saved.";
  return NextResponse.json({ message }, { status });
}
