"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Camera, X } from "lucide-react";
import {
  OrderSupportIssueType,
  OrderSupportRequest,
  PreferredSupportResolution,
} from "@/models/orders/order-support-request";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maximumImageSize = 10 * 1024 * 1024;
const maximumImageCount = 3;

interface OrderSupportFormProps {
  orderId: string;
  onCreated: (request: OrderSupportRequest) => void;
}

export function OrderSupportForm({ orderId, onCreated }: OrderSupportFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)),
    [previews],
  );

  const chooseFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const selected = [...files, ...Array.from(incoming)];
    if (selected.length > maximumImageCount) {
      setError("You can attach up to three images.");
      return;
    }
    if (selected.some((file) => !allowedImageTypes.has(file.type) || file.size > maximumImageSize)) {
      setError("Images must be JPEG, PNG, or WebP and no larger than 10 MB.");
      return;
    }
    setFiles(selected);
    setError(undefined);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    files.forEach((file) => form.append("Images", file));

    try {
      const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}/support-requests`, {
        method: "POST",
        body: form,
      });
      const body = await response.json() as OrderSupportRequest | { message?: string };
      if (!response.ok) {
        throw new Error("message" in body ? body.message : "The support request could not be submitted.");
      }
      onCreated(body as OrderSupportRequest);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The support request could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  return <form onSubmit={submit} className="mt-6 grid gap-5 rounded-3xl bg-[#f3faef] p-5 md:grid-cols-2">
    <label className="grid gap-2 text-sm font-bold text-[#153f2f]">
      Issue type
      <select name="IssueType" required defaultValue="" className="form-input">
        <option value="" disabled>Select the issue</option>
        <option value={OrderSupportIssueType.DamagedPlant}>Damaged plant</option>
        <option value={OrderSupportIssueType.WrongItemReceived}>Wrong item received</option>
        <option value={OrderSupportIssueType.MissingItem}>Missing item</option>
        <option value={OrderSupportIssueType.Other}>Other</option>
      </select>
    </label>
    <label className="grid gap-2 text-sm font-bold text-[#153f2f]">
      Preferred resolution
      <select name="PreferredResolution" required defaultValue="" className="form-input">
        <option value="" disabled>Select a preference</option>
        <option value={PreferredSupportResolution.Replacement}>Replacement</option>
        <option value={PreferredSupportResolution.Refund}>Refund</option>
      </select>
    </label>
    <label className="grid gap-2 text-sm font-bold text-[#153f2f] md:col-span-2">
      Describe the issue
      <textarea name="Description" required maxLength={4000} rows={5} className="form-input resize-y" placeholder="Tell us what happened and which items were affected." />
    </label>
    <div className="md:col-span-2">
      <label className="auth-button auth-button-secondary cursor-pointer">
        <Camera className="h-4 w-4" />Add images ({files.length}/{maximumImageCount})
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { chooseFiles(event.target.files); event.target.value = ""; }} />
      </label>
      <SelectedImagePreviews previews={previews} onRemove={(index) => setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index))} />
    </div>
    {error ? <p role="alert" className="text-sm font-semibold text-red-700 md:col-span-2">{error}</p> : null}
    <div className="md:col-span-2">
      <button disabled={submitting} className="auth-button auth-button-primary">{submitting ? "Submitting..." : "Submit support request"}</button>
    </div>
  </form>;
}

function SelectedImagePreviews({ previews, onRemove }: { previews: Array<{ file: File; url: string }>; onRemove: (index: number) => void }) {
  if (!previews.length) return null;
  return <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
    {previews.map(({ file, url }, index) => <div key={`${file.name}-${index}`} className="relative overflow-hidden rounded-2xl border bg-white">
      <img src={url} alt={file.name} className="aspect-square w-full object-cover" />
      <button type="button" aria-label={`Remove ${file.name}`} onClick={() => onRemove(index)} className="absolute right-2 top-2 rounded-full bg-white p-1 shadow">
        <X className="h-4 w-4" />
      </button>
    </div>)}
  </div>;
}
