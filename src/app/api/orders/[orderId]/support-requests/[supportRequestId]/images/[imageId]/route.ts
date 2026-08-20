import { NextResponse } from "next/server";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrderSupportService } from "@/utils/services/orders/order-support-service";

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string; supportRequestId: string; imageId: string }> }) {
  const user = await ensureCurrentUser();
  if (!user) return NextResponse.json({ message: "Authentication is required." }, { status: 401 });
  const { orderId, supportRequestId, imageId } = await params;
  const response = await OrderSupportService.getImage(user.id, orderId, supportRequestId, imageId);
  if (!response.ok) return NextResponse.json({ message: "Image not found." }, { status: response.status });
  return new NextResponse(await response.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
}
