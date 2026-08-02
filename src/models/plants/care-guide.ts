export interface CareGuide {
  id: string;
  name?: string;
  description?: string;
  plantId: string;
  plantName?: string;
  isPublic: boolean;
  isActive: boolean;
}
