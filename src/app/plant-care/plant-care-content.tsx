"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Plant } from "@/models/plants/plant";
import CatalogImage from "@/app/components/common/catalog-image";
import { EmptyState } from "@/app/components/common/async-state";

export default function PlantCareContent({ plants }: { plants: Plant[] }) {
  const [search, setSearch] = useState("");
  const filteredPlants = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return term ? plants.filter((plant) => plant.name?.toLocaleLowerCase().includes(term)) : plants;
  }, [plants, search]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <label className="w-full sm:max-w-sm">
          <span className="mb-2 block text-sm font-bold text-[#153f2f]">Find your plant</span>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plants by name…" className="form-input" />
        </label>
        <p role="status" className="text-sm text-[#557064]">{filteredPlants.length} {filteredPlants.length === 1 ? "plant" : "plants"}</p>
      </div>
      {filteredPlants.length ? (
        <div className="catalog-grid">
          {filteredPlants.map((plant) => (
            <article key={plant.id} className="catalog-card">
              <Link href={`/plant-care/${encodeURIComponent(plant.slug)}`} className="block">
                <div className="catalog-image">
                  <CatalogImage src={plant.mainImage?.thumbnailUrl || plant.mainImage?.url || plant.thumbnailUrl || plant.url} alt={plant.mainImage?.altText || plant.altText || plant.name || "Plant"} placeholderLabel="Plant photo coming soon" />
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-bold text-[#153f2f]">{plant.name || "Unnamed plant"}</h2>
                  <p className="mt-3 font-semibold text-[#12613f]">Explore care guidance →</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : <EmptyState title={search.trim() ? "No matching plants" : "No public plants yet"} description={search.trim() ? "Try another plant name or clear the search." : "Published plants will appear here as the catalog grows."} />}
    </>
  );
}
