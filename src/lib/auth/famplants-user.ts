export interface FamPlantsUserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  authProvider: string;
  authProviderUserId: string;
}
