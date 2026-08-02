import { apiClient } from "@/lib/axios";
import type { CareInformation } from "@/models/plants/care-information";

export class CareInformationService {
  private static readonly baseUrl = "/ns-plants/api/care-guides";

  public static async getAll(careGuideId: string): Promise<CareInformation[]> {
    const response = await apiClient.get<CareInformation[]>(`${this.baseUrl}/${careGuideId}/care-information`);
    return response.data;
  }

  public static async rate(careGuideId: string, informationId: string): Promise<CareInformation> {
    const response = await apiClient.post<CareInformation>(`${this.baseUrl}/${careGuideId}/care-information/${informationId}/rate`);
    return response.data;
  }
}
