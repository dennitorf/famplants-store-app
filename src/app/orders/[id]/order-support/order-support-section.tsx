"use client";

import { useState } from "react";
import { LifeBuoy } from "lucide-react";
import type { OrderSupportRequest } from "@/models/orders/order-support-request";
import { OrderSupportForm } from "./order-support-form";
import { OrderSupportRequestList } from "./order-support-request-list";

interface OrderSupportSectionProps {
  orderId: string;
  eligible: boolean;
  initialRequests: OrderSupportRequest[];
}

export function OrderSupportSection({ orderId, eligible, initialRequests }: OrderSupportSectionProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [formOpen, setFormOpen] = useState(false);

  const addRequest = (request: OrderSupportRequest) => {
    setRequests((current) => [request, ...current]);
    setFormOpen(false);
  };

  return <section className="mt-10 rounded-[2rem] border border-emerald-950/10 bg-white p-6 md:p-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="eyebrow">Order support</p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#153f2f]">Need help with this order?</h2>
      </div>
      {eligible ? <button type="button" className="auth-button auth-button-primary" onClick={() => setFormOpen((current) => !current)}>
        <LifeBuoy className="h-4 w-4" />
        {formOpen ? "Close form" : "Request support"}
      </button> : null}
    </div>

    {!eligible ? <p className="mt-3 text-sm text-[#637b70]">Support requests become available after the order is delivered.</p> : null}
    {formOpen ? <OrderSupportForm orderId={orderId} onCreated={addRequest} /> : null}
    <OrderSupportRequestList orderId={orderId} requests={requests} />
  </section>;
}
