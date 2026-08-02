import type { MainImage } from "@/models/media/main-image";

export interface Family {
  id: string;
  name?: string;
  mustKnow?: string;
  url?: string;
  thumbnailUrl?: string;
  altText?: string;
  mainImage?: MainImage;
  isActive: boolean;
  isPublic: boolean;
}
