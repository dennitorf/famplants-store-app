import type { MainImage } from "@/models/media/main-image";

export interface PlantCollection {
  id: string;
  name?: string;
  description?: string;
  shortDescription?: string;
  slug?: string;
  mainImage?: MainImage;
  isPublic: boolean;
  isActive: boolean;
  order: number;
  rateCount: number;
}
