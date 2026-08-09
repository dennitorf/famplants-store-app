import { apiClient } from "@/lib/axios";
import type { GardenPlantPhoto } from "@/models/gardens/garden-plant-photo";

export class GardenPlantPhotosService {
  private static url(gardenId: string, gardenPlantId: string): string {
    return `/ns-gardens/api/gardens/${gardenId}/plants/${gardenPlantId}/photos`;
  }

  public static async getAll(gardenId: string, gardenPlantId: string): Promise<GardenPlantPhoto[]> {
    const response = await apiClient.get<GardenPlantPhoto[]>(this.url(gardenId, gardenPlantId));
    return response.data;
  }

  public static async create(
    gardenId: string,
    gardenPlantId: string,
    file: File,
    caption: string,
  ): Promise<GardenPlantPhoto> {
    const form = new FormData();
    form.append("File", file);
    form.append("Caption", caption);
    form.append("AltText", caption || "Garden plant photo");
    form.append("CapturedDate", new Date().toISOString());
    const response = await apiClient.post<GardenPlantPhoto>(this.url(gardenId, gardenPlantId), form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  public static async delete(gardenId: string, gardenPlantId: string, photoId: string): Promise<void> {
    await apiClient.delete(`${this.url(gardenId, gardenPlantId)}/${photoId}`);
  }
}
