import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { PlantCollection } from "@/models/plants/collection";
import { createDataQuery } from "@/utils/helpers/data-query";

export class CollectionsService {
  private static readonly baseUrl = "/ns-plants/api/collections";

  public static async getAll(page = 1, pageSize = 60): Promise<DataResponse<PlantCollection>> {
    const response = await apiClient.get<DataResponse<PlantCollection>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<PlantCollection> {
    const response = await apiClient.get<PlantCollection>(`${this.baseUrl}/${id}`);
    return response.data;
  }
}
