import { NextResponse } from "next/server";
import type { DiscountCartItem } from "@/models/orders/order";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersApiError, OrdersService } from "@/utils/services/orders/orders-service";

export async function POST(request: Request) {
  try {
    if (!await ensureCurrentUser()) {
      return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    }
    const body = await request.json() as { code: string; items: DiscountCartItem[] };
    return NextResponse.json(await OrdersService.validateDiscount(body.code, body.items));
  } catch (error) {
    const message = error instanceof Error ? error.message : "The discount could not be validated.";
    return NextResponse.json({ message }, { status: error instanceof OrdersApiError ? error.status : 400 });
  }
}
