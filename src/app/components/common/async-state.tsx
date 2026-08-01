import { AlertCircle, LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Growing something lovely…" }: { label?: string }) {
  return (
    <div className="async-state" role="status">
      <LoaderCircle className="h-6 w-6 animate-spin" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="async-state border-red-200 bg-red-50 text-red-800" role="alert">
      <AlertCircle className="h-6 w-6" />
      <div>
        <p className="font-bold">We could not load this right now.</p>
        <p className="mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="async-state">
      <div>
        <p className="font-bold text-[#0A3D27]">{title}</p>
        <p className="mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}
