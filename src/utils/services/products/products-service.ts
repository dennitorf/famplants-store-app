import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { Product } from "@/models/products/product";
import { createDataQuery } from "@/utils/helpers/data-query";

export class ProductsService {
  private static readonly baseUrl = "/ns-products/api/products";

  public static async getAll(page = 1, pageSize = 24): Promise<DataResponse<Product>> {
    const response = await apiClient.get<DataResponse<Product>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async getBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(
      `${this.baseUrl}/by-slug/${encodeURIComponent(slug)}`,
    );
    return response.data;
  }
}
