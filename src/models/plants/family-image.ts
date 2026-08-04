import type { ImageVariant } from "@/models/media/image-variant";

export interface FamilyImage {
  id: string;
  familyId: string;
  url: string;
  thumbnailUrl?: string;
  variants?: ImageVariant[];
  altText?: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
  isActive: boolean;
}
