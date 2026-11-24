import { NextResponse } from "next/server";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersApiError, OrdersService } from "@/utils/services/orders/orders-service";

export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await ensureCurrentUser();
    if (!user) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    const { orderId } = await context.params;
    return NextResponse.json(await OrdersService.getPayment(user.id, orderId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The payment status could not be loaded.";
    const status = error instanceof OrdersApiError ? error.status : 400;
    return NextResponse.json({ message }, { status });
  }
}
