import Link from "next/link";
import { Flower2, Layers3 } from "lucide-react";
import type { Tag } from "@/models/plants/tag";
import TagIcon from "@/app/components/plants/tag-icon";

type SelectedSection = "all" | "families" | "tag";

interface PlantDiscoverySidebarProps {
  tags: Tag[];
  selectedSection: SelectedSection;
  selectedTagSlug?: string;
}

function navigationClass(selected: boolean): string {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
    selected
      ? "bg-[#dff2d7] font-bold text-[#0A3D27]"
      : "font-semibold text-[#456756] hover:bg-[#eef8e9] hover:text-[#0A3D27]"
  }`;
}

export default function PlantDiscoverySidebar({
  tags,
  selectedSection,
  selectedTagSlug,
}: PlantDiscoverySidebarProps) {
  const orderedTags = [...tags].sort((left, right) => left.order - right.order);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-emerald-950/10 bg-white/90 p-3 shadow-[0_16px_50px_rgb(36_75_54_/_7%)]">
        <div className="px-3 pb-2 pt-2">
          <p className="eyebrow">Browse by tag</p>
          <p className="mt-1 text-sm text-[#70857b]">Choose what matters to you.</p>
        </div>
        <nav className="mt-2 grid gap-1" aria-label="Plant discovery">
          {orderedTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/plants/tags/${encodeURIComponent(tag.slug)}`}
              className={navigationClass(selectedSection === "tag" && selectedTagSlug === tag.slug)}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eef8e9] text-[#2f6b4e]">
                <TagIcon icon={tag.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 truncate">{tag.name || "Plant tag"}</span>
            </Link>
          ))}
        </nav>

        <div className="my-3 border-t border-emerald-950/10" />
        <nav className="grid gap-1" aria-label="Plant library">
          <Link href="/families" className={navigationClass(selectedSection === "families")}>
            <Layers3 className="h-5 w-5" /> Families
          </Link>
          <Link href="/plants" className={navigationClass(selectedSection === "all")}>
            <Flower2 className="h-5 w-5" /> All plants
          </Link>
        </nav>
      </div>
    </aside>
  );
}
