import { apiClient } from "@/lib/axios";
import type { Garden } from "@/models/gardens/garden";
import type { SaveGardenRequest } from "@/models/gardens/save-garden-request";

export class GardensService {
  private static readonly baseUrl = "/ns-gardens/api/Gardens";

  public static async getAll(): Promise<Garden[]> {
    const response = await apiClient.get<Garden[]>(this.baseUrl);
    return response.data;
  }

  public static async getById(id: string): Promise<Garden> {
    const response = await apiClient.get<Garden>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async create(data: SaveGardenRequest): Promise<Garden> {
    const response = await apiClient.post<Garden>(this.baseUrl, data);
    return response.data;
  }

  public static async update(id: string, data: SaveGardenRequest): Promise<Garden> {
    const response = await apiClient.put<Garden>(`${this.baseUrl}/${id}`, { ...data, id });
    return response.data;
  }

  public static async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }
}
