import { apiClient } from "@/lib/axios";
import type { GardenCover } from "@/models/gardens/garden-cover";

export class GardenCoversService {
  private static url(gardenId: string): string {
    return `/ns-gardens/api/gardens/${gardenId}/cover-photo`;
  }

  static async getCandidates(gardenId: string): Promise<GardenCover[]> {
    return (await apiClient.get<GardenCover[]>(`${this.url(gardenId)}/candidates`)).data;
  }

  static async select(gardenId: string, mediaAssetId: string): Promise<GardenCover> {
    return (await apiClient.put<GardenCover>(this.url(gardenId), { mediaAssetId })).data;
  }

  static async upload(gardenId: string, file: File): Promise<GardenCover> {
    const form = new FormData();
    form.append("File", file);
    const response = await apiClient.post<GardenCover>(this.url(gardenId), form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  static async delete(gardenId: string): Promise<void> {
    await apiClient.delete(this.url(gardenId));
  }
}
