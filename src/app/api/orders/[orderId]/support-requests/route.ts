import { NextResponse } from "next/server";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrderSupportApiError, OrderSupportService } from "@/utils/services/orders/order-support-service";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await ensureCurrentUser();
    if (!user) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    const { orderId } = await params;
    return NextResponse.json(await OrderSupportService.getForOrder(user.id, orderId));
  } catch (error) {
    return failure(error, "Support requests could not be loaded.");
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const user = await ensureCurrentUser();
    if (!user) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
    const { orderId } = await params;
    const created = await OrderSupportService.create(user.id, orderId, await request.formData());
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return failure(error, "The support request could not be submitted.");
  }
}

function failure(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ message }, { status: error instanceof OrderSupportApiError ? error.status : 400 });
}
