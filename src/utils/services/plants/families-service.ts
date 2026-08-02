import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { Family } from "@/models/plants/family";
import { createDataQuery } from "@/utils/helpers/data-query";

export class FamiliesService {
  private static readonly baseUrl = "/ns-plants/api/families";

  public static async getAll(page = 1, pageSize = 24): Promise<DataResponse<Family>> {
    const response = await apiClient.get<DataResponse<Family>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<Family> {
    const response = await apiClient.get<Family>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}
