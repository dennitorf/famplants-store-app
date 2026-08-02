import type { MainImage } from "@/models/media/main-image";

export interface PlantCollectionMember {
  id: string;
  collectionId: string;
  plantId: string;
  collectionName?: string;
  plantName?: string;
  plantSlug?: string;
  plantDescription?: string;
  plantFamilyId?: string;
  plantFamilyName?: string;
  plantLightRequirement?: string;
  plantWateringFrequency?: string;
  plantIsActive: boolean;
  plantIsPublic: boolean;
  mainImage?: MainImage;
}
