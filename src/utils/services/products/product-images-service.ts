import { apiClient } from "@/lib/axios";
import type { ProductImage } from "@/models/products/product-image";

export class ProductImagesService {
  private static readonly baseUrl = "/ns-products/api/products";

  public static async getAll(productId: string): Promise<ProductImage[]> {
    const response = await apiClient.get<ProductImage[]>(`${this.baseUrl}/${productId}/images`);
    return response.data;
  }
}
