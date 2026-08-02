import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { Plant } from "@/models/plants/plant";
import { createDataQuery } from "@/utils/helpers/data-query";

export class FamilyPlantsService {
  private static readonly baseUrl = "/ns-plants/api/families";

  public static async getAll(
    familyId: string,
    page = 1,
    pageSize = 24,
  ): Promise<DataResponse<Plant>> {
    const response = await apiClient.get<DataResponse<Plant>>(
      `${this.baseUrl}/${familyId}/plants?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }
}
