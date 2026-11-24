import Link from "next/link";
import DailyHeaderImage from "@/app/components/home/daily-header-image";
import { getDailyHeaderIndex } from "@/lib/daily-header";

export default function Header() {
  return (
    <section className="mt-2 overflow-hidden rounded-2xl bg-[#eef8e9]">
      <DailyHeaderImage initialIndex={getDailyHeaderIndex(new Date())} />
      <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <h1 className="font-[family-name:var(--font-joti-one)] text-3xl text-[#0A3D27] md:text-4xl">
            Grow your family garden today
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#456756] md:text-base">
            Discover healthy plants and bring nature into your home with FamPlants.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="/products" className="rounded-full bg-[#0A3D27] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#256044]">
            Shop now
          </Link>
          <Link href="/plants" className="rounded-full border border-[#0A3D27]/25 px-5 py-3 text-sm font-semibold text-[#0A3D27] transition-colors hover:bg-[#dff2d7]">
            Explore plants
          </Link>
        </div>
      </div>
    </section>
  );
}
