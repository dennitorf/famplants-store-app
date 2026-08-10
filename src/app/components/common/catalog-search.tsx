import Link from "next/link";
import { Search, X } from "lucide-react";

interface CatalogSearchProps {
  action: string;
  query?: string;
  placeholder: string;
  hiddenFields?: Record<string, string | undefined>;
}

export default function CatalogSearch({
  action,
  query,
  placeholder,
  hiddenFields = {},
}: CatalogSearchProps) {
  const normalizedQuery = query?.trim() ?? "";
  const preservedFields = Object.entries(hiddenFields).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );
  const clearParams = new URLSearchParams(preservedFields);
  const clearQuery = clearParams.toString();
  const clearHref = clearQuery ? `${action}?${clearQuery}` : action;

  return (
    <form action={action} method="get" role="search" className="mb-6 flex flex-col gap-3 sm:flex-row">
      {preservedFields.map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className="relative min-w-0 flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#637b70]"
        />
        <input
          type="search"
          name="q"
          defaultValue={normalizedQuery}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-12 w-full rounded-2xl border border-[#d6e2da] bg-white pl-12 pr-4 text-[#153f2f] outline-none transition placeholder:text-[#8ca096] focus:border-[#3c7b5d] focus:ring-2 focus:ring-[#3c7b5d]/15"
        />
      </div>
      <button
        type="submit"
        className="h-12 rounded-2xl bg-[#256044] px-6 font-semibold text-white transition hover:bg-[#1d4e37]"
      >
        Search
      </button>
      {normalizedQuery ? (
        <Link
          href={clearHref}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#d6e2da] bg-white px-5 font-semibold text-[#315c48] transition hover:bg-[#f3f8f4]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
          Clear
        </Link>
      ) : null}
    </form>
  );
}
