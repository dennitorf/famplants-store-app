import type { ImageVariant } from "@/models/media/image-variant";

export interface CollectionImage {
  id: string;
  collectionId: string;
  url: string;
  thumbnailUrl?: string;
  variants?: ImageVariant[];
  altText?: string;
  caption?: string;
  sortOrder: number;
  isPrimary: boolean;
  isActive: boolean;
}
