import type { MainImage } from "@/models/media/main-image";

export interface PlantIssue {
  id: string;
  plantId: string;
  plant?: string;
  name?: string;
  slug?: string;
  categoryId: number;
  category?: string;
  severityId: number;
  severity?: string;
  description?: string;
  preventionTips?: string;
  isPreventable: boolean;
  canKillPlant: boolean;
  isContagious: boolean;
  typicalRecoveryDays?: number;
  displayOrder: number;
  isPublic: boolean;
  mainImage?: MainImage;
}
