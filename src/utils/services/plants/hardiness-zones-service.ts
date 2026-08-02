import { apiClient } from "@/lib/axios";
import type { HardinessZone } from "@/models/plants/hardiness-zone";

export class HardinessZonesService {
  private static readonly baseUrl = "/ns-plants/api/hardiness-zones";

  public static async getByZipCode(zipCode: string): Promise<HardinessZone> {
    const response = await apiClient.get<HardinessZone>(`${this.baseUrl}/by-zip/${encodeURIComponent(zipCode)}`);
    return response.data;
  }
}
