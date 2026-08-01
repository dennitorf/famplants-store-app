import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import { ErrorState } from "@/app/components/common/async-state";
import { auth0 } from "@/lib/auth0";
import { errorMessage } from "@/lib/text";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersService } from "@/utils/services/orders/orders-service";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ placed?: string }> }) {
  const session = await auth0.getSession();
  const { id } = await params;
  const { placed } = await searchParams;
  if (!session?.user) return <StoreShell><div className="py-20 text-center"><Link href={`/auth/login?returnTo=/orders/${id}`} className="auth-button auth-button-primary">Sign in to view this order</Link></div></StoreShell>;

  try {
    const user = await ensureCurrentUser();
    if (!user) throw new Error("We could not resolve your FamPlants user.");
    const order = await OrdersService.getForUserById(user.id, id);
    const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: order.currencyCode }).format(amount);
    const shipping = order.addresses.find((address) => address.addressType?.toLowerCase() === "shipping");

    return <StoreShell><section className="py-10 md:py-14"><Link href="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58] hover:text-[#0A3D27]"><ArrowLeft className="h-4 w-4" />All orders</Link>{placed === "1" ? <div className="mt-6 flex gap-3 rounded-[2rem] bg-[#eaf6e5] p-5 text-[#0A3D27]"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /><div><p className="font-extrabold">Your order has been placed.</p><p className="mt-1 text-sm">We created it with pending-payment status and saved the product details shown below.</p></div></div> : null}<div className="mt-7 flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow">{order.statusName}</p><h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl text-[#0A3D27] md:text-6xl">{order.orderNumber}</h1><p className="mt-2 text-[#637b70]">Placed {new Date(order.placedDate).toLocaleString()}</p></div><strong className="text-3xl text-[#0A3D27]">{money(order.totalAmount)}</strong></div><div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_.75fr]"><div className="overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white"><div className="border-b border-emerald-950/10 px-6 py-5"><h2 className="text-xl font-bold text-[#153f2f]">Items</h2></div><div className="divide-y divide-emerald-950/10">{order.items.map((item) => <div key={item.id} className="grid gap-2 px-6 py-5 sm:grid-cols-[1fr_auto]"><div><Link href={`/products/${item.productId}`} className="font-bold text-[#153f2f] hover:underline">{item.productName}</Link><p className="text-sm text-[#637b70]">SKU {item.sku} · {item.quantity} × {money(item.unitPrice)}</p></div><strong>{money(item.lineTotal)}</strong></div>)}</div></div><aside className="space-y-5"><div className="rounded-[2rem] bg-[#f3faef] p-6"><h2 className="font-bold text-[#153f2f]">Summary</h2><SummaryRow label="Subtotal" value={money(order.subtotal)} /><SummaryRow label="Discount" value={`−${money(order.discountAmount)}`} /><SummaryRow label="Shipping" value={money(order.shippingAmount)} /><SummaryRow label="Tax" value={money(order.taxAmount)} /><div className="mt-4 flex justify-between border-t border-emerald-950/10 pt-4 text-lg font-extrabold"><span>Total</span><span>{money(order.totalAmount)}</span></div></div>{shipping ? <div className="rounded-[2rem] border border-emerald-950/10 bg-white p-6"><h2 className="font-bold text-[#153f2f]">Shipping to</h2><address className="mt-3 not-italic leading-7 text-[#557064]">{shipping.recipientName}<br />{shipping.addressLine1}{shipping.addressLine2 ? <><br />{shipping.addressLine2}</> : null}<br />{shipping.city}, {shipping.stateOrProvince} {shipping.postalCode}<br />{shipping.countryCode}</address></div> : null}</aside></div></section></StoreShell>;
  } catch (error) {
    return <StoreShell><div className="py-14"><ErrorState message={errorMessage(error)} /></div></StoreShell>;
  }
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="mt-3 flex justify-between text-sm text-[#557064]"><span>{label}</span><strong className="text-[#153f2f]">{value}</strong></div>;
}
