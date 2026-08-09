import ProductCard from "@/app/components/common/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/models/products/product";
import type { ProductImage } from "@/models/products/product-image";

export interface RelatedProductItem {
  product: Product;
  image?: ProductImage;
}

export default function RelatedProductsCarousel({
  items,
  plantName,
}: {
  items: RelatedProductItem[];
  plantName: string;
}) {
  if (!items.length) return null;

  return (
    <section className="border-t border-emerald-950/10 py-12" aria-labelledby="related-products-heading">
      <Carousel opts={{ align: "start", loop: items.length > 3 }} className="w-full">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">FamPlants shop</p>
            <h2 id="related-products-heading" className="mt-1 text-3xl font-bold text-foreground">
              Products for {plantName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#637b70]">
              Supplies and products associated with this plant.
            </p>
          </div>
          <div className="flex shrink-0 gap-2" aria-label="Related product navigation">
            <CarouselPrevious className="static size-10 translate-x-0 translate-y-0" />
            <CarouselNext className="static size-10 translate-x-0 translate-y-0" />
          </div>
        </div>
        <CarouselContent>
          {items.map(({ product, image }) => (
            <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
              <ProductCard
                product={product}
                image={image}
                className="h-[31rem]"
                imageClassName="h-60 !aspect-auto"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
