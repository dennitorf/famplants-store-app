import { apiClient } from "@/lib/axios";
import type { PlantImage } from "@/models/plants/plant-image";

export class PlantImagesService {
  private static readonly baseUrl = "/ns-plants/api/plants";

  public static async getAll(plantId: string): Promise<PlantImage[]> {
    const response = await apiClient.get<PlantImage[]>(`${this.baseUrl}/${plantId}/images`);
    return response.data;
  }
}
