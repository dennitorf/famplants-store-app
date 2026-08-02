import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PlantCollection } from "@/models/plants/collection";
import { plainText } from "@/lib/text";
import CatalogImage from "@/app/components/common/catalog-image";

export default function CollectionCard({ collection }: { collection: PlantCollection }) {
  const image = collection.mainImage?.thumbnailUrl
    || collection.mainImage?.url
    || collection.thumbnailUrl;

  return (
    <article className="catalog-card group">
      <Link href={`/collections/${collection.slug || collection.id}`} className="block">
        <div className="catalog-image">
          <CatalogImage
            src={image}
            alt={collection.mainImage?.altText || collection.name || "Plant collection"}
            placeholderLabel="Collection photo coming soon"
          />
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Curated collection</p>
              <h2 className="mt-1 text-xl font-bold text-[#153f2f]">
                {collection.name || "Unnamed collection"}
              </h2>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-[#4d725f] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#637b70]">
            {plainText(collection.shortDescription || collection.description) || "Explore this plant collection."}
          </p>
        </div>
      </Link>
    </article>
  );
}
