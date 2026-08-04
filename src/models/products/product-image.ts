import type { ImageVariant } from "@/models/media/image-variant";

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl?: string;
  variants?: ImageVariant[];
  altText?: string;
  caption?: string;
  isPrimary: boolean;
}
