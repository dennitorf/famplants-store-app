import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";

import Footer from "../components/layout/footer";
import Header from "../components/layout/header";
import SuperHeader from "../components/layout/super-header";
import PlantCareContent from "./plant-care-content";
import indexData from "@/utils/data/index.json";

type IndexPlant = {
  slug: string;
  name: string;
  jsonPath: string;
  coverImage: string | null;
  imageCount: number;
  sectionCount: number;
};

type PlantDetail = {
  meta?: {
    title?: string;
  };
  plant?: {
    name?: string;
  };
};

type PlantCard = {
  slug: string;
  name: string;
  coverImage: string | null;
  imageCount: number;
  sectionCount: number;
};

async function getPlantCards(): Promise<PlantCard[]> {
  const plants = indexData as IndexPlant[];
  const dataRoot = path.join(process.cwd(), "src", "utils", "data");

  return Promise.all(
    plants.map(async (plant) => {
      const detailPath = path.join(dataRoot, plant.jsonPath);
      const detailRaw = await readFile(detailPath, "utf8");
      const detail = JSON.parse(detailRaw) as PlantDetail;
      const detailName = detail.plant?.name ?? detail.meta?.title ?? plant.name;

      return {
        slug: plant.slug,
        name: detailName,
        coverImage: plant.coverImage,
        imageCount: plant.imageCount,
        sectionCount: plant.sectionCount,
      };
    })
  );
}

export default async function Page() {
  const plants = await getPlantCards();

  return (
    <main className="flex min-h-screen flex-col">
      <SuperHeader />
      <Header />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PlantCareContent plants={plants} />
      </section>

      <Footer />
    </main>
  );
}