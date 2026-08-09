import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { CareReminder } from "@/models/gardens/care-reminder";

export class CareRemindersService {
  private static baseUrl(gardenId: string, gardenPlantId: string): string {
    return `/ns-gardens/api/gardens/${gardenId}/plants/${gardenPlantId}/care-reminders`;
  }

  public static async getUpcoming(gardenId: string, gardenPlantId: string): Promise<CareReminder[]> {
    const query = new URLSearchParams({
      Page: "1",
      PageSize: "100",
      FilterBy: "",
      Filter: "",
      OrderBy: "DueDate",
      Order: "asc",
    });
    const response = await apiClient.get<DataResponse<CareReminder>>(
      `${this.baseUrl(gardenId, gardenPlantId)}?${query}`,
    );

    return response.data.data
      .filter((reminder) => !reminder.isActed && !reminder.isCompleted)
      .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime());
  }

  public static async complete(
    gardenId: string,
    gardenPlantId: string,
    reminder: CareReminder,
  ): Promise<void> {
    await apiClient.put(`${this.baseUrl(gardenId, gardenPlantId)}/${reminder.id}`, {
      id: reminder.id,
      isActed: true,
      isCompleted: true,
      notes: reminder.notes ?? "",
    });
  }
}
