import Link from "next/link";
import { ArrowUpRight, PackageCheck, Tags } from "lucide-react";
import type { Product } from "@/models/products/product";
import type { ProductImage } from "@/models/products/product-image";
import CatalogImage from "@/app/components/common/catalog-image";

export default function ProductCard({ product, image }: { product: Product; image?: ProductImage }) {
  const hasDiscount = product.discountAmount > 0 && product.effectivePrice < product.basePrice;

  return (
    <article className="catalog-card group">
      <Link href={`/products/${product.slug}`}>
        <div className="catalog-image relative">
          <CatalogImage
            src={image?.thumbnailUrl || image?.url}
            alt={image?.altText || product.name}
            placeholderLabel="Product photo coming soon"
          />
          {hasDiscount ? <span className="absolute left-4 top-4 rounded-full bg-[#f2b84b] px-3 py-1 text-xs font-extrabold text-[#573c00]">Save ${product.discountAmount.toFixed(2)}</span> : null}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">{product.categoryName || product.typeName || "FamPlants shop"}</p>
              <h2 className="mt-1 text-xl font-bold text-[#153f2f]">{product.name}</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#4d725f] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#637b70]">{product.shortDescription || "Everything you need to help your plants thrive."}</p>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-[#0A3D27]">${product.effectivePrice.toFixed(2)}</span>
              {hasDiscount ? <span className="text-sm text-[#7b8e84] line-through">${product.basePrice.toFixed(2)}</span> : null}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#557064]">
              {product.primaryStockLevel > 0 ? <PackageCheck className="h-4 w-4" /> : <Tags className="h-4 w-4" />}
              {product.primaryStockLevel > 0 ? "Available" : "Out of stock"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
