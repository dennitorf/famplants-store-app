export interface GardenPlantPhoto {
  id: string;
  gardenPlantId: string;
  url: string;
  thumbnailUrl?: string;
  cardUrl?: string;
  detailUrl?: string;
  altText?: string;
  caption?: string;
  capturedDate: string;
  createdDate: string;
  isPrimary: boolean;
}
