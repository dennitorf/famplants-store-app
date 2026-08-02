import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Family } from "@/models/plants/family";
import { plainText } from "@/lib/text";
import CatalogImage from "@/app/components/common/catalog-image";

export default function FamilyCard({ family }: { family: Family }) {
  const image = family.mainImage?.thumbnailUrl
    || family.mainImage?.url
    || family.thumbnailUrl
    || family.url;

  return (
    <article className="catalog-card group">
      <Link href={`/families/${family.id}`}>
        <div className="catalog-image">
          <CatalogImage
            src={image}
            alt={family.mainImage?.altText || family.altText || family.name || "Plant family"}
            placeholderLabel="Family photo coming soon"
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-[#153f2f]">
              {family.name || "Unnamed family"}
            </h2>
            <ArrowUpRight className="h-5 w-5 text-[#4d725f] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#637b70]">
            {plainText(family.mustKnow) || "Explore the plants in this family."}
          </p>
        </div>
      </Link>
    </article>
  );
}
