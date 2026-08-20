import { getFamPlantsApiAccessToken } from "@/lib/auth/access-token";
import { apiBaseUrl } from "@/lib/config";
import type { OrderSupportRequest } from "@/models/orders/order-support-request";

export class OrderSupportApiError extends Error {
  public constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "OrderSupportApiError";
  }
}

export class OrderSupportService {
  public static async getForOrder(userId: string, orderId: string): Promise<OrderSupportRequest[]> {
    const token = await getFamPlantsApiAccessToken();
    const response = await fetch(endpoint(userId, orderId), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new OrderSupportApiError(response.status, `Failed to load support requests: ${response.status}`);
    }
    return await response.json() as OrderSupportRequest[];
  }

  public static async create(userId: string, orderId: string, form: FormData): Promise<OrderSupportRequest> {
    const token = await getFamPlantsApiAccessToken();
    const response = await fetch(endpoint(userId, orderId), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
      cache: "no-store",
    });
    if (!response.ok) {
      throw new OrderSupportApiError(
        response.status,
        await readApiError(response, "The support request could not be submitted."),
      );
    }
    return await response.json() as OrderSupportRequest;
  }

  public static async getImage(userId: string, orderId: string, supportRequestId: string, imageId: string): Promise<Response> {
    const token = await getFamPlantsApiAccessToken();
    return fetch(`${endpoint(userId, orderId)}/${encodeURIComponent(supportRequestId)}/images/${encodeURIComponent(imageId)}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }
}

function endpoint(userId: string, orderId: string): string {
  return `${apiBaseUrl}/ns-orders/api/users/${encodeURIComponent(userId)}/orders/${encodeURIComponent(orderId)}/support-requests`;
}

async function readApiError(response: Response, fallback: string): Promise<string> {
  const body = await response.text();
  if (!body) return fallback;
  try {
    const parsed = JSON.parse(body) as { detail?: string; title?: string; errors?: Record<string, string[]> };
    const firstValidationMessage = parsed.errors
      ? Object.values(parsed.errors).flat().find(Boolean)
      : undefined;
    return firstValidationMessage ?? parsed.detail ?? parsed.title ?? fallback;
  } catch {
    return body;
  }
}
