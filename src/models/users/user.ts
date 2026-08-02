export interface FamPlantsUserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdDate: string;
  createdBy?: string;
  modifiedDate: string;
  lastModifiedBy?: string;
  authProvider: string;
  authProviderUserId: string;
}
