import { apiClient } from "@/lib/axios";
import type { LookupOption } from "@/models/common/lookup-option";

export class GardenLookupsService {
  public static async getLocations(): Promise<LookupOption[]> {
    const response = await apiClient.get<LookupOption[]>("/ns-gardens/api/locations");
    return response.data;
  }

  public static async getVisibilities(): Promise<LookupOption<number>[]> {
    const response = await apiClient.get<LookupOption<number>[]>("/ns-gardens/api/visibilities");
    return response.data;
  }

  public static async getPlantStatuses(): Promise<LookupOption<number>[]> {
    const response = await apiClient.get<LookupOption<number>[]>("/ns-gardens/api/garden-plan-statuses");
    return response.data;
  }

  public static async getHealthStatuses(): Promise<LookupOption<number>[]> {
    const response = await apiClient.get<LookupOption<number>[]>("/ns-gardens/api/health-statuses");
    return response.data;
  }
}
