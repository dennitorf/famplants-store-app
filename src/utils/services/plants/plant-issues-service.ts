import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { PlantIssue } from "@/models/plants/plant-issue";
import { createDataQuery } from "@/utils/helpers/data-query";

export class PlantIssuesService {
  private static readonly plantsBaseUrl = "/ns-plants/api/plants";

  public static async getAll(
    plantId: string,
    page = 1,
    pageSize = 100,
  ): Promise<DataResponse<PlantIssue>> {
    const response = await apiClient.get<DataResponse<PlantIssue>>(
      `${this.plantsBaseUrl}/${plantId}/issues?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }
}
