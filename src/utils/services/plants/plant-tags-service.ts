import { apiClient } from "@/lib/axios";
import type { DataResponse, Plant, Tag } from "@/models/api";
import { createDataQuery } from "@/utils/services/data-query";

export class PlantTagsService {
  private static readonly baseUrl = "/ns-plants/api/tags";

  public static async getAll(page = 1, pageSize = 60): Promise<DataResponse<Tag>> {
    const response = await apiClient.get<DataResponse<Tag>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<Tag> {
    const response = await apiClient.get<Tag>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async getPlantsByTag(id: string): Promise<Plant[]> {
    const response = await apiClient.get<Plant[]>(`${this.baseUrl}/${id}/plants`);
    return response.data;
  }
}
