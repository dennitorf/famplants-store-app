import {
  OrderSupportIssueType,
  OrderSupportRequest,
  OrderSupportRequestStatus,
  PreferredSupportResolution,
} from "@/models/orders/order-support-request";

interface OrderSupportRequestListProps {
  orderId: string;
  requests: OrderSupportRequest[];
}

export function OrderSupportRequestList({ orderId, requests }: OrderSupportRequestListProps) {
  if (!requests.length) {
    return <p className="mt-6 text-sm text-[#637b70]">No support requests have been submitted for this order.</p>;
  }

  return <div className="mt-8 space-y-4">
    <h3 className="font-bold text-[#153f2f]">Your requests</h3>
    {requests.map((request) => <article key={request.id} className="rounded-3xl border border-emerald-950/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <strong>{issueLabel(request.issueType)}</strong>
        <span className="rounded-full bg-[#eaf6e5] px-3 py-1 text-xs font-bold text-[#0A3D27]">{statusLabel(request.supportRequestStatus)}</span>
      </div>
      <p className="mt-2 text-sm text-[#637b70]">Requested: {resolutionLabel(request.preferredResolution)} · Submitted {new Date(request.createdDate).toLocaleString()}</p>
      <p className="mt-3 whitespace-pre-wrap text-sm">{request.description}</p>
      {request.images.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {request.images.map((image) => {
          const path = imagePath(orderId, request.id, image.id);
          return <a key={image.id} href={path} target="_blank" rel="noreferrer">
            <img src={path} alt={image.originalFileName} className="aspect-square w-full rounded-2xl object-cover" />
          </a>;
        })}
      </div> : null}
    </article>)}
  </div>;
}

const imagePath = (orderId: string, requestId: string, imageId: string) =>
  `/api/orders/${encodeURIComponent(orderId)}/support-requests/${encodeURIComponent(requestId)}/images/${encodeURIComponent(imageId)}`;

const statusLabel = (value: OrderSupportRequestStatus) => ({
  [OrderSupportRequestStatus.Submitted]: "Submitted",
  [OrderSupportRequestStatus.UnderReview]: "Under review",
  [OrderSupportRequestStatus.Resolved]: "Resolved",
  [OrderSupportRequestStatus.Closed]: "Closed",
}[value] ?? "Submitted");

const issueLabel = (value: OrderSupportIssueType) => ({
  [OrderSupportIssueType.DamagedPlant]: "Damaged plant",
  [OrderSupportIssueType.WrongItemReceived]: "Wrong item received",
  [OrderSupportIssueType.MissingItem]: "Missing item",
  [OrderSupportIssueType.Other]: "Other issue",
}[value] ?? "Order issue");

const resolutionLabel = (value: PreferredSupportResolution) =>
  value === PreferredSupportResolution.Refund ? "Refund" : "Replacement";
