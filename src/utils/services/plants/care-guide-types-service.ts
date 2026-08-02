import { apiClient } from "@/lib/axios";
import type { CareGuideApplicableType } from "@/models/plants/care-guide-applicable-type";

export class CareGuideTypesService {
  private static readonly baseUrl = "/ns-plants/api/care-guides";

  public static async getAll(careGuideId: string): Promise<CareGuideApplicableType[]> {
    const response = await apiClient.get<CareGuideApplicableType[]>(`${this.baseUrl}/${careGuideId}/types`);
    return response.data;
  }
}
