import { apiClient } from "@/lib/axios";
import type { DataResponse, Plant, PlantImage } from "@/models/api";
import { createDataQuery } from "@/utils/services/data-query";

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

  public static async getImages(id: string): Promise<PlantImage[]> {
    const response = await apiClient.get<PlantImage[]>(`${this.baseUrl}/${id}/images`);
    return response.data;
  }
}
