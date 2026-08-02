import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { ProductTagDefinition } from "@/models/products/tag";
import { createDataQuery } from "@/utils/helpers/data-query";

export class ProductTagsCatalogService {
  private static readonly baseUrl = "/ns-products/api/tags";

  public static async getAll(page = 1, pageSize = 60): Promise<DataResponse<ProductTagDefinition>> {
    const response = await apiClient.get<DataResponse<ProductTagDefinition>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<ProductTagDefinition> {
    const response = await apiClient.get<ProductTagDefinition>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async getBySlug(slug: string): Promise<ProductTagDefinition> {
    const response = await apiClient.get<ProductTagDefinition>(
      `${this.baseUrl}/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data;
  }
}
