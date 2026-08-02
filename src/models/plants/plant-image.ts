export interface PlantImage {
  id: string;
  plantId: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  isPrimary: boolean;
}
