import { apiClient } from "@/lib/axios";
import type { Product } from "@/models/products/product";
import type { ProductTagDefinition } from "@/models/products/tag";

export class ProductTagsService {
  private static readonly baseUrl = "/ns-products/api/tags";

  public static async getProductsByTag(id: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`${this.baseUrl}/${id}/products`);
    return response.data;
  }

  public static async getTagsByProduct(productId: string): Promise<ProductTagDefinition[]> {
    const response = await apiClient.get<ProductTagDefinition[]>(
      `/ns-products/api/products/${productId}/tags`,
    );
    return response.data;
  }
}
