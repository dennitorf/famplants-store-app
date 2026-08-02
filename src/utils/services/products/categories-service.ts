import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { ProductCategory } from "@/models/products/category";
import { createDataQuery } from "@/utils/helpers/data-query";

export class ProductCategoriesService {
  private static readonly baseUrl = "/ns-products/api/product-categories";

  public static async getAll(page = 1, pageSize = 24): Promise<DataResponse<ProductCategory>> {
    const response = await apiClient.get<DataResponse<ProductCategory>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }
}
