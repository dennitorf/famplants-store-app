import Image from "next/image";
import { Star } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const bestSellers = [
    {
        name: "Emerald Fern",
        image: "SELLER1.png",
        rating: 4.8,
        price: 24.99,
    },
    {
        name: "Moonlight Pothos",
        image: "SELLER2.png",
        rating: 4.3,
        price: 31.5,
    },
    {
        name: "Velvet Monstera",
        image: "SELLER3.png",
        rating: 4.9,
        price: 42.75,
    },
    {
        name: "Golden Snake Plant",
        image: "SELLER4.png",
        rating: 4.5,
        price: 27.4,
    },
    {
        name: "Pearl Peace Lily",
        image: "SELLER5.png",
        rating: 4.6,
        price: 36.2,
    },
];

export default function BestSellers() {
    return (
        <section className="py-10">
            <h2 className="mb-6 text-center text-3xl font-bold text-foreground">Best Sellers</h2>

            <Carousel opts={{ align: "start", loop: true }} className="mx-12">
                <CarouselContent>
                    {bestSellers.map((plant) => (
                        <CarouselItem key={plant.name} className="basis-1/3">
                            <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
                                <Image
                                    src={`/img/${plant.image}`}
                                    alt={plant.name}
                                    width={360}
                                    height={360}
                                    className="h-56 w-full object-cover"
                                />

                                <div className="flex flex-1 flex-col p-4">
                                    <h3 className="text-lg font-bold text-foreground">{plant.name}</h3>
                                    <p className="mt-1 text-base font-bold text-foreground">
                                        ${plant.price.toFixed(2)}
                                    </p>

                                    <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span>{plant.rating.toFixed(1)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="mt-auto rounded-md bg-[#0A3D27] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                                    >
                                        Shop now
                                    </button>
                                </div>
                            </article>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    );
}