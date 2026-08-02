import { apiClient } from "@/lib/axios";
import type { DataResponse } from "@/models/data/data-response";
import type { PlantCollectionMember } from "@/models/plants/plant-collection";
import type { Plant } from "@/models/plants/plant";
import { createDataQuery } from "@/utils/helpers/data-query";

export class PlantCollectionsService {
  private static readonly baseUrl = "/ns-plants/api/collections";

  public static async getPlants(collectionId: string): Promise<DataResponse<Plant>> {
    const response = await apiClient.get<DataResponse<PlantCollectionMember>>(
      `${this.baseUrl}/${collectionId}/plants?${createDataQuery(1, 1000)}`,
    );
    const plants = response.data.data.map((member): Plant => ({
      id: member.plantId,
      name: member.plantName,
      slug: member.plantSlug,
      description: member.plantDescription,
      familyId: member.plantFamilyId,
      family: member.plantFamilyId || member.plantFamilyName
        ? {
            id: member.plantFamilyId || "",
            name: member.plantFamilyName,
            isActive: true,
            isPublic: true,
          }
        : undefined,
      lightRequirement: member.plantLightRequirement,
      wateringFrequency: member.plantWateringFrequency,
      mainImage: member.mainImage,
      isActive: member.plantIsActive,
      isPublic: member.plantIsPublic,
    }));

    return { data: plants, total: response.data.total };
  }
}
