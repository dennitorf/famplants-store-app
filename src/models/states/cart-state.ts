export interface CartItem {
  productId: string;
  productSlug?: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  hydrated: boolean;
}
