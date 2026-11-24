export interface NotificationPreference {
  notificationTypeCode: "CARE-REMINDER" | "CARE-OVERDUE";
  notificationChannelCode: "PUSH-NOTIFICATION";
  isEnabled: boolean;
}

export interface NotificationPreferences {
  areNotificationsEnabled: boolean;
  timeZoneId: string;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  version: number;
  preferences: NotificationPreference[];
}
