import { apiClient } from "@/lib/axios";
import type {
  CareGuide,
  CareGuideApplicableHardinessZone,
  CareGuideApplicableType,
  CareInformation,
  DataResponse,
  HardinessZone,
  Plant,
  PlantImage,
} from "@/models/api";
import { createDataQuery } from "@/utils/services/data-query";

export class PlantsService {
  private static readonly baseUrl = "/ns-plants/api/plants";

  public static async getAll(page = 1, pageSize = 24): Promise<DataResponse<Plant>> {
    const response = await apiClient.get<DataResponse<Plant>>(
      `${this.baseUrl}?${createDataQuery(page, pageSize)}`,
    );
    return response.data;
  }

  public static async getById(id: string): Promise<Plant> {
    const response = await apiClient.get<Plant>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async getImages(id: string): Promise<PlantImage[]> {
    const response = await apiClient.get<PlantImage[]>(`${this.baseUrl}/${id}/images`);
    return response.data;
  }

  public static async getCareGuides(id: string): Promise<CareGuide[]> {
    const response = await apiClient.get<CareGuide[]>(`${this.baseUrl}/${id}/care-guides`);
    return response.data;
  }

  public static async getHardinessZoneByZip(zipCode: string): Promise<HardinessZone> {
    const response = await apiClient.get<HardinessZone>(`/ns-plants/api/hardiness-zones/by-zip/${encodeURIComponent(zipCode)}`);
    return response.data;
  }

  public static async getCareGuideHardinessZones(careGuideId: string): Promise<CareGuideApplicableHardinessZone[]> {
    const response = await apiClient.get<CareGuideApplicableHardinessZone[]>(`/ns-plants/api/care-guides/${careGuideId}/hardiness-zones`);
    return response.data;
  }

  public static async getCareGuideTypes(careGuideId: string): Promise<CareGuideApplicableType[]> {
    const response = await apiClient.get<CareGuideApplicableType[]>(`/ns-plants/api/care-guides/${careGuideId}/types`);
    return response.data;
  }

  public static async getCareInformation(careGuideId: string): Promise<CareInformation[]> {
    const response = await apiClient.get<CareInformation[]>(`/ns-plants/api/care-guides/${careGuideId}/care-information`);
    return response.data;
  }

  public static async rateCareInformation(careGuideId: string, informationId: string): Promise<CareInformation> {
    const response = await apiClient.post<CareInformation>(`/ns-plants/api/care-guides/${careGuideId}/care-information/${informationId}/rate`);
    return response.data;
  }
}
