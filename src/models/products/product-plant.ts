export interface ProductPlant {
  id: string;
  productId: string;
  productName?: string;
  plantId: string;
  name: string;
  quantity: number;
  requiredMeetQuantity?: boolean;
  modifiedDate?: string;
}
