"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Edit3, Flower2, HeartPulse, MapPin, Plus, Trash2, X } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/app/components/common/async-state";
import type { LookupOption } from "@/models/common/lookup-option";
import type { Garden } from "@/models/gardens/garden";
import type { GardenPlant } from "@/models/gardens/garden-plant";
import type { Plant } from "@/models/plants/plant";
import { GardenLookupsService } from "@/utils/services/gardens/garden-lookups-service";
import { GardenPlantsService } from "@/utils/services/gardens/garden-plants-service";
import { GardensService } from "@/utils/services/gardens/gardens-service";
import { PlantsService } from "@/utils/services/plants/plants-service";
import { errorMessage } from "@/lib/text";

export default function GardenDetailClient({ gardenId }: { gardenId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlantId = searchParams.get("plantId") ?? "";
  const [garden, setGarden] = useState<Garden>();
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([]);
  const [catalogPlants, setCatalogPlants] = useState<Plant[]>([]);
  const [locations, setLocations] = useState<LookupOption[]>([]);
  const [visibilities, setVisibilities] = useState<LookupOption<number>[]>([]);
  const [statuses, setStatuses] = useState<LookupOption<number>[]>([]);
  const [healthStatuses, setHealthStatuses] = useState<LookupOption<number>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showGardenForm, setShowGardenForm] = useState(false);
  const [showPlantForm, setShowPlantForm] = useState(Boolean(requestedPlantId));
  const [editingPlant, setEditingPlant] = useState<GardenPlant>();
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [gardenData, gardenPlantData, plantData, locationData, visibilityData, statusData, healthData] = await Promise.all([
        GardensService.getById(gardenId),
        GardenPlantsService.getAll(gardenId),
        PlantsService.getAll(1, 100),
        GardenLookupsService.getLocations(),
        GardenLookupsService.getVisibilities(),
        GardenLookupsService.getPlantStatuses(),
        GardenLookupsService.getHealthStatuses(),
      ]);
      setGarden(gardenData);
      setGardenPlants(gardenPlantData);
      setCatalogPlants(plantData.data);
      setLocations(locationData);
      setVisibilities(visibilityData);
      setStatuses(statusData);
      setHealthStatuses(healthData);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [gardenId]);

  useEffect(() => { void load(); }, [load]);

  const availablePlants = useMemo(() => {
    const existing = new Set(gardenPlants.map((item) => item.plantId));
    return catalogPlants.filter((item) => !existing.has(item.id) || item.id === editingPlant?.plantId);
  }, [catalogPlants, editingPlant?.plantId, gardenPlants]);

  async function saveGarden(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!garden) return;
    const form = new FormData(event.currentTarget);
    setIsSaving(true);
    try {
      const updated = await GardensService.update(garden.id, {
        name: String(form.get("name") || ""),
        description: String(form.get("description") || ""),
        visibilityId: Number(form.get("visibilityId") || garden.visibilityId),
        locationId: String(form.get("locationId") || "") || undefined,
      });
      setGarden(updated);
      setShowGardenForm(false);
    } catch (saveError) { setError(errorMessage(saveError)); }
    finally { setIsSaving(false); }
  }

  async function savePlant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const plantId = String(form.get("plantId") || "");
    const payload = {
      gardenId,
      plantId,
      locationId: String(form.get("locationId") || ""),
      acquiredDate: new Date(String(form.get("acquiredDate"))).toISOString(),
      nickName: String(form.get("nickName") || "") || undefined,
      notes: String(form.get("notes") || "") || undefined,
      statusId: Number(form.get("statusId")) || undefined,
      healthStatusId: Number(form.get("healthStatusId")) || undefined,
    };
    setIsSaving(true);
    try {
      if (editingPlant) await GardenPlantsService.update(gardenId, editingPlant.id, payload);
      else await GardenPlantsService.create(gardenId, payload);
      setEditingPlant(undefined);
      setShowPlantForm(false);
      router.replace(`/gardens/${gardenId}`);
      await load();
    } catch (saveError) { setError(errorMessage(saveError)); }
    finally { setIsSaving(false); }
  }

  async function removePlant(plant: GardenPlant) {
    if (!window.confirm(`Remove ${plant.nickName || plant.plantName || "this plant"} from the garden?`)) return;
    try {
      await GardenPlantsService.delete(gardenId, plant.id);
      setGardenPlants((items) => items.filter((item) => item.id !== plant.id));
    } catch (removeError) { setError(errorMessage(removeError)); }
  }

  async function deleteGarden() {
    if (!garden || !window.confirm(`Delete ${garden.name || "this garden"}?`)) return;
    try { await GardensService.delete(garden.id); router.push("/gardens"); }
    catch (deleteError) { setError(errorMessage(deleteError)); }
  }

  if (isLoading) return <div className="py-12"><LoadingState label="Walking into your garden…" /></div>;
  if (!garden) return <div className="py-12"><ErrorState message={error || "Garden not found."} /></div>;

  const selectedPlant = catalogPlants.find((plant) => plant.id === requestedPlantId);
  return (
    <div className="pb-12">
      <div className="py-6"><Link href="/gardens" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]"><ArrowLeft className="h-4 w-4" /> Back to gardens</Link></div>
      <section className="overflow-hidden rounded-[2rem] bg-[#0A3D27] p-7 text-white md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div><p className="eyebrow !text-[#bde9ae]">{garden.visibilityName || "Personal garden"}</p><h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl md:text-6xl">{garden.name || "My garden"}</h1><p className="mt-4 max-w-2xl text-white/70">{garden.description || "A space for the plants you care about."}</p>{garden.locationName ? <p className="mt-4 flex items-center gap-2 font-bold text-[#c7ebba]"><MapPin className="h-4 w-4" />{garden.locationName}</p> : null}</div>
          <div className="flex gap-2"><button type="button" onClick={() => setShowGardenForm(true)} className="auth-button bg-white !text-[#0A3D27]"><Edit3 className="h-4 w-4" /> Edit</button><button type="button" onClick={deleteGarden} className="auth-button border border-white/20 bg-white/10 !text-white"><Trash2 className="h-4 w-4" /></button></div>
        </div>
      </section>
      {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}
      <section className="mt-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Living collection</p><h2 className="mt-1 text-3xl font-bold text-[#153f2f]">Plants in this garden</h2></div><button type="button" onClick={() => { setEditingPlant(undefined); setShowPlantForm(true); }} className="auth-button auth-button-primary"><Plus className="h-4 w-4" /> Add plant</button></div>
        {gardenPlants.length ? <div className="catalog-grid">{gardenPlants.map((plant) => <article key={plant.id} className="catalog-card p-5"><div className="flex items-start justify-between gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e4f4dc] text-[#12613f]"><Flower2 className="h-6 w-6" /></span><div className="flex gap-1"><button type="button" onClick={() => { setEditingPlant(plant); setShowPlantForm(true); }} className="grid h-9 w-9 place-items-center rounded-full border"><Edit3 className="h-4 w-4" /></button><button type="button" onClick={() => void removePlant(plant)} className="grid h-9 w-9 place-items-center rounded-full border text-red-700"><Trash2 className="h-4 w-4" /></button></div></div><h3 className="mt-4 text-xl font-bold text-[#153f2f]">{plant.nickName || plant.plantName || "Garden plant"}</h3>{plant.nickName && plant.plantName ? <p className="text-sm italic text-[#637b70]">{plant.plantName}</p> : null}<div className="mt-4 grid gap-2 text-sm text-[#557064]">{plant.locationName ? <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{plant.locationName}</p> : null}{plant.healthStatusName ? <p className="flex items-center gap-2"><HeartPulse className="h-4 w-4" />{plant.healthStatusName}</p> : null}{plant.acquiredDate ? <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Added {new Date(plant.acquiredDate).toLocaleDateString()}</p> : null}</div>{plant.notes ? <p className="mt-4 border-t pt-4 text-sm leading-6 text-[#637b70]">{plant.notes}</p> : null}<Link href={`/gardens/${gardenId}/plants/${plant.id}`} className="mt-4 inline-block text-sm font-bold text-[#12613f]">View plant and care reminders</Link></article>)}</div> : <EmptyState title="This garden is ready to grow" description="Add a plant from the catalog or choose one using the button above." />}
      </section>

      {showGardenForm ? <Modal title="Edit garden" onClose={() => setShowGardenForm(false)}><form onSubmit={saveGarden} className="grid gap-4"><div className="form-field"><label>Name</label><input name="name" required defaultValue={garden.name} className="form-input" /></div><div className="form-field"><label>Description</label><textarea name="description" defaultValue={garden.description} className="form-input min-h-24" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="form-field"><label>Location</label><select name="locationId" defaultValue={garden.locationId} className="form-input"><option value="">Choose</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="form-field"><label>Visibility</label><select name="visibilityId" defaultValue={garden.visibilityId} className="form-input">{visibilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div><button disabled={isSaving} className="auth-button auth-button-primary">{isSaving ? "Saving…" : "Save changes"}</button></form></Modal> : null}
      {showPlantForm ? <Modal title={editingPlant ? "Update garden plant" : selectedPlant ? `Add ${selectedPlant.name}` : "Add a plant"} onClose={() => { setShowPlantForm(false); setEditingPlant(undefined); }}><form onSubmit={savePlant} className="grid gap-4"><div className="form-field"><label>Plant</label><select name="plantId" required defaultValue={editingPlant?.plantId || requestedPlantId} disabled={Boolean(editingPlant)} className="form-input"><option value="">Choose a plant</option>{availablePlants.map((plant) => <option key={plant.id} value={plant.id}>{plant.name}</option>)}</select></div><div className="grid gap-4 sm:grid-cols-2"><div className="form-field"><label>Location</label><select name="locationId" required defaultValue={editingPlant?.locationId || garden.locationId} className="form-input"><option value="">Choose</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="form-field"><label>Acquired date</label><input type="date" name="acquiredDate" required defaultValue={(editingPlant?.acquiredDate || new Date().toISOString()).slice(0, 10)} className="form-input" /></div></div><div className="form-field"><label>Nickname</label><input name="nickName" defaultValue={editingPlant?.nickName} className="form-input" placeholder="Optional" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="form-field"><label>Status</label><select name="statusId" defaultValue={editingPlant?.statusId} className="form-input"><option value="">Choose</option>{statuses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="form-field"><label>Health</label><select name="healthStatusId" defaultValue={editingPlant?.healthStatusId} className="form-input"><option value="">Choose</option>{healthStatuses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div><div className="form-field"><label>Notes</label><textarea name="notes" defaultValue={editingPlant?.notes} className="form-input min-h-24" /></div><button disabled={isSaving} className="auth-button auth-button-primary">{isSaving ? "Saving…" : editingPlant ? "Save plant" : "Add to garden"}</button></form></Modal> : null}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#09291d]/50 p-4 backdrop-blur-sm"><div className="my-6 w-full max-w-xl rounded-[2rem] bg-[#fbfdf8] p-6 shadow-2xl md:p-8"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="eyebrow">Garden details</p><h2 className="mt-1 text-2xl font-bold text-[#153f2f]">{title}</h2></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border"><X className="h-4 w-4" /></button></div>{children}</div></div>;
}
