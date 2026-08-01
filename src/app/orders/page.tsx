import Link from "next/link";
import { PackageOpen } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import { auth0 } from "@/lib/auth0";
import { loadResult } from "@/lib/result";
import { ensureCurrentUser } from "@/utils/services/auth/current-user-service";
import { OrdersService } from "@/utils/services/orders/orders-service";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth0.getSession();
  if (!session?.user) return <StoreShell><PageHero eyebrow="Your account" title="Your orders." description="Sign in to review your FamPlants order history." /><div className="pb-16 text-center"><Link href="/auth/login?returnTo=/orders" className="auth-button auth-button-primary">Sign in</Link></div></StoreShell>;
  const user = await ensureCurrentUser();
  if (!user) return <StoreShell><div className="py-16">We could not resolve your FamPlants user.</div></StoreShell>;
  const result = await loadResult(OrdersService.getForUser(user.id));
  const orders = result.data?.data ?? [];
  return <StoreShell><PageHero eyebrow="Your account" title="Your orders." description="Track the orders placed with FamPlants." /><section className="pb-16">{result.error ? <p className="async-state">{result.error}</p> : !orders.length ? <div className="rounded-[2rem] bg-[#f3faef] p-10 text-center"><PackageOpen className="mx-auto h-10 w-10 text-[#40916c]" /><h2 className="mt-4 text-2xl font-bold text-[#153f2f]">No orders yet</h2><Link href="/products" className="auth-button auth-button-primary mt-6">Visit the shop</Link></div> : <div className="grid gap-4">{orders.map((order) => <Link href={`/orders/${order.id}`} key={order.id} className="grid gap-4 rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="eyebrow">{order.statusName}</p><h2 className="mt-1 text-xl font-bold text-[#153f2f]">{order.orderNumber}</h2><p className="mt-1 text-sm text-[#637b70]">{new Date(order.placedDate).toLocaleString()} · {order.totalItems} items</p></div><strong className="text-xl text-[#0A3D27]">{new Intl.NumberFormat("en-US", { style: "currency", currency: order.currencyCode }).format(order.totalAmount)}</strong></Link>)}</div>}</section></StoreShell>;
}
