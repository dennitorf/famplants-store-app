export interface Garden {
  id: string;
  name?: string;
  description?: string;
  visibilityId: number;
  visibilityName?: string;
  visibilityCode?: string;
  locationId?: string;
  locationName?: string;
  isOwner: boolean;
  coverPhotoId?: string;
  coverPhotoUrl?: string;
  coverThumbnailUrl?: string;
  coverCardUrl?: string;
  modifiedDate: string;
}
