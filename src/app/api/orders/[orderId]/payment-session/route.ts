import { NextResponse } from "next/server";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersApiError, OrdersService } from "@/utils/services/orders/orders-service";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await ensureCurrentUser();
    if (!user) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    const { orderId } = await context.params;
    const body = await request.json() as { idempotencyKey?: string };
    if (!body.idempotencyKey?.trim()) {
      return NextResponse.json({ message: "A payment idempotency key is required." }, { status: 400 });
    }
    return NextResponse.json(await OrdersService.createPaymentSession(user.id, orderId, body.idempotencyKey));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The payment session could not be created.";
    const status = error instanceof OrdersApiError ? error.status : 400;
    return NextResponse.json({ message }, { status });
  }
}
