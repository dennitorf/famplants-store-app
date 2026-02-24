"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import RevealOnScroll from "../components/animations/reveal-on-scroll";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PlantCard = {
  slug: string;
  name: string;
  coverImage: string | null;
  imageCount: number;
  sectionCount: number;
};

type PlantCareContentProps = {
  plants: PlantCard[];
};

export default function PlantCareContent({ plants }: PlantCareContentProps) {
  const [search, setSearch] = useState("");

  const filteredPlants = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return plants;
    }

    return plants.filter((plant) => plant.name.toLowerCase().includes(term));
  }, [plants, search]);

  return (
    <>
      <RevealOnScroll>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Plant Care Guides</h1>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plants..."
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring sm:w-72"
            aria-label="Search plants"
          />
        </div>
      </RevealOnScroll>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlants.map((plant, index) => (
          <RevealOnScroll key={plant.slug} delayMs={index * 50}>
            <Card className="relative w-full overflow-hidden pt-0">
              {plant.coverImage ? (
                <img
                  src={`/${plant.coverImage}`}
                  alt={plant.name}
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <div className="aspect-video w-full bg-muted" />
              )}

              <CardHeader>
                <CardAction>
                  <Badge variant="secondary">{plant.sectionCount} sections</Badge>
                </CardAction>
                <CardTitle>{plant.name}</CardTitle>
                <CardDescription>{plant.imageCount} images available</CardDescription>
              </CardHeader>

              <CardFooter>
                <Button className="w-full bg-[#15BC65] text-white hover:bg-[#13a95b]" asChild>
                  <Link href={`/plant-care/${plant.slug}`}>View Care Guide</Link>
                </Button>
              </CardFooter>
            </Card>
          </RevealOnScroll>
        ))}
      </div>
    </>
  );
}
