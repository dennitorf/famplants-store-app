import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Footer from "../../components/layout/footer";
import Header from "../../components/layout/header";
import SuperHeader from "../../components/layout/super-header";
import RevealOnScroll from "../../components/animations/reveal-on-scroll";
import ShareButton from "../../components/share/share-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import indexData from "@/utils/data/index.json";

type IndexPlant = {
  slug: string;
  name: string;
  jsonPath: string;
  coverImage: string | null;
  imageCount: number;
  sectionCount: number;
};

type PlantSectionBlock = {
  heading: string | null;
  body: string | null;
  images?: string[];
};

type PlantSection = {
  order: number;
  key: string;
  title: string;
  blocks: PlantSectionBlock[];
};

type PlantDetail = {
  meta?: {
    title?: string;
  };
  plant?: {
    name?: string;
    slug?: string;
  };
  content?: {
    sections?: PlantSection[];
  };
};

function cleanMarkdownText(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getPlantDetail(slug: string) {
  const plants = indexData as IndexPlant[];
  const match = plants.find((plant) => plant.slug === slug);

  if (!match) {
    return null;
  }

  const dataRoot = path.join(process.cwd(), "src", "utils", "data");
  const detailPath = path.join(dataRoot, match.jsonPath);
  const detailRaw = await readFile(detailPath, "utf8");
  const detail = JSON.parse(detailRaw) as PlantDetail;

  const plantName = detail.plant?.name ?? detail.meta?.title ?? match.name;

  return {
    plant: match,
    plantName,
    sections: detail.content?.sections ?? [],
  };
}

export async function generateStaticParams() {
  const plants = indexData as IndexPlant[];
  return plants.map((plant) => ({ slug: plant.slug }));
}

export default async function PlantCareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPlantDetail(slug);

  if (!data) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col">
      <SuperHeader />
      <Header />

      <section className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/plant-care">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{data.plantName}</h1>
              <Badge variant="secondary">{data.plant.sectionCount} sections</Badge>
              <Badge variant="outline">{data.plant.imageCount} images</Badge>
            </div>
            <ShareButton label={`Share ${data.plantName} care guide`} className="shrink-0" />
          </div>
        </RevealOnScroll>

        <div className="space-y-6">
          {data.sections.map((section, sectionIndex) => (
            <RevealOnScroll key={section.key} delayMs={sectionIndex * 70}>
              <Card id={section.key}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.blocks.map((block, index) => (
                    <article key={`${section.key}-${index}`} className="space-y-2">
                      {block.heading ? (
                        <h2 className="text-base font-semibold text-foreground">{block.heading}</h2>
                      ) : null}
                      {block.body ? (
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                          {cleanMarkdownText(block.body)}
                        </p>
                      ) : null}
                      {block.images?.length === 1 ? (
                        <div className="flex justify-center">
                          <img
                            src={`/${block.images[0]}`}
                            alt={data.plantName}
                            className="w-full max-w-md rounded-md border border-border object-cover"
                          />
                        </div>
                      ) : null}
                      {block.images && block.images.length > 1 ? (
                        <Carousel className="w-full" opts={{ align: "start" }}>
                          <CarouselContent>
                            {block.images.map((imagePath, imageIndex) => (
                              <CarouselItem key={`${imagePath}-${imageIndex}`} className="basis-1/2">
                                <img
                                  src={`/${imagePath}`}
                                  alt={data.plantName}
                                  className="h-full w-full rounded-md border border-border object-cover"
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </Carousel>
                      ) : null}
                    </article>
                  ))}
                </CardContent>
              </Card>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
