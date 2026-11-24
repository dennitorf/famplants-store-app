import { apiBaseUrl } from "@/lib/config";
import { getFamPlantsApiAccessToken } from "@/lib/auth/access-token";
import type { NotificationPreferences } from "@/models/users/notification-preferences";

export class NotificationPreferencesApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "NotificationPreferencesApiError";
  }
}

export class NotificationPreferencesService {
  private static readonly endpoint = `${apiBaseUrl}/ns-users/api/users/me/notification-preferences`;

  static async get(): Promise<NotificationPreferences> {
    return this.request("GET");
  }

  static async update(value: NotificationPreferences): Promise<NotificationPreferences> {
    return this.request("PUT", value);
  }

  private static async request(
    method: "GET" | "PUT",
    body?: NotificationPreferences,
  ): Promise<NotificationPreferences> {
    const token = await getFamPlantsApiAccessToken();
    const response = await fetch(this.endpoint, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    if (!response.ok) {
      const message = await response.text();
      throw new NotificationPreferencesApiError(
        response.status,
        message || "Notification preferences could not be updated.",
      );
    }
    return await response.json() as NotificationPreferences;
  }
}
