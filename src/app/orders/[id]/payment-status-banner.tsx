"use client";

import Link from "next/link";
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { OrderPayment } from "@/models/orders/order";
import type { RootState } from "@/store";
import { cartActions } from "@/store/cart-slice";

const PENDING_ORDER_KEY = "famplants.pendingPaymentOrderId";

export function PaymentStatusBanner({ orderId, paymentContext, initialOrderStatus }: { orderId: string; paymentContext?: string; initialOrderStatus: string }) {
  const dispatch = useDispatch();
  const cartHydrated = useSelector((state: RootState) => state.cart.hydrated);
  const router = useRouter();
  const [status, setStatus] = useState(initialOrderStatus === "PAID" ? "Succeeded" : "Processing");
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentContext || !cartHydrated) return;
    if (initialOrderStatus === "PAID") {
      window.localStorage.removeItem(PENDING_ORDER_KEY);
      dispatch(cartActions.clearCart());
      return;
    }
    let cancelled = false;

    async function reconcile() {
      for (let attempt = 0; attempt < 20 && !cancelled; attempt += 1) {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/payment`, { cache: "no-store" });
        if (response.ok) {
          const payment = await response.json() as OrderPayment;
          if (payment.status === "Succeeded") {
            window.localStorage.removeItem(PENDING_ORDER_KEY);
            dispatch(cartActions.clearCart());
            setStatus("Succeeded");
            router.refresh();
            return;
          }
          if (payment.status === "Failed" || payment.status === "Cancelled") {
            setStatus(payment.status);
            setFailureMessage(payment.failureMessage ?? null);
            router.refresh();
            return;
          }
        }
        await new Promise((resolve) => window.setTimeout(resolve, 1500));
      }
      if (!cancelled) setStatus("Processing");
    }

    void reconcile();
    return () => { cancelled = true; };
  }, [cartHydrated, dispatch, initialOrderStatus, orderId, paymentContext, router]);

  if (!paymentContext) return null;
  if (status === "Succeeded") {
    return <div className="mt-6 flex gap-3 rounded-[2rem] bg-[#eaf6e5] p-5 text-[#0A3D27]"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" /><div><p className="font-extrabold">Payment confirmed.</p><p className="mt-1 text-sm">Your order is paid and ready for processing.</p></div></div>;
  }
  if (status === "Failed" || status === "Cancelled") {
    return <div className="mt-6 flex gap-3 rounded-[2rem] bg-red-50 p-5 text-red-800"><CircleAlert className="mt-0.5 h-6 w-6 shrink-0" /><div><p className="font-extrabold">Payment {status.toLowerCase()}.</p><p className="mt-1 text-sm">{failureMessage ?? "Your cart is still saved."} <Link href="/checkout" className="font-bold underline">Return to checkout</Link>.</p></div></div>;
  }
  return <div className="mt-6 flex gap-3 rounded-[2rem] bg-amber-50 p-5 text-amber-900"><LoaderCircle className="mt-0.5 h-6 w-6 shrink-0 animate-spin" /><div><p className="font-extrabold">Payment confirmation is processing.</p><p className="mt-1 text-sm">This page is checking the verified Stripe status. Your cart remains saved until payment succeeds.</p></div></div>;
}
