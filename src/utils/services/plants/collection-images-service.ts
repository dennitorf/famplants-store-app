import { apiClient } from "@/lib/axios";
import type { CollectionImage } from "@/models/plants/collection-image";

export class CollectionImagesService {
  private static readonly baseUrl = "/ns-plants/api/collections";

  public static async getAll(collectionId: string): Promise<CollectionImage[]> {
    const response = await apiClient.get<CollectionImage[]>(
      `${this.baseUrl}/${collectionId}/images`,
    );
    return response.data;
  }
}
