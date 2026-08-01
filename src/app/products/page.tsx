import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import ProductCard from "@/app/components/common/product-card";
import CatalogTagFilters from "@/app/components/common/catalog-tag-filters";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import { ProductsService, ProductCategoriesService } from "@/utils/services/products/products-service";
import { ProductTagsService } from "@/utils/services/products/product-tags-service";
import { loadResult } from "@/lib/result";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { tag: selectedTagId } = await searchParams;
  const [categoriesResult, tagsResult, productsResult] = await Promise.all([
    loadResult(ProductCategoriesService.getAll(1, 60)),
    loadResult(ProductTagsService.getAll(1, 100)),
    selectedTagId
      ? loadResult(ProductTagsService.getProductsByTag(selectedTagId))
      : loadResult(ProductsService.getAll(1, 60)),
  ]);

  const tags = tagsResult.data?.data ?? [];
  const selectedTag = tags.find((tag) => tag.id === selectedTagId);
  const catalogProducts = productsResult.data === null
    ? []
    : Array.isArray(productsResult.data)
      ? productsResult.data
      : productsResult.data.data;
  const products = selectedTagId
    ? await Promise.all(
        catalogProducts.map((product) => ProductsService.getById(product.id).catch(() => product)),
      )
    : catalogProducts;
  const imageEntries = await Promise.all(
    products.map(async (product) => [
      product.id,
      (await ProductsService.getImages(product.id).catch(() => []))[0],
    ] as const),
  );
  const images = new Map(imageEntries);

  return (
    <StoreShell>
      <PageHero
        eyebrow={selectedTag ? "Product collection" : "FamPlants shop"}
        title={selectedTag?.name || "Plant care, thoughtfully bundled."}
        description={selectedTag?.description || "Discover live plants, kits, and supplies from the public product catalog. Browse freely—sign in only when you need your personal garden."}
      />
      {tagsResult.data ? (
        <CatalogTagFilters
          basePath="/products"
          tags={tags}
          selectedTagId={selectedTagId}
          allLabel="All products"
        />
      ) : null}
      {tagsResult.error ? <div className="mb-8"><ErrorState message={tagsResult.error} /></div> : null}
      {categoriesResult.data?.data.length ? (
        <div className="mb-7 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">Categories</span>
          {categoriesResult.data.data.map((category) => <span key={category.id} className="trait-pill">{category.name}</span>)}
        </div>
      ) : null}
      {categoriesResult.error ? <div className="mb-8"><ErrorState message={categoriesResult.error} /></div> : null}
      {productsResult.error ? (
        <div className="pb-12"><ErrorState message={productsResult.error} /></div>
      ) : products.length ? (
        <section className="catalog-grid pb-12">
          {products.map((product) => <ProductCard key={product.id} product={product} image={images.get(product.id)} />)}
        </section>
      ) : (
        <div className="pb-12">
          <EmptyState
            title={selectedTag ? `No products in ${selectedTag.name || "this collection"}` : "The shop is being stocked"}
            description={selectedTag ? "Try another tag or browse all published products." : "Published products will appear here soon."}
          />
        </div>
      )}
    </StoreShell>
  );
}
