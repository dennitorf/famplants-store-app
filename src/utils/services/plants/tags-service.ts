import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { Tag } from "@/models/plants/tag";
import { createDataQuery } from "@/utils/helpers/data-query";

export class TagsService {
  private static readonly baseUrl = "/ns-plants/api/tags";

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
}
