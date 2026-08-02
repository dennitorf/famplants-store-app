import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { Plant } from "@/models/plants/plant";
import { createDataQuery } from "@/utils/helpers/data-query";

export class PlantsService {
  private static readonly baseUrl = "/ns-plants/api/plants";

  public static async getAll(page = 1, pageSize = 24): Promise<DataResponse<Plant>> {
    const response = await apiClient.get<DataResponse<Plant>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<Plant> {
    const response = await apiClient.get<Plant>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async getBySlug(slug: string): Promise<Plant> {
    const response = await apiClient.get<Plant>(
      `${this.baseUrl}/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data;
  }
}
