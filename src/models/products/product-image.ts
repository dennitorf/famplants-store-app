export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  isPrimary: boolean;
}
