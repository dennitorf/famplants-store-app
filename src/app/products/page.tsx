import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import ProductCard from "@/app/components/common/product-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import { ProductsService, ProductCategoriesService } from "@/utils/services/products/products-service";
import { loadResult } from "@/lib/result";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const result = await loadResult(Promise.all([
      ProductsService.getAll(1, 60),
      ProductCategoriesService.getAll(1, 60),
    ]));
  if (result.data === null) {
    return <StoreShell><PageHero eyebrow="FamPlants shop" title="Plant care, thoughtfully bundled." description="Live plants, kits, and supplies." /><ErrorState message={result.error} /></StoreShell>;
  }
  const [products, categories] = result.data;
  const imageEntries = await Promise.all(
    products.data.map(async (product) => [
        product.id,
        (await ProductsService.getImages(product.id).catch(() => []))[0],
      ] as const),
  );
  const images = new Map(imageEntries);
  return (
    <StoreShell>
        <PageHero eyebrow="FamPlants shop" title="Plant care, thoughtfully bundled." description="Discover live plants, kits, and supplies from the public product catalog. Browse freely—sign in only when you need your personal garden." />
        {categories.data.length ? (
          <div className="mb-7 flex flex-wrap gap-2">
            <span className="trait-pill bg-[#0A3D27] !text-white">All products</span>
            {categories.data.map((category) => <span key={category.id} className="trait-pill">{category.name}</span>)}
          </div>
        ) : null}
        {products.data.length ? (
          <section className="catalog-grid pb-12">
            {products.data.map((product) => <ProductCard key={product.id} product={product} image={images.get(product.id)} />)}
          </section>
        ) : <EmptyState title="The shop is being stocked" description="Published products will appear here soon." />}
    </StoreShell>
  );
}
