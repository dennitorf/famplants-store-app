export enum ImageVariantType {
  Thumbnail = 1,
  Card = 2,
  Detail = 3,
  Hero = 4,
}

export interface ImageVariant {
  variantType: ImageVariantType;
  url: string;
  contentType?: string;
  sizeInBytes?: number;
  width?: number;
  height?: number;
}

export interface ImageCatalogEntry {
  url?: string;
  thumbnailUrl?: string;
  variants?: readonly ImageVariant[];
}
