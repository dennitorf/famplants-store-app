import { apiClient } from "@/lib/axios";
import type { GardenPlant } from "@/models/gardens/garden-plant";
import type { SaveGardenPlantRequest } from "@/models/gardens/save-garden-plant-request";

export class GardenPlantsService {
  private static readonly gardensBaseUrl = "/ns-gardens/api/Gardens";

  public static async getAll(gardenId: string): Promise<GardenPlant[]> {
    const response = await apiClient.get<GardenPlant[]>(`${this.gardensBaseUrl}/${gardenId}/plants`);
    return response.data;
  }

  public static async getById(gardenId: string, gardenPlantId: string): Promise<GardenPlant> {
    const response = await apiClient.get<GardenPlant>(
      `${this.gardensBaseUrl}/${gardenId}/plants/${gardenPlantId}`,
    );
    return response.data;
  }

  public static async create(gardenId: string, data: SaveGardenPlantRequest): Promise<GardenPlant> {
    const response = await apiClient.post<GardenPlant>(`${this.gardensBaseUrl}/${gardenId}/plants`, data);
    return response.data;
  }

  public static async update(
    gardenId: string,
    plantId: string,
    data: SaveGardenPlantRequest,
  ): Promise<GardenPlant> {
    const response = await apiClient.put<GardenPlant>(
      `${this.gardensBaseUrl}/${gardenId}/plants/${plantId}`,
      data,
    );
    return response.data;
  }

  public static async delete(gardenId: string, plantId: string): Promise<void> {
    await apiClient.delete(`${this.gardensBaseUrl}/${gardenId}/plants/${plantId}`);
  }
}
