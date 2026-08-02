import { apiClient } from "@/lib/axios";
import type { CareGuide } from "@/models/plants/care-guide";

export class CareGuidesService {
  private static readonly plantsBaseUrl = "/ns-plants/api/plants";

  public static async getByPlantId(plantId: string): Promise<CareGuide[]> {
    const response = await apiClient.get<CareGuide[]>(`${this.plantsBaseUrl}/${plantId}/care-guides`);
    return response.data;
  }
}
