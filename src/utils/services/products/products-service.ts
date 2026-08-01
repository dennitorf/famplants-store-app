import { apiClient } from "@/lib/axios";
import type { DataResponse, Product, ProductCategory, ProductImage } from "@/models/api";
import { createDataQuery } from "@/utils/services/data-query";

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

  public static async getImages(id: string): Promise<ProductImage[]> {
    const response = await apiClient.get<ProductImage[]>(`${this.baseUrl}/${id}/images`);
    return response.data;
  }
}

export class ProductCategoriesService {
  private static readonly baseUrl = "/ns-products/api/product-categories";

  public static async getAll(page = 1, pageSize = 24): Promise<DataResponse<ProductCategory>> {
    const response = await apiClient.get<DataResponse<ProductCategory>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }
}
