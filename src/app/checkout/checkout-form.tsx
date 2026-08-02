"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { CreateOrderRequest, Order, OrderAddress } from "@/models/orders/order";
import type { RootState } from "@/store";
import { cartActions } from "@/store/cart-slice";

export default function CheckoutForm({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, hydrated } = useSelector((state: RootState) => state.cart);
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const idempotencyKey = useRef<string | null>(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !items.length) return;

    setIsSubmitting(true);
    setSubmitError(null);
    idempotencyKey.current ??= window.crypto.randomUUID();

    const form = new FormData(event.currentTarget);
    const shippingAddress = addressFromForm(form, "shipping");
    const command: CreateOrderRequest = {
      idempotencyKey: idempotencyKey.current,
      currencyCode: "USD",
      customerNotes: value(form, "customerNotes") || undefined,
      items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      shippingAddress,
      billingAddress: billingSameAsShipping ? undefined : addressFromForm(form, "billing"),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });
      const result = await response.json() as Order | { message?: string };
      if (!response.ok) {
        throw new Error("message" in result && result.message
          ? readableApiError(result.message)
          : "The order could not be created.");
      }

      dispatch(cartActions.clearCart());
      router.push(`/orders/${(result as Order).id}?placed=1`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The order could not be created.");
      setIsSubmitting(false);
    }
  }

  if (!hydrated) {
    return <section className="py-20 text-center text-[#557064]">Loading your checkout...</section>;
  }

  if (!items.length) {
    return <section className="py-20 text-center"><h1 className="text-3xl font-bold text-[#0A3D27]">Your cart is empty</h1><Link href="/products" className="auth-button auth-button-primary mt-6">Browse products</Link></section>;
  }

  return (
    <section className="py-10 md:py-14">
      <p className="eyebrow">Secure checkout</p>
      <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl text-[#0A3D27] md:text-6xl">Delivery details</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-8">
          <AddressFields prefix="shipping" title="Shipping address" email={email} name={name} />
          <label className="flex items-center gap-3 font-bold text-[#153f2f]">
            <input type="checkbox" checked={billingSameAsShipping} onChange={(event) => setBillingSameAsShipping(event.target.checked)} className="h-5 w-5 accent-[#12613f]" />
            Billing address is the same as shipping
          </label>
          {!billingSameAsShipping ? <AddressFields prefix="billing" title="Billing address" email={email} name={name} /> : null}
          <div className="form-field rounded-[2rem] border border-emerald-950/10 bg-white p-7">
            <label htmlFor="customerNotes">Order notes</label>
            <textarea id="customerNotes" name="customerNotes" rows={4} maxLength={1000} className="form-input" placeholder="Delivery notes or anything else we should know" />
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] bg-[#f3faef] p-7 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-[#153f2f]">Review</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => <li key={item.productId} className="flex justify-between gap-4 text-sm"><span>{item.name} × {item.quantity}</span><strong>${(item.unitPrice * item.quantity).toFixed(2)}</strong></li>)}
          </ul>
          <div className="mt-5 flex justify-between border-t border-emerald-950/10 pt-4 text-lg"><strong>Estimated subtotal</strong><strong>${subtotal.toFixed(2)}</strong></div>
          <p className="mt-3 text-xs leading-5 text-[#637b70]">The authoritative price is calculated when your order is placed. Payment processing will follow the pending-payment order.</p>
          {submitError ? <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800">{submitError}</p> : null}
          <button disabled={isSubmitting} className="auth-button auth-button-primary mt-6 w-full disabled:cursor-wait disabled:opacity-60">{isSubmitting ? "Placing order..." : "Place order"}</button>
          <Link href="/cart" className="mt-4 block text-center text-sm font-bold text-[#416a58] hover:underline">Return to cart</Link>
        </aside>
      </form>
    </section>
  );
}

function AddressFields({ prefix, title, email, name }: { prefix: string; title: string; email: string; name: string }) {
  return <fieldset className="grid gap-5 rounded-[2rem] border border-emerald-950/10 bg-white p-7 sm:grid-cols-2"><legend className="px-2 text-xl font-bold text-[#153f2f]">{title}</legend><Field label="Recipient name" name={`${prefix}.recipientName`} defaultValue={name} /><Field label="Email" name={`${prefix}.email`} type="email" defaultValue={email} /><Field label="Phone" name={`${prefix}.phoneNumber`} required={false} /><div className="sm:col-span-2"><Field label="Address line 1" name={`${prefix}.addressLine1`} /></div><div className="sm:col-span-2"><Field label="Address line 2" name={`${prefix}.addressLine2`} required={false} /></div><Field label="City" name={`${prefix}.city`} /><Field label="State or province" name={`${prefix}.stateOrProvince`} /><Field label="Postal code" name={`${prefix}.postalCode`} /><Field label="Country code" name={`${prefix}.countryCode`} defaultValue="US" maxLength={2} /></fieldset>;
}

function Field({ label, name, type = "text", defaultValue = "", required = true, maxLength }: { label: string; name: string; type?: string; defaultValue?: string; required?: boolean; maxLength?: number }) {
  return <div className="form-field"><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} defaultValue={defaultValue} required={required} maxLength={maxLength} className="form-input" /></div>;
}

function value(form: FormData, name: string): string {
  return String(form.get(name) ?? "").trim();
}

function addressFromForm(form: FormData, prefix: string): OrderAddress {
  return {
    recipientName: value(form, `${prefix}.recipientName`),
    email: value(form, `${prefix}.email`),
    phoneNumber: value(form, `${prefix}.phoneNumber`) || undefined,
    addressLine1: value(form, `${prefix}.addressLine1`),
    addressLine2: value(form, `${prefix}.addressLine2`) || undefined,
    city: value(form, `${prefix}.city`),
    stateOrProvince: value(form, `${prefix}.stateOrProvince`),
    postalCode: value(form, `${prefix}.postalCode`),
    countryCode: value(form, `${prefix}.countryCode`).toUpperCase(),
  };
}

function readableApiError(message: string): string {
  try {
    const parsed = JSON.parse(message) as { title?: string; detail?: string; errors?: Record<string, string[]> };
    const validationMessage = parsed.errors ? Object.values(parsed.errors).flat()[0] : undefined;
    return validationMessage ?? parsed.detail ?? parsed.title ?? message;
  } catch {
    return message;
  }
}
