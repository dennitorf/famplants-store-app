import Link from "next/link";
import { Grid2X2, PackageOpen } from "lucide-react";
import TagIcon from "@/app/components/plants/tag-icon";
import type { ProductCategory } from "@/models/products/category";
import type { ProductTagDefinition } from "@/models/products/tag";

type SelectedSection = "all" | "category" | "tag";

interface ShopDiscoverySidebarProps {
  categories: ProductCategory[];
  tags: ProductTagDefinition[];
  selectedSection: SelectedSection;
  selectedCategorySlug?: string;
  selectedTagSlug?: string;
}

function navigationClass(selected: boolean): string {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
    selected
      ? "bg-[#dff2d7] font-bold text-[#0A3D27]"
      : "font-semibold text-[#456756] hover:bg-[#eef8e9] hover:text-[#0A3D27]"
  }`;
}

export default function ShopDiscoverySidebar({
  categories,
  tags,
  selectedSection,
  selectedCategorySlug,
  selectedTagSlug,
}: ShopDiscoverySidebarProps) {
  const orderedCategories = [...categories].sort((left, right) => left.name.localeCompare(right.name));
  const orderedTags = [...tags].sort((left, right) => left.order - right.order);

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-emerald-950/10 bg-white/90 p-3 shadow-[0_16px_50px_rgb(36_75_54_/_7%)]">
        <div className="px-3 pb-2 pt-2">
          <p className="eyebrow">Shop navigation</p>
          <p className="mt-1 text-sm text-[#70857b]">Find products by category or tag.</p>
        </div>

        <nav className="mt-2 grid gap-1" aria-label="All shop products">
          <Link href="/products" className={navigationClass(selectedSection === "all")}>
            <PackageOpen className="h-5 w-5" /> All products
          </Link>
        </nav>

        {categories.length ? (
          <>
            <div className="my-3 border-t border-emerald-950/10" />
            <div className="px-3 pb-2">
              <p className="eyebrow">Categories</p>
            </div>
            <nav className="grid gap-1" aria-label="Product categories">
              {orderedCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products/categories/${encodeURIComponent(category.slug)}`}
                  className={navigationClass(
                    selectedSection === "category" && selectedCategorySlug === category.slug,
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eef8e9] text-[#2f6b4e]">
                    <Grid2X2 className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 truncate">{category.name}</span>
                </Link>
              ))}
            </nav>
          </>
        ) : null}

        {tags.length ? (
          <>
            <div className="my-3 border-t border-emerald-950/10" />
            <div className="px-3 pb-2">
              <p className="eyebrow">Tags</p>
            </div>
            <nav className="grid gap-1" aria-label="Product tags">
              {orderedTags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/products/tags/${encodeURIComponent(tag.slug)}`}
                  className={navigationClass(selectedSection === "tag" && selectedTagSlug === tag.slug)}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#eef8e9] text-[#2f6b4e]">
                    <TagIcon icon={tag.icon} className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 truncate">{tag.name || "Product tag"}</span>
                </Link>
              ))}
            </nav>
          </>
        ) : null}
      </div>
    </aside>
  );
}
