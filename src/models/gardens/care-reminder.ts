export interface CareReminder {
  id: string;
  gardenPlantId: string;
  careEventTypeId: string;
  careEventTypeName?: string;
  careEventTypeActionName?: string;
  careRuleId: string;
  instructions?: string;
  isActed: boolean;
  isCompleted: boolean;
  dueDate: string;
  actedOn?: string;
  notes?: string;
  plantName?: string;
  plantNickname?: string;
}
