export interface CareInformationCategory {
  id: string;
  name?: string;
  order?: string;
}

export interface CareInformation {
  id: string;
  content?: string;
  usefulnessRateCount: number;
  categoryId: string;
  category?: CareInformationCategory;
  careGuideId: string;
  isActive: boolean;
}
