import Club from "../components/club/club";
import FeaturedPlants from "../components/home/featured-plants";
import FeaturedProducts from "../components/home/featured-products";
import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import SiteHeader from "../components/layout/site-header";
import PlantCategoryShop from "../components/plant-categories/shop-plant-categories";
import OurPromise from "../components/promise/our-promise";
import { loadResult } from "@/lib/result";
import { FamiliesService } from "@/utils/services/plants/families-service";
import { PlantsService } from "@/utils/services/plants/plants-service";
import { ProductsService } from "@/utils/services/products/products-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [familiesResult, plantsResult, productsResult] = await Promise.all([
    loadResult(FamiliesService.getAll(1, 4)),
    loadResult(PlantsService.getAll(1, 4)),
    loadResult(ProductsService.getAll(1, 6)),
  ]);

  const products = productsResult.data?.data ?? [];
  const productImageEntries = await Promise.all(
    products.map(async (product) => [
      product.id,
      (await ProductsService.getImages(product.id).catch(() => []))[0],
    ] as const),
  );

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />
      <Header />
      <PlantCategoryShop
        families={familiesResult.data?.data ?? []}
        error={familiesResult.error ?? undefined}
      />
      <FeaturedPlants
        plants={plantsResult.data?.data ?? []}
        error={plantsResult.error ?? undefined}
      />
      <OurPromise />
      <FeaturedProducts
        products={products}
        images={new Map(productImageEntries)}
        error={productsResult.error ?? undefined}
      />
      <Club />
      <Footer />
    </main>
  );
}
