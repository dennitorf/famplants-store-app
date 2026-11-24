"use client";

import { FormEvent, useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { OrderPayment, PaymentSession } from "@/models/orders/order";

const TERMINAL_FAILURES = new Set(["Failed", "Cancelled"]);

export default function PaymentStep({
  orderId,
  session,
  onSucceeded,
  onProcessing,
  onCancel,
}: {
  orderId: string;
  session: PaymentSession;
  onSucceeded: () => void;
  onProcessing: () => void;
  onCancel: () => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!stripe || !elements || isPaying) return;
    setIsPaying(true);
    setMessage(null);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${encodeURIComponent(orderId)}?payment=return`,
      },
      redirect: "if_required",
    });

    if (result.error) {
      setMessage(result.error.message ?? "Payment could not be confirmed. Your cart is still saved.");
      setIsPaying(false);
      return;
    }

    const payment = await waitForAuthoritativeStatus(orderId);
    if (payment?.status === "Succeeded") {
      onSucceeded();
      return;
    }
    if (payment && TERMINAL_FAILURES.has(payment.status)) {
      setMessage(payment.failureMessage ?? `Payment is ${payment.status.toLowerCase()}. Your cart is still saved.`);
      setIsPaying(false);
      return;
    }

    onProcessing();
  }

  async function cancel() {
    if (isCancelling || isPaying) return;
    setIsCancelling(true);
    setMessage(null);
    try {
      await onCancel();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be cancelled.");
      setIsCancelling(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl py-10 md:py-14">
      <p className="eyebrow">Secure checkout</p>
      <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl text-[#0A3D27] md:text-6xl">Payment</h1>
      <div className="mt-8 rounded-[2rem] border border-emerald-950/10 bg-white p-7">
        <div className="mb-6 flex items-center justify-between border-b border-emerald-950/10 pb-5">
          <span className="font-bold text-[#153f2f]">Order total</span>
          <strong className="text-2xl text-[#0A3D27]">{money(session.payment.totalAmount, session.payment.currencyCode)}</strong>
        </div>
        <form onSubmit={submit}>
          <PaymentElement options={{ layout: "tabs" }} />
          {message ? <p role="alert" className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">{message}</p> : null}
          <button type="submit" disabled={!stripe || !elements || isPaying || isCancelling} className="auth-button auth-button-primary mt-6 w-full disabled:cursor-wait disabled:opacity-60">
            {isPaying ? "Confirming payment..." : `Pay ${money(session.payment.totalAmount, session.payment.currencyCode)}`}
          </button>
          <button type="button" onClick={cancel} disabled={isPaying || isCancelling} className="auth-button auth-button-secondary mt-3 w-full disabled:cursor-wait disabled:opacity-60">
            {isCancelling ? "Cancelling..." : "Cancel checkout"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs leading-5 text-[#637b70]">Your cart is kept until FamPlants receives Stripe&apos;s verified payment confirmation.</p>
      </div>
    </section>
  );
}

async function waitForAuthoritativeStatus(orderId: string): Promise<OrderPayment | null> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/payment`, { cache: "no-store" });
    if (response.ok) {
      const payment = await response.json() as OrderPayment;
      if (payment.status === "Succeeded" || TERMINAL_FAILURES.has(payment.status)) return payment;
    }
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }
  return null;
}

function money(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currencyCode }).format(amount);
}
