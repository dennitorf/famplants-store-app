import { apiClient } from "@/lib/axios";
import type { GardenShare } from "@/models/gardens/garden-share";

export class GardenSharesService {
  private static url(gardenId: string): string {
    return `/ns-gardens/api/gardens/${gardenId}/shares`;
  }
  static async getAll(gardenId: string): Promise<GardenShare[]> {
    return (await apiClient.get<GardenShare[]>(this.url(gardenId))).data;
  }
  static async create(gardenId: string, email: string): Promise<GardenShare> {
    return (await apiClient.post<GardenShare>(this.url(gardenId), { email })).data;
  }
  static async delete(gardenId: string, userId: string): Promise<void> {
    await apiClient.delete(`${this.url(gardenId)}/${userId}`);
  }
}
