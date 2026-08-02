import type { MainImage } from "@/models/media/main-image";
import type { Family } from "@/models/plants/family";

export interface Plant {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  altText?: string;
  mainImage?: MainImage;
  familyId?: string;
  family?: Family;
  bloomingFrequency?: string;
  bloomingSeason?: string;
  leafColor?: string;
  temperature?: string;
  wateringFrequency?: string;
  climate?: string;
  soilType?: string;
  lightRequirement?: string;
  flowerColor?: string;
  flowerType?: string;
  leafType?: string;
  plantHabit?: string;
  plantUse?: string;
  sizeCategory?: string;
  substrateType?: string;
  isActive: boolean;
  isPublic: boolean;
}
