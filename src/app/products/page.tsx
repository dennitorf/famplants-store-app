import StoreShell from "@/app/components/layout/store-shell";
import PageHero from "@/app/components/common/page-hero";
import ProductCard from "@/app/components/common/product-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import ShopDiscoverySidebar from "@/app/components/products/shop-discovery-sidebar";
import { ProductsService } from "@/utils/services/products/products-service";
import { ProductCategoriesService } from "@/utils/services/products/categories-service";
import { ProductImagesService } from "@/utils/services/products/product-images-service";
import { ProductTagsService } from "@/utils/services/products/product-tags-service";
import { ProductTagsCatalogService } from "@/utils/services/products/tags-service";
import { loadResult } from "@/lib/result";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; tag?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: requestedCategoryId, tag: selectedTagId } = await searchParams;
  const selectedCategoryId = selectedTagId ? undefined : requestedCategoryId;
  const [categoriesResult, tagsResult, productsResult] = await Promise.all([
    loadResult(ProductCategoriesService.getAll(1, 60)),
    loadResult(ProductTagsCatalogService.getAll(1, 100)),
    selectedTagId
      ? loadResult(ProductTagsService.getProductsByTag(selectedTagId))
      : loadResult(ProductsService.getAll(1, 60)),
  ]);

  const tags = tagsResult.data?.data ?? [];
  const categories = categoriesResult.data?.data ?? [];
  const selectedTag = tags.find((tag) => tag.id === selectedTagId);
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
  const catalogProducts = productsResult.data === null
    ? []
    : Array.isArray(productsResult.data)
      ? productsResult.data
      : productsResult.data.data;
  const detailedProducts = selectedTagId
    ? await Promise.all(
        catalogProducts.map((product) => ProductsService.getById(product.id).catch(() => product)),
      )
    : catalogProducts;
  const products = selectedCategoryId
    ? detailedProducts.filter((product) => product.categoryId === selectedCategoryId)
    : detailedProducts;
  const imageEntries = await Promise.all(
    products.map(async (product) => [
      product.id,
      (await ProductImagesService.getAll(product.id).catch(() => []))[0],
    ] as const),
  );
  const images = new Map(imageEntries);

  return (
    <StoreShell>
      <PageHero
        eyebrow={selectedTag ? "Products by tag" : selectedCategory ? "Product category" : "FamPlants shop"}
        title={selectedTag?.name || selectedCategory?.name || "Plant care, thoughtfully bundled."}
        description={selectedTag?.description || selectedCategory?.description || "Discover live plants, kits, and supplies from the public product catalog. Browse freely—sign in only when you need your personal garden."}
      />
      {tagsResult.error ? <div className="mb-8"><ErrorState message={tagsResult.error} /></div> : null}
      {categoriesResult.error ? <div className="mb-8"><ErrorState message={categoriesResult.error} /></div> : null}
      <div className="grid gap-8 pb-12 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <ShopDiscoverySidebar
          categories={categories}
          tags={tags}
          selectedSection={selectedTagId ? "tag" : selectedCategoryId ? "category" : "all"}
          selectedCategoryId={selectedCategoryId}
          selectedTagId={selectedTagId}
        />
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Shop</p>
              <h2 className="mt-1 text-2xl font-bold text-[#153f2f]">
                {selectedTag?.name || selectedCategory?.name || "All products"}
              </h2>
            </div>
            <p className="text-sm text-[#637b70]">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
          {productsResult.error ? (
            <ErrorState message={productsResult.error} />
          ) : products.length ? (
            <div className="catalog-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} image={images.get(product.id)} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                selectedTag
                  ? `No products tagged ${selectedTag.name || "this way"}`
                  : selectedCategory
                    ? `No products in ${selectedCategory.name}`
                    : "The shop is being stocked"
              }
              description={
                selectedTag || selectedCategory
                  ? "Try another option or browse all published products."
                  : "Published products will appear here soon."
              }
            />
          )}
        </section>
      </div>
    </StoreShell>
  );
}
