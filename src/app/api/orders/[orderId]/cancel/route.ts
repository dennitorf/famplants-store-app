import { NextResponse } from "next/server";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersApiError, OrdersService } from "@/utils/services/orders/orders-service";

export async function POST(request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await ensureCurrentUser();
    if (!user) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    const { orderId } = await context.params;
    const body = await request.json() as { reason?: string };
    const reason = body.reason?.trim() || "Customer cancelled checkout.";
    return NextResponse.json(await OrdersService.cancelForUser(user.id, orderId, reason));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The order could not be cancelled.";
    const status = error instanceof OrdersApiError ? error.status : 400;
    return NextResponse.json({ message }, { status });
  }
}
