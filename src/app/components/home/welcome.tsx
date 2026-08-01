import Image from "next/image";

export default function Welcome() {
    return (
        <section className="flex min-h-screen w-full">
            <div className="flex w-1/2 items-center justify-center px-10">
                <div className="flex flex-col items-center gap-3">
                    <h1 className="font-[family-name:var(--font-joti-one)] text-5xl text-chart-2 md:text-6xl">
                        Welcome
                    </h1>
                    <p className="font-[family-name:var(--font-karla)] text-lg font-bold text-foreground md:text-xl">
                        Grow in family
                    </p>
                </div>
            </div>

            <div className="relative w-1/2">
                <Image
                    src="/img/WELCOME1.png"
                    alt="Welcome"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover object-right"
                />
            </div>
        </section>
    );
}
