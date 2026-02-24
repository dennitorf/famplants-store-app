import Link from "next/link";
import { BookOpen, Headset, ShieldCheck } from "lucide-react";

const promises = [
    {
        title: "Healthy Plant Guarantee",
        description: "Every plant is quality-checked before it reaches your home.",
        href: "#",
        Icon: ShieldCheck,
    },
    {
        title: "Detailed Care Instructions",
        description: "Simple, practical guidance to keep your plants thriving.",
        href: "/plant-care",
        Icon: BookOpen,
    },
    {
        title: "Lifetime Support",
        description: "Get help from our team whenever your plant needs extra care.",
        href: "#",
        Icon: Headset,
    },
];

export default function OurPromise() {
    return (
        <section className="py-10">
            <h2 className="mb-6 text-center text-3xl font-bold text-foreground">Our Promise</h2>

            <div className="grid gap-5 md:grid-cols-3">
                {promises.map(({ title, description, href, Icon }) => (
                    <Link
                        href={href}
                        key={title}
                        className="block rounded-lg"
                    >
                        <article className="flex flex-col items-center rounded-lg border border-border p-6 text-center">
                            <Icon className="mb-3 h-9 w-9 text-[#15BC65]" />
                            <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    );
}