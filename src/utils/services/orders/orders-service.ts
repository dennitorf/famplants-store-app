import { apiBaseUrl } from "@/lib/config";
import { getFamPlantsApiAccessToken } from "@/lib/auth/access-token";
import type { CreateOrderRequest, DataResponse, Order, OrderListItem } from "@/models/api";

export class OrdersApiError extends Error {
  public constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "OrdersApiError";
  }
}

export class OrdersService {
  public static async getForUser(userId: string, page = 1, pageSize = 25): Promise<DataResponse<OrderListItem>> {
    const token = await getFamPlantsApiAccessToken();
    const response = await fetch(`${apiBaseUrl}/ns-orders/api/users/${encodeURIComponent(userId)}/orders?page=${page}&pageSize=${pageSize}&orderBy=PlacedDate&order=desc`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!response.ok) throw new Error(`Failed to load orders: ${response.status}`);
    return await response.json() as DataResponse<OrderListItem>;
  }

  public static async getForUserById(userId: string, orderId: string): Promise<Order> {
    const token = await getFamPlantsApiAccessToken();
    const response = await fetch(
      `${apiBaseUrl}/ns-orders/api/users/${encodeURIComponent(userId)}/orders/${encodeURIComponent(orderId)}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!response.ok) throw new Error(`Failed to load order: ${response.status}`);
    return await response.json() as Order;
  }

  public static async createForUser(userId: string, request: CreateOrderRequest): Promise<Order> {
    const token = await getFamPlantsApiAccessToken();
    const response = await fetch(
      `${apiBaseUrl}/ns-orders/api/users/${encodeURIComponent(userId)}/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      const body = await response.text();
      throw new OrdersApiError(
        response.status,
        body || `Failed to create order: ${response.status}`,
      );
    }
    return await response.json() as Order;
  }
}
