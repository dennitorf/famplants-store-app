import { apiClient } from "@/lib/axios";
import type { Product } from "@/models/products/product";

export class ProductTagsService {
  private static readonly baseUrl = "/ns-products/api/tags";

  public static async getProductsByTag(id: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`${this.baseUrl}/${id}/products`);
    return response.data;
  }
}
