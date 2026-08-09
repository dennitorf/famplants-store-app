/* eslint-disable @next/next/no-img-element -- media host is environment-configured blob storage */
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarCheck, CalendarDays, Camera, Check, Edit3, Flower2, Globe2, HeartPulse, Lock, MapPin, Plus, Share2, Trash2, X } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/app/components/common/async-state";
import type { LookupOption } from "@/models/common/lookup-option";
import type { Garden } from "@/models/gardens/garden";
import type { GardenPlant } from "@/models/gardens/garden-plant";
import type { CareReminder } from "@/models/gardens/care-reminder";
import type { GardenCover } from "@/models/gardens/garden-cover";
import type { Plant } from "@/models/plants/plant";
import { GardenLookupsService } from "@/utils/services/gardens/garden-lookups-service";
import { GardenPlantsService } from "@/utils/services/gardens/garden-plants-service";
import { GardensService } from "@/utils/services/gardens/gardens-service";
import { CareRemindersService } from "@/utils/services/gardens/care-reminders-service";
import { GardenCoversService } from "@/utils/services/gardens/garden-covers-service";
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
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [coverCandidates, setCoverCandidates] = useState<GardenCover[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showGardenForm, setShowGardenForm] = useState(false);
  const [showPlantForm, setShowPlantForm] = useState(Boolean(requestedPlantId));
  const [editingPlant, setEditingPlant] = useState<GardenPlant>();
  const [showCoverForm, setShowCoverForm] = useState(false);
  const [showShareForm, setShowShareForm] = useState(false);
  const [completingId, setCompletingId] = useState<string>();
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const [gardenData, gardenPlantData, plantData, locationData, visibilityData, statusData, healthData, reminderData] = await Promise.all([
        GardensService.getById(gardenId),
        GardenPlantsService.getAll(gardenId),
        PlantsService.getAll(1, 100),
        GardenLookupsService.getLocations(),
        GardenLookupsService.getVisibilities(),
        GardenLookupsService.getPlantStatuses(),
        GardenLookupsService.getHealthStatuses(),
        CareRemindersService.getForGarden(gardenId),
      ]);
      setGarden(gardenData);
      setGardenPlants(gardenPlantData);
      setCatalogPlants(plantData.data);
      setLocations(locationData);
      setVisibilities(visibilityData);
      setStatuses(statusData);
      setHealthStatuses(healthData);
      setReminders(reminderData);
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
      setGarden({ ...updated, coverPhotoId: garden.coverPhotoId, coverPhotoUrl: garden.coverPhotoUrl,
        coverThumbnailUrl: garden.coverThumbnailUrl, coverCardUrl: garden.coverCardUrl });
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

  async function changeVisibility(visibilityId: number) {
    if (!garden || garden.visibilityId === visibilityId) return;
    setIsSaving(true);
    setError(undefined);
    try {
      const updated = await GardensService.update(garden.id, {
        name: garden.name || "My garden",
        description: garden.description || "",
        visibilityId,
        locationId: garden.locationId,
      });
      setGarden({ ...updated, coverPhotoId: garden.coverPhotoId, coverPhotoUrl: garden.coverPhotoUrl,
        coverThumbnailUrl: garden.coverThumbnailUrl, coverCardUrl: garden.coverCardUrl });
    } catch (visibilityError) { setError(errorMessage(visibilityError)); }
    finally { setIsSaving(false); }
  }

  async function completeReminder(reminder: CareReminder) {
    setCompletingId(reminder.id);
    try {
      await CareRemindersService.complete(gardenId, reminder.gardenPlantId, reminder);
      setReminders(await CareRemindersService.getForGarden(gardenId));
    } catch (reminderError) { setError(errorMessage(reminderError)); }
    finally { setCompletingId(undefined); }
  }

  async function openCoverForm() {
    setShowCoverForm(true);
    try { setCoverCandidates(await GardenCoversService.getCandidates(gardenId)); }
    catch (coverError) { setError(errorMessage(coverError)); }
  }

  function applyCover(cover: GardenCover) {
    setGarden((current) => current ? {
      ...current,
      coverPhotoId: cover.mediaAssetId,
      coverPhotoUrl: cover.url,
      coverThumbnailUrl: cover.thumbnailUrl,
      coverCardUrl: cover.cardUrl,
    } : current);
    setShowCoverForm(false);
  }

  async function uploadCover(file?: File) {
    if (!file) return;
    setIsSaving(true);
    try { applyCover(await GardenCoversService.upload(gardenId, file)); }
    catch (coverError) { setError(errorMessage(coverError)); }
    finally { setIsSaving(false); }
  }

  async function selectCover(mediaAssetId: string) {
    setIsSaving(true);
    try { applyCover(await GardenCoversService.select(gardenId, mediaAssetId)); }
    catch (coverError) { setError(errorMessage(coverError)); }
    finally { setIsSaving(false); }
  }

  async function deleteGarden() {
    if (!garden || !window.confirm(`Delete ${garden.name || "this garden"}?`)) return;
    try { await GardensService.delete(garden.id); router.push("/gardens"); }
    catch (deleteError) { setError(errorMessage(deleteError)); }
  }

  if (isLoading) return <div className="py-12"><LoadingState label="Walking into your garden…" /></div>;
  if (!garden) return <div className="py-12"><ErrorState message={error || "Garden not found."} /></div>;

  const selectedPlant = catalogPlants.find((plant) => plant.id === requestedPlantId);
  const placeholderCoverUrl = gardenPlants.find((plant) => plant.photoCardUrl || plant.photoThumbnailUrl || plant.photoUrl);
  const heroImageUrl = garden.coverPhotoUrl || garden.coverCardUrl || placeholderCoverUrl?.photoCardUrl || placeholderCoverUrl?.photoThumbnailUrl || placeholderCoverUrl?.photoUrl;
  return (
    <div className="pb-12">
      <div className="py-6"><Link href="/gardens" className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]"><ArrowLeft className="h-4 w-4" /> Back to gardens</Link></div>
      <section
        className="relative overflow-hidden rounded-[2rem] bg-[#0A3D27] bg-cover bg-center p-7 text-white md:p-10"
        style={heroImageUrl ? { backgroundImage: `linear-gradient(90deg, rgba(5,42,26,.92), rgba(5,42,26,.48)), url(${heroImageUrl})` } : undefined}
      >
        {!heroImageUrl ? <Flower2 className="pointer-events-none absolute -bottom-14 right-6 h-64 w-64 text-white/5" /> : null}
        <div className="relative flex flex-wrap items-start justify-between gap-6">
          <div><p className="eyebrow !text-[#bde9ae]">{garden.visibilityName || "Personal garden"}</p><h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl md:text-6xl">{garden.name || "My garden"}</h1><p className="mt-4 max-w-2xl text-white/70">{garden.description || "A space for the plants you care about."}</p>{garden.locationName ? <p className="mt-4 flex items-center gap-2 font-bold text-[#c7ebba]"><MapPin className="h-4 w-4" />{garden.locationName}</p> : null}</div>
          {garden.isOwner ? <div className="flex gap-2"><button type="button" aria-label={garden.coverPhotoUrl ? "Change cover photo" : "Add cover photo"} title={garden.coverPhotoUrl ? "Change cover photo" : "Add cover photo"} onClick={() => void openCoverForm()} className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#0A3D27]"><Camera className="h-4 w-4" /></button><button type="button" onClick={() => setShowGardenForm(true)} className="auth-button bg-white !text-[#0A3D27]"><Edit3 className="h-4 w-4" /> Edit</button><button type="button" onClick={deleteGarden} className="auth-button border border-white/20 bg-white/10 !text-white"><Trash2 className="h-4 w-4" /></button></div> : null}
        </div>
      </section>
      {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}
      {garden.isOwner ? (
        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <button type="button" disabled={isSaving} onClick={() => void changeVisibility(1)} className={`detail-panel flex items-center gap-3 !p-4 text-left ${garden.visibilityId === 1 ? "ring-2 ring-[#12613f]" : ""}`}><Lock className="h-5 w-5 text-[#12613f]" /><span><strong className="block text-[#153f2f]">Private</strong><small className="text-[#637b70]">Only you</small></span></button>
          <button type="button" disabled={isSaving} onClick={() => void changeVisibility(2)} className={`detail-panel flex items-center gap-3 !p-4 text-left ${garden.visibilityId === 2 ? "ring-2 ring-[#12613f]" : ""}`}><Globe2 className="h-5 w-5 text-[#12613f]" /><span><strong className="block text-[#153f2f]">Public</strong><small className="text-[#637b70]">Anyone can view</small></span></button>
          <button type="button" onClick={() => setShowShareForm(true)} className={`detail-panel flex items-center gap-3 !p-4 text-left ${garden.visibilityId === 3 ? "ring-2 ring-[#12613f]" : ""}`}><Share2 className="h-5 w-5 text-[#12613f]" /><span><strong className="block text-[#153f2f]">Share</strong><small className="text-[#637b70]">Coming soon</small></span></button>
        </section>
      ) : null}

      <section className="mt-9">
        <div className="mb-5"><p className="eyebrow">Care schedule</p><h2 className="mt-1 text-3xl font-bold text-[#153f2f]">Upcoming tasks</h2></div>
        {reminders.length ? <div className="grid gap-3 lg:grid-cols-2">{reminders.slice(0, 8).map((reminder) => <article key={reminder.id} className="detail-panel flex items-center gap-4 !p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e4f4dc] text-[#12613f]"><CalendarCheck className="h-5 w-5" /></span><div className="min-w-0 flex-1"><h3 className="font-bold text-[#153f2f]">{reminder.careEventTypeActionName || reminder.careEventTypeName || "Plant care"} {reminder.plantNickname || reminder.plantName || "plant"}</h3><p className="text-sm text-[#637b70]">{new Date(reminder.dueDate).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</p></div>{garden.isOwner ? <button type="button" disabled={completingId === reminder.id} onClick={() => void completeReminder(reminder)} className="grid h-9 w-9 place-items-center rounded-full border border-emerald-950/15 text-[#12613f]"><Check className="h-4 w-4" /></button> : null}</article>)}</div> : <EmptyState title="All caught up" description="There are no upcoming tasks for plants in this garden." />}
      </section>
      <section className="mt-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Living collection</p><h2 className="mt-1 text-3xl font-bold text-[#153f2f]">Plants in this garden</h2></div>{garden.isOwner ? <button type="button" onClick={() => { setEditingPlant(undefined); setShowPlantForm(true); }} className="auth-button auth-button-primary"><Plus className="h-4 w-4" /> Add plant</button> : null}</div>
        {gardenPlants.length ? <div className="catalog-grid">{gardenPlants.map((plant) => <GardenPlantCard key={plant.id} plant={plant} gardenId={gardenId} isOwner={garden.isOwner} onEdit={() => { setEditingPlant(plant); setShowPlantForm(true); }} onDelete={() => void removePlant(plant)} />)}</div> : <EmptyState title="This garden is ready to grow" description="Add a plant from the catalog or choose one using the button above." />}
      </section>

      {showGardenForm ? <Modal title="Edit garden" onClose={() => setShowGardenForm(false)}><form onSubmit={saveGarden} className="grid gap-4"><div className="form-field"><label>Name</label><input name="name" required defaultValue={garden.name} className="form-input" /></div><div className="form-field"><label>Description</label><textarea name="description" defaultValue={garden.description} className="form-input min-h-24" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="form-field"><label>Location</label><select name="locationId" defaultValue={garden.locationId} className="form-input"><option value="">Choose</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="form-field"><label>Visibility</label><select name="visibilityId" defaultValue={garden.visibilityId} className="form-input">{visibilities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div><button disabled={isSaving} className="auth-button auth-button-primary">{isSaving ? "Saving…" : "Save changes"}</button></form></Modal> : null}
      {showPlantForm ? <Modal title={editingPlant ? "Update garden plant" : selectedPlant ? `Add ${selectedPlant.name}` : "Add a plant"} onClose={() => { setShowPlantForm(false); setEditingPlant(undefined); }}><form onSubmit={savePlant} className="grid gap-4"><div className="form-field"><label>Plant</label><select name="plantId" required defaultValue={editingPlant?.plantId || requestedPlantId} disabled={Boolean(editingPlant)} className="form-input"><option value="">Choose a plant</option>{availablePlants.map((plant) => <option key={plant.id} value={plant.id}>{plant.name}</option>)}</select></div><div className="grid gap-4 sm:grid-cols-2"><div className="form-field"><label>Location</label><select name="locationId" required defaultValue={editingPlant?.locationId || garden.locationId} className="form-input"><option value="">Choose</option>{locations.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="form-field"><label>Acquired date</label><input type="date" name="acquiredDate" required defaultValue={(editingPlant?.acquiredDate || new Date().toISOString()).slice(0, 10)} className="form-input" /></div></div><div className="form-field"><label>Nickname</label><input name="nickName" defaultValue={editingPlant?.nickName} className="form-input" placeholder="Optional" /></div><div className="grid gap-4 sm:grid-cols-2"><div className="form-field"><label>Status</label><select name="statusId" defaultValue={editingPlant?.statusId} className="form-input"><option value="">Choose</option>{statuses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div><div className="form-field"><label>Health</label><select name="healthStatusId" defaultValue={editingPlant?.healthStatusId} className="form-input"><option value="">Choose</option>{healthStatuses.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div></div><div className="form-field"><label>Notes</label><textarea name="notes" defaultValue={editingPlant?.notes} className="form-input min-h-24" /></div><button disabled={isSaving} className="auth-button auth-button-primary">{isSaving ? "Saving…" : editingPlant ? "Save plant" : "Add to garden"}</button></form></Modal> : null}
      {showCoverForm ? <Modal title="Choose garden cover" onClose={() => setShowCoverForm(false)}><div className="grid gap-5"><label className="auth-button auth-button-primary cursor-pointer justify-center"><Camera className="h-4 w-4" />Upload a new photo<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => void uploadCover(event.target.files?.[0])} /></label>{coverCandidates.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{coverCandidates.map((candidate) => <button key={candidate.mediaAssetId} type="button" disabled={isSaving} onClick={() => void selectCover(candidate.mediaAssetId)} className="overflow-hidden rounded-2xl border border-emerald-950/10"><img src={candidate.thumbnailUrl || candidate.url} alt={candidate.caption || "Plant photo"} className="aspect-square w-full object-cover" /></button>)}</div> : <EmptyState title="No plant photos yet" description="Upload a cover now, or add photos to plants first." />}</div></Modal> : null}
      {showShareForm ? <Modal title="Share garden" onClose={() => setShowShareForm(false)}><div className="rounded-2xl bg-[#f3faef] p-5 text-center"><Share2 className="mx-auto h-8 w-8 text-[#12613f]" /><h3 className="mt-3 text-lg font-bold text-[#153f2f]">Coming soon</h3><p className="mt-2 text-sm text-[#637b70]">Garden invitations are being redesigned and are not available yet.</p></div></Modal> : null}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#09291d]/50 p-4 backdrop-blur-sm"><div className="my-6 w-full max-w-xl rounded-[2rem] bg-[#fbfdf8] p-6 shadow-2xl md:p-8"><div className="mb-6 flex items-start justify-between gap-4"><div><p className="eyebrow">Garden details</p><h2 className="mt-1 text-2xl font-bold text-[#153f2f]">{title}</h2></div><button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border"><X className="h-4 w-4" /></button></div>{children}</div></div>;
}

function GardenPlantCard({ plant, gardenId, isOwner, onEdit, onDelete }: {
  plant: GardenPlant;
  gardenId: string;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return <article className="catalog-card overflow-hidden">
    {plant.photoCardUrl || plant.photoThumbnailUrl || plant.photoUrl ? <img src={plant.photoCardUrl || plant.photoThumbnailUrl || plant.photoUrl} alt={plant.nickName || plant.plantName || "Garden plant"} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center bg-[#e4f4dc] text-[#12613f]"><Flower2 className="h-12 w-12" /></div>}
    <div className="p-5">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-[#153f2f]">{plant.nickName || plant.plantName || "Garden plant"}</h3>{plant.nickName && plant.plantName ? <p className="text-sm italic text-[#637b70]">{plant.plantName}</p> : null}</div>{isOwner ? <div className="flex gap-1"><button type="button" onClick={onEdit} className="grid h-9 w-9 place-items-center rounded-full border"><Edit3 className="h-4 w-4" /></button><button type="button" onClick={onDelete} className="grid h-9 w-9 place-items-center rounded-full border text-red-700"><Trash2 className="h-4 w-4" /></button></div> : null}</div>
      <div className="mt-4 grid gap-2 text-sm text-[#557064]">{plant.locationName ? <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{plant.locationName}</p> : null}{plant.healthStatusName ? <p className="flex items-center gap-2"><HeartPulse className="h-4 w-4" />{plant.healthStatusName}</p> : null}{plant.acquiredDate ? <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />Added {new Date(plant.acquiredDate).toLocaleDateString()}</p> : null}</div>
      <Link href={`/gardens/${gardenId}/plants/${plant.id}`} className="mt-4 inline-block text-sm font-bold text-[#12613f]">View plant and care reminders</Link>
    </div>
  </article>;
}
