import { apiClient } from "@/lib/axios";
import type { FamilyImage } from "@/models/plants/family-image";

export class FamilyImagesService {
  private static readonly baseUrl = "/ns-plants/api/families";

  public static async getAll(familyId: string): Promise<FamilyImage[]> {
    const response = await apiClient.get<FamilyImage[]>(
      `${this.baseUrl}/${familyId}/images`,
    );
    return response.data;
  }
}
