export interface GardenPlant {
  id: string;
  gardenId: string;
  plantId: string;
  plantName?: string;
  locationId: string;
  locationName?: string;
  nickName?: string;
  notes?: string;
  acquiredDate?: string;
  statusId?: number;
  statusName?: string;
  healthStatusId?: number;
  healthStatusName?: string;
}
