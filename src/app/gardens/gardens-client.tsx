"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Flower2, MapPin, Plus, X } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/app/components/common/async-state";
import type { Garden, LookupOption } from "@/models/api";
import { GardenLookupsService, GardensService } from "@/utils/services/gardens/gardens-service";
import { errorMessage } from "@/lib/text";

export default function GardensClient() {
  const searchParams = useSearchParams();
  const selectedPlantId = searchParams.get("plantId");
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [locations, setLocations] = useState<LookupOption[]>([]);
  const [visibilities, setVisibilities] = useState<LookupOption<number>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [gardenData, locationData, visibilityData] = await Promise.all([
        GardensService.getAll(),
        GardenLookupsService.getLocations(),
        GardenLookupsService.getVisibilities(),
      ]);
      setGardens(gardenData);
      setLocations(locationData);
      setVisibilities(visibilityData);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function createGarden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(undefined);
    const form = new FormData(event.currentTarget);
    try {
      const garden = await GardensService.create({
        name: String(form.get("name") || ""),
        description: String(form.get("description") || ""),
        visibilityId: Number(form.get("visibilityId") || 1),
        locationId: String(form.get("locationId") || "") || undefined,
      });
      setGardens((items) => [garden, ...items]);
      setShowForm(false);
    } catch (saveError) {
      setError(errorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <LoadingState label="Opening your gardens…" />;

  return (
    <section className="pb-12">
      {selectedPlantId ? (
        <div className="mb-6 rounded-2xl border border-[#b7dca9] bg-[#eef9e9] p-4 text-[#285641]">
          Choose a garden below to finish adding the selected plant.
        </div>
      ) : null}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="eyebrow">My collection</p><h2 className="mt-1 text-3xl font-bold text-[#153f2f]">Your gardens</h2></div>
        <button type="button" onClick={() => setShowForm(true)} className="auth-button auth-button-primary"><Plus className="h-4 w-4" /> Create garden</button>
      </div>
      {error ? <div className="mb-5"><ErrorState message={error} /></div> : null}
      {gardens.length ? (
        <div className="catalog-grid">
          {gardens.map((garden, index) => (
            <article key={garden.id} className="catalog-card">
              <div className={`h-36 p-5 ${index % 3 === 0 ? "bg-[#dcefd4]" : index % 3 === 1 ? "bg-[#f0e6c8]" : "bg-[#dcebe6]"}`}>
                <Flower2 className="h-10 w-10 text-[#17633f]" />
              </div>
              <div className="p-5">
                <p className="eyebrow">{garden.visibilityName || "Personal garden"}</p>
                <h3 className="mt-1 text-2xl font-bold text-[#153f2f]">{garden.name || "My garden"}</h3>
                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#637b70]">{garden.description || "A space for the plants you care about."}</p>
                {garden.locationName ? <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#557064]"><MapPin className="h-4 w-4" />{garden.locationName}</p> : null}
                <Link href={`/gardens/${garden.id}${selectedPlantId ? `?plantId=${selectedPlantId}` : ""}`} className="mt-5 inline-flex items-center gap-2 font-bold text-[#12613f]">Open garden <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : <EmptyState title="Create your first garden" description="Group plants by room, patio, yard, or any growing space that feels natural to you." />}

      {showForm ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#09291d]/50 p-4 backdrop-blur-sm">
          <form onSubmit={createGarden} className="w-full max-w-lg rounded-[2rem] bg-[#fbfdf8] p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">New growing space</p><h2 className="mt-1 text-2xl font-bold text-[#153f2f]">Create a garden</h2></div><button type="button" onClick={() => setShowForm(false)} className="grid h-9 w-9 place-items-center rounded-full border"><X className="h-4 w-4" /></button></div>
            <div className="mt-6 grid gap-4">
              <div className="form-field"><label htmlFor="garden-name">Name</label><input id="garden-name" name="name" required className="form-input" placeholder="Kitchen window" /></div>
              <div className="form-field"><label htmlFor="garden-description">Description</label><textarea id="garden-description" name="description" className="form-input min-h-24" placeholder="What makes this space special?" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="form-field"><label htmlFor="garden-location">Location</label><select id="garden-location" name="locationId" className="form-input"><option value="">Choose a location</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
                <div className="form-field"><label htmlFor="garden-visibility">Visibility</label><select id="garden-visibility" name="visibilityId" className="form-input">{visibilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="auth-button auth-button-primary mt-6 w-full">{isSaving ? "Creating…" : "Create garden"}</button>
          </form>
        </div>
      ) : null}
    </section>
  );
}
