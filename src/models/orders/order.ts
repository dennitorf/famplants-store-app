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
