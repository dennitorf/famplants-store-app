import Image from "next/image";
import Link from "next/link";

export default function PlantCategoryShop() {
    const plantCategories = [
        {
            name: "Air Purifying",
            image: "AIR_PURIFYING.jpg",
        },
        {
            name: "Pet Friendly",
            image: "PET_FRIENDLY.jpg",
        },
        {
            name: "Low Light",
            image: "low_light.jpg",
        },
        {
            name: "Easy Care",
            image: "EASY_CARE.jpg",
        },
    ];

    return (
        <section className="py-8">
            <h2 className="mb-5 text-center text-3xl font-bold text-foreground">Shop by Category</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {plantCategories.map((category) => (
                    <Link href="/plants" key={category.name} className="flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
                        <Image
                            src={`/img/${category.image}`}
                            alt={category.name}
                            width={256}
                            height={256}
                            className="h-64 w-64 object-cover"
                        />
                        <p className="text-center text-lg font-bold" style={{ color: "#15BC65" }}>
                            {category.name}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
