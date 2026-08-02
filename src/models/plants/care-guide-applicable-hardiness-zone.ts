export interface CareGuideApplicableHardinessZone {
  id: string;
  careGuideId: string;
  hardinessZoneId: number;
  code: string;
  minTemperatureInclusiveF: number;
  maxTemperatureExclusiveF: number;
}
