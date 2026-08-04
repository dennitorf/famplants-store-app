import type { ImageVariant } from "@/models/media/image-variant";

export interface PlantImage {
  id: string;
  plantId: string;
  url: string;
  thumbnailUrl?: string;
  variants?: ImageVariant[];
  altText?: string;
  caption?: string;
  isPrimary: boolean;
}
