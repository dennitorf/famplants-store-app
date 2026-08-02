export interface ProductTagDefinition {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  slug: string;
  isPublic: boolean;
  isMenuTag: boolean;
  order: number;
  isActive: boolean;
}
