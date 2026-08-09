import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { ProductPlant } from "@/models/products/product-plant";
import { createDataQuery } from "@/utils/helpers/data-query";

export class PlantProductsService {
  private static readonly baseUrl = "/ns-products/api/plants";

  public static async getAll(
    plantId: string,
    page = 1,
    pageSize = 12,
  ): Promise<DataResponse<ProductPlant>> {
    const response = await apiClient.get<DataResponse<ProductPlant>>(
      `${this.baseUrl}/${plantId}/products?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }
}
