import { apiClient } from "@/lib/axios";
import type { DataResponse, Product, Tag } from "@/models/api";
import { createDataQuery } from "@/utils/services/data-query";

export class ProductTagsService {
  private static readonly baseUrl = "/ns-products/api/tags";

  public static async getAll(page = 1, pageSize = 60): Promise<DataResponse<Tag>> {
    const response = await apiClient.get<DataResponse<Tag>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<Tag> {
    const response = await apiClient.get<Tag>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async getProductsByTag(id: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`${this.baseUrl}/${id}/products`);
    return response.data;
  }
}
