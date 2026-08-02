import { apiClient } from "@/lib/axios";
import axios from "axios";
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

  public static async getBySlug(slug: string): Promise<PlantCollection> {
    try {
      const response = await apiClient.get<PlantCollection>(
        `${this.baseUrl}/by-slug/${encodeURIComponent(slug)}`,
      );
      return response.data;
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 404) {
        throw error;
      }

      const collections = await this.getAll(1, 1000);
      const collection = collections.data.find(
        (item) => item.slug?.toLowerCase() === slug.toLowerCase(),
      );
      if (!collection) {
        throw error;
      }

      return this.getById(collection.id);
    }
  }
}
