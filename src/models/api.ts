export interface DataResponse<T> {
  data: T[];
  total: number;
}

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

export interface Family {
  id: string;
  name?: string;
  mustKnow?: string;
  url?: string;
  thumbnailUrl?: string;
  altText?: string;
  isActive: boolean;
  isPublic: boolean;
}

export interface Plant {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  altText?: string;
  familyId?: string;
  family?: Family;
  bloomingFrequency?: string;
  bloomingSeason?: string;
  leafColor?: string;
  temperature?: string;
  wateringFrequency?: string;
  climate?: string;
  soilType?: string;
  lightRequirement?: string;
  flowerColor?: string;
  flowerType?: string;
  leafType?: string;
  plantHabit?: string;
  plantUse?: string;
  sizeCategory?: string;
  substrateType?: string;
  isActive: boolean;
  isPublic: boolean;
}

export interface PlantImage {
  id: string;
  plantId: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  isPrimary: boolean;
}

export interface CareGuide {
  id: string;
  name?: string;
  description?: string;
  plantId: string;
  plantName?: string;
  isPublic: boolean;
  isActive: boolean;
}

export interface HardinessZone {
  id: number;
  code: string;
  minTemperatureInclusiveF: number;
  maxTemperatureExclusiveF: number;
}

export interface CareGuideApplicableHardinessZone {
  id: string;
  careGuideId: string;
  hardinessZoneId: number;
  code: string;
  minTemperatureInclusiveF: number;
  maxTemperatureExclusiveF: number;
}

export interface CareGuideApplicableType {
  id: string;
  careGuideId: string;
  careGuideTypeId: string;
  name?: string;
  isPublic: boolean;
}

export interface CareInformation {
  id: string;
  content?: string;
  usefulnessRateCount: number;
  categoryId: string;
  category?: {
    id: string;
    name?: string;
    order?: string;
  };
  careGuideId: string;
  isActive: boolean;
}

export interface ProductPlant {
  id: string;
  productId: string;
  plantId: string;
  name: string;
  quantity: number;
}

export interface AppliedDeal {
  dealId: string;
  name: string;
  discountAmount: number;
}

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

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  isPublished: boolean;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  isPrimary: boolean;
}

export interface OrderListItem {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  statusCode: string;
  statusName: string;
  currencyCode: string;
  totalAmount: number;
  totalItems: number;
  placedDate: string;
}

export interface OrderAddress {
  id?: string;
  addressType?: string;
  recipientName: string;
  email: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  countryCode: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  discountAmount: number;
  lineTotal: number;
}

export interface OrderStatusHistory {
  id: string;
  previousStatusCode?: string;
  previousStatusName?: string;
  newStatusCode: string;
  newStatusName: string;
  changedDate: string;
  notes?: string;
}

export interface Order extends OrderListItem {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  customerNotes?: string;
  items: OrderItem[];
  addresses: OrderAddress[];
  statusHistory: OrderStatusHistory[];
}

export interface CreateOrderRequest {
  idempotencyKey: string;
  currencyCode: string;
  customerNotes?: string;
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
}

export interface Garden {
  id: string;
  name?: string;
  description?: string;
  visibilityId: number;
  visibilityName?: string;
  visibilityCode?: string;
  locationId?: string;
  locationName?: string;
  modifiedDate: string;
}

export interface GardenPlant {
  id: string;
  gardenId: string;
  plantId: string;
  plantName?: string;
  locationId: string;
  locationName?: string;
  nickName?: string;
  notes?: string;
  acquiredDate?: string;
  statusId?: number;
  statusName?: string;
  healthStatusId?: number;
  healthStatusName?: string;
}

export interface LookupOption<TId extends string | number = string> {
  id: TId;
  name?: string;
  code?: string;
}
