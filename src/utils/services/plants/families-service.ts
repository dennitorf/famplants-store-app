import { apiClient } from "@/lib/axios";
import type { DataResponse, Family, Plant } from "@/models/api";
import { createDataQuery } from "@/utils/services/data-query";

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

  public static async getPlants(
    id: string,
    page = 1,
    pageSize = 24,
  ): Promise<DataResponse<Plant>> {
    const response = await apiClient.get<DataResponse<Plant>>(
      `${this.baseUrl}/${id}/plants?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }
}
