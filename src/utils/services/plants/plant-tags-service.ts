import { apiClient } from "@/lib/axios";
import type { Plant } from "@/models/plants/plant";
import type { Tag } from "@/models/plants/tag";

export class PlantTagsService {
  private static readonly baseUrl = "/ns-plants/api/tags";

  public static async getTagsByPlant(plantId: string): Promise<Tag[]> {
    const response = await apiClient.get<Tag[]>(`/ns-plants/api/plants/${plantId}/tags`);
    return response.data;
  }

  public static async getPlantsByTag(id: string): Promise<Plant[]> {
    const response = await apiClient.get<Plant[]>(`${this.baseUrl}/${id}/plants`);
    return response.data;
  }
}
