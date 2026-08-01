import { apiClient } from "@/lib/axios";
import type { Garden, GardenPlant, LookupOption } from "@/models/api";

export interface SaveGardenRequest {
  id?: string;
  name: string;
  description?: string;
  visibilityId?: number;
  locationId?: string;
}

export interface SaveGardenPlantRequest {
  gardenId: string;
  plantId: string;
  locationId: string;
  acquiredDate: string;
  nickName?: string;
  notes?: string;
  statusId?: number;
  healthStatusId?: number;
}

export class GardensService {
  private static readonly baseUrl = "/ns-gardens/api/Gardens";

  public static async getAll(): Promise<Garden[]> {
    const response = await apiClient.get<Garden[]>(this.baseUrl);
    return response.data;
  }

  public static async getById(id: string): Promise<Garden> {
    const response = await apiClient.get<Garden>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  public static async create(data: SaveGardenRequest): Promise<Garden> {
    const response = await apiClient.post<Garden>(this.baseUrl, data);
    return response.data;
  }

  public static async update(id: string, data: SaveGardenRequest): Promise<Garden> {
    const response = await apiClient.put<Garden>(`${this.baseUrl}/${id}`, { ...data, id });
    return response.data;
  }

  public static async delete(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  public static async getPlants(gardenId: string): Promise<GardenPlant[]> {
    const response = await apiClient.get<GardenPlant[]>(`${this.baseUrl}/${gardenId}/plants`);
    return response.data;
  }

  public static async addPlant(gardenId: string, data: SaveGardenPlantRequest): Promise<GardenPlant> {
    const response = await apiClient.post<GardenPlant>(`${this.baseUrl}/${gardenId}/plants`, data);
    return response.data;
  }

  public static async updatePlant(
    gardenId: string,
    plantId: string,
    data: SaveGardenPlantRequest,
  ): Promise<GardenPlant> {
    const response = await apiClient.put<GardenPlant>(
      `${this.baseUrl}/${gardenId}/plants/${plantId}`,
      data,
    );
    return response.data;
  }

  public static async removePlant(gardenId: string, plantId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${gardenId}/plants/${plantId}`);
  }
}

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
