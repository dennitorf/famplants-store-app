import Link from "next/link";
import { ArrowLeft, Check, Leaf, PackageCheck, Sparkles } from "lucide-react";
import StoreShell from "@/app/components/layout/store-shell";
import { ErrorState } from "@/app/components/common/async-state";
import { ProductsService } from "@/utils/services/products/products-service";
import { errorMessage, plainText } from "@/lib/text";
import AddToCartButton from "@/app/components/cart/add-to-cart-button";
import RichHtml from "@/app/components/common/rich-html";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [product, images] = await Promise.all([
      ProductsService.getById(id),
      ProductsService.getImages(id).catch(() => []),
    ]);
    const image = images.find((item) => item.isPrimary) ?? images[0];
    const hasDiscount = product.discountAmount > 0 && product.effectivePrice < product.basePrice;

    return (
      <StoreShell>
        <div className="py-6"><Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]"><ArrowLeft className="h-4 w-4" /> Back to the shop</Link></div>
        <section className="grid gap-8 pb-12 lg:grid-cols-[1.05fr_.95fr]">
          <div className="overflow-hidden rounded-[2rem] bg-[#eaf4e5] lg:sticky lg:top-24 lg:h-fit">
            {image?.url || image?.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image.url || image.thumbnailUrl} alt={image.altText || product.name} className="aspect-square w-full object-cover" />
            ) : <div className="image-placeholder aspect-square">Product photo coming soon</div>}
          </div>
          <div className="py-3">
            <p className="eyebrow">{product.categoryName || "FamPlants shop"}</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl leading-tight text-[#0A3D27] md:text-6xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-[#557064]">{plainText(product.shortDescription) || "A thoughtfully selected FamPlants product."}</p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0A3D27]">${product.effectivePrice.toFixed(2)}</span>
              {hasDiscount ? <span className="text-lg text-[#7b8e84] line-through">${product.basePrice.toFixed(2)}</span> : null}
            </div>
            {product.appliedDeals?.length ? <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-900"><Sparkles className="h-4 w-4" />{product.appliedDeals.map((deal) => deal.name).join(", ")}</div> : null}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="detail-panel flex items-center gap-3 !p-4"><PackageCheck className="h-5 w-5 text-[#198754]" /><span className="font-bold text-[#254d3d]">{product.primaryStockLevel > 0 ? "Available now" : "Currently out of stock"}</span></div>
              <div className="detail-panel flex items-center gap-3 !p-4"><Check className="h-5 w-5 text-[#198754]" /><span className="font-bold text-[#254d3d]">SKU {product.sku}</span></div>
            </div>
            {product.plants?.length ? (
              <div className="detail-panel mt-7">
                <h2 className="flex items-center gap-2 text-xl font-bold text-[#153f2f]"><Leaf className="h-5 w-5" /> Plants included</h2>
                <ul className="mt-4 grid gap-2 text-[#557064]">
                  {product.plants.map((plant) => <li key={plant.id} className="flex justify-between gap-4"><Link href={`/plants/${plant.plantId}`} className="font-bold text-[#12613f] hover:underline">{plant.name}</Link><span>× {plant.quantity}</span></li>)}
                </ul>
              </div>
            ) : null}
            <AddToCartButton productId={product.id} name={product.name} sku={product.sku} unitPrice={product.effectivePrice} imageUrl={image?.thumbnailUrl || image?.url} disabled={product.primaryStockLevel <= 0} />
          </div>
        </section>
        {plainText(product.longDescription) ? <section className="mb-16 rounded-[2rem] border border-emerald-950/10 bg-white p-7 md:p-10"><p className="eyebrow">Product details</p><h2 className="mt-2 text-3xl font-bold text-[#0A3D27]">Description</h2><RichHtml content={product.longDescription ?? ""} className="mt-5" /></section> : null}
      </StoreShell>
    );
  } catch (error) {
    return <StoreShell><div className="py-14"><ErrorState message={errorMessage(error)} /></div></StoreShell>;
  }
}
