import Link from "next/link";
import ProductCard from "@/app/components/common/product-card";
import { EmptyState, ErrorState } from "@/app/components/common/async-state";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/models/products/product";
import type { ProductImage } from "@/models/products/product-image";

interface FeaturedProductsProps {
  products: Product[];
  images: Map<string, ProductImage | undefined>;
  error?: string;
}

export default function FeaturedProducts({ products, images, error }: FeaturedProductsProps) {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">FamPlants shop</p>
          <h2 className="mt-1 text-3xl font-bold text-foreground">Featured products</h2>
        </div>
        <Link href="/products" className="text-sm font-bold text-[#12613f] hover:underline">
          View all products
        </Link>
      </div>

      {error ? (
        <ErrorState message={error} />
      ) : products.length ? (
        <Carousel opts={{ align: "start", loop: products.length > 3 }} className="mx-10 sm:mx-12">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
                <ProductCard product={product} image={images.get(product.id)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <EmptyState title="The shop is being stocked" description="Published products will appear here soon." />
      )}
    </section>
  );
}
