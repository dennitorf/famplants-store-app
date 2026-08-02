import { NextResponse } from "next/server";
import type { CreateOrderRequest } from "@/models/orders/order";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersApiError, OrdersService } from "@/utils/services/orders/orders-service";

export async function POST(request: Request) {
  try {
    const user = await ensureCurrentUser();
    if (!user) {
      return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    }

    const command = await request.json() as CreateOrderRequest;
    const order = await OrdersService.createForUser(user.id, command);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The order could not be created.";
    const status = error instanceof OrdersApiError ? error.status : 400;
    return NextResponse.json({ message }, { status });
  }
}
