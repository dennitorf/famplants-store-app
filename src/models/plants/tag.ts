export interface Tag {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  slug?: string;
  isPublic: boolean;
  isMenuTag: boolean;
  order: number;
  isActive: boolean;
}
