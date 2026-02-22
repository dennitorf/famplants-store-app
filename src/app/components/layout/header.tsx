export default function Header() {
    return (
        <section
            className="relative mt-2 min-h-[300px] overflow-hidden rounded-xl bg-cover bg-center"
            style={{ backgroundImage: "url('/img/BANNER1.png')" }}
        >
            <div className="absolute inset-0 bg-black/25" />

            <div className="relative flex h-full min-h-[300px] flex-col justify-start gap-4 p-6 md:p-8">
                <h1 className="max-w-xl font-[family-name:var(--font-joti-one)] text-3xl font-bold text-white md:text-4xl">
                    Grow your family garden today
                </h1>
                <p className="max-w-lg text-sm text-white/90 md:text-base">
                    Discover healthy plants and bring nature into your home with FamPlants.
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="rounded-md bg-[#0A3D27] px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                    >
                        Shop now
                    </button>
                    <button
                        type="button"
                        className="rounded-md border border-white/60 bg-transparent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        Learn more
                    </button>
                </div>
            </div>
        </section>
    );
}