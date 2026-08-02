export interface SaveGardenPlantRequest {
  gardenId: string;
  plantId: string;
  locationId: string;
  acquiredDate: string;
  nickName?: string;
  notes?: string;
  statusId?: number;
  healthStatusId?: number;
}
