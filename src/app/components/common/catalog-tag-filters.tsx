import Link from "next/link";
import { Hash } from "lucide-react";
import type { Tag } from "@/models/api";

interface CatalogTagFiltersProps {
  basePath: string;
  tags: Tag[];
  selectedTagId?: string;
  allLabel: string;
}

export default function CatalogTagFilters({
  basePath,
  tags,
  selectedTagId,
  allLabel,
}: CatalogTagFiltersProps) {
  if (!tags.length) {
    return null;
  }

  return (
    <section className="mb-8 rounded-3xl border border-emerald-950/10 bg-white/80 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Hash className="h-5 w-5 text-[#12613f]" />
        <h2 className="font-bold text-[#153f2f]">Browse collections by tag</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={basePath}
          className={`trait-pill transition-colors ${!selectedTagId ? "bg-[#0A3D27] !text-white" : "hover:bg-[#dff2d7]"}`}
        >
          {allLabel}
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`${basePath}?tag=${encodeURIComponent(tag.id)}`}
            title={tag.description || undefined}
            className={`trait-pill transition-colors ${selectedTagId === tag.id ? "bg-[#0A3D27] !text-white" : "hover:bg-[#dff2d7]"}`}
          >
            {tag.name || "Collection"}
          </Link>
        ))}
      </div>
    </section>
  );
}
