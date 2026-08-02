import { apiClient } from "@/lib/axios";
import type { CareGuideApplicableHardinessZone } from "@/models/plants/care-guide-applicable-hardiness-zone";

export class CareGuideHardinessZonesService {
  private static readonly baseUrl = "/ns-plants/api/care-guides";

  public static async getAll(careGuideId: string): Promise<CareGuideApplicableHardinessZone[]> {
    const response = await apiClient.get<CareGuideApplicableHardinessZone[]>(`${this.baseUrl}/${careGuideId}/hardiness-zones`);
    return response.data;
  }
}
