import type { AppliedDeal } from "@/models/products/applied-deal";
import type { ProductPlant } from "@/models/products/product-plant";

export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
  sku: string;
  slug: string;
  categoryName?: string;
  categorySlug?: string;
  categoryId: string;
  typeName?: string;
  basePrice: number;
  effectivePrice: number;
  discountAmount: number;
  appliedDeals: AppliedDeal[];
  primaryStockLevel: number;
  specifications?: string;
  arePlantsIncluded: boolean;
  plants: ProductPlant[];
  isPublished: boolean;
}
