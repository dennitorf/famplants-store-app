"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarDays,
  Camera,
  Check,
  CircleAlert,
  Droplets,
  Flower2,
  HeartPulse,
  Leaf,
  MapPin,
  Maximize2,
  Sprout,
  Sun,
  ThermometerSun,
  Trash2,
  X,
} from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/app/components/common/async-state";
import RichHtml from "@/app/components/common/rich-html";
import { errorMessage, plainText } from "@/lib/text";
import type { CareReminder } from "@/models/gardens/care-reminder";
import type { GardenPlant } from "@/models/gardens/garden-plant";
import type { GardenPlantPhoto } from "@/models/gardens/garden-plant-photo";
import type { Plant } from "@/models/plants/plant";
import { CareRemindersService } from "@/utils/services/gardens/care-reminders-service";
import { GardenPlantsService } from "@/utils/services/gardens/garden-plants-service";
import { GardenPlantPhotosService } from "@/utils/services/gardens/garden-plant-photos-service";
import { PlantsService } from "@/utils/services/plants/plants-service";

export default function GardenPlantDetailClient({
  gardenId,
  gardenPlantId,
}: {
  gardenId: string;
  gardenPlantId: string;
}) {
  const [gardenPlant, setGardenPlant] = useState<GardenPlant>();
  const [catalogPlant, setCatalogPlant] = useState<Plant>();
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [photos, setPhotos] = useState<GardenPlantPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GardenPlantPhoto>();
  const [photoCaption, setPhotoCaption] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [deletingPhotoId, setDeletingPhotoId] = useState<string>();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [completingId, setCompletingId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const plant = await GardenPlantsService.getById(gardenId, gardenPlantId);
      const [catalog, upcoming, plantPhotos] = await Promise.all([
        PlantsService.getById(plant.plantId).catch(() => undefined),
        CareRemindersService.getUpcoming(gardenId, gardenPlantId),
        GardenPlantPhotosService.getAll(gardenId, gardenPlantId),
      ]);
      setGardenPlant(plant);
      setCatalogPlant(catalog);
      setReminders(upcoming);
      setPhotos(plantPhotos);
    } catch (loadError) {
      setError(errorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [gardenId, gardenPlantId]);

  useEffect(() => { void load(); }, [load]);

  async function completeReminder(reminder: CareReminder) {
    setCompletingId(reminder.id);
    setError(undefined);
    try {
      await CareRemindersService.complete(gardenId, gardenPlantId, reminder);
      setReminders(await CareRemindersService.getUpcoming(gardenId, gardenPlantId));
    } catch (completeError) {
      setError(errorMessage(completeError));
    } finally {
      setCompletingId(undefined);
    }
  }

  async function uploadPhoto(file?: File) {
    if (!file) return;
    setIsUploadingPhoto(true);
    setError(undefined);
    try {
      const photo = await GardenPlantPhotosService.create(gardenId, gardenPlantId, file, photoCaption.trim());
      setPhotos((current) => [photo, ...current]);
      setPhotoCaption("");
    } catch (uploadError) {
      setError(errorMessage(uploadError));
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  async function deletePhoto(photoId: string) {
    if (!window.confirm("Delete this photo from the plant journal?")) return;
    setDeletingPhotoId(photoId);
    setError(undefined);
    try {
      await GardenPlantPhotosService.delete(gardenId, gardenPlantId, photoId);
      setPhotos((current) => current.filter((photo) => photo.id !== photoId));
    } catch (deleteError) {
      setError(errorMessage(deleteError));
    } finally {
      setDeletingPhotoId(undefined);
    }
  }

  const traits = useMemo(() => [
    { label: "Light", value: catalogPlant?.lightRequirement, icon: Sun },
    { label: "Water", value: catalogPlant?.wateringFrequency, icon: Droplets },
    { label: "Temperature", value: catalogPlant?.temperature, icon: ThermometerSun },
    { label: "Soil", value: catalogPlant?.soilType, icon: Sprout },
  ].filter((trait) => trait.value), [catalogPlant]);

  if (isLoading) return <div className="py-14"><LoadingState label="Checking on your plant…" /></div>;
  if (!gardenPlant) return <div className="py-14"><ErrorState message={error || "Garden plant not found."} /></div>;

  const displayName = gardenPlant.nickName || gardenPlant.plantName || catalogPlant?.name || "Garden plant";

  return (
    <div className="pb-14">
      <div className="py-6">
        <Link href={`/gardens/${gardenId}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#416a58]">
          <ArrowLeft className="h-4 w-4" /> Back to garden
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2rem] bg-[#0A3D27] p-7 text-white md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-[2rem] bg-white/10 text-[#c8efba]">
            <Flower2 className="h-12 w-12" />
          </span>
          <div>
            <p className="eyebrow !text-[#bde9ae]">Plant in your garden</p>
            <h1 className="mt-2 font-[family-name:var(--font-joti-one)] text-4xl md:text-6xl">{displayName}</h1>
            {gardenPlant.nickName && gardenPlant.plantName ? <p className="mt-2 text-lg italic text-white/70">{gardenPlant.plantName}</p> : null}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-[#d9f4d0]">
              {gardenPlant.locationName ? <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{gardenPlant.locationName}</span> : null}
              {gardenPlant.healthStatusName ? <span className="inline-flex items-center gap-2"><HeartPulse className="h-4 w-4" />{gardenPlant.healthStatusName}</span> : null}
              {gardenPlant.acquiredDate ? <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" />Added {new Date(gardenPlant.acquiredDate).toLocaleDateString()}</span> : null}
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="mt-6"><ErrorState message={error} /></div> : null}

      <section className="mt-9">
        <p className="eyebrow">Care schedule</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold text-[#153f2f]">Next care reminders</h2>
          <p className="text-sm text-[#637b70]">Completing an action schedules its next occurrence.</p>
        </div>
        {reminders.length ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {reminders.map((reminder) => {
              const due = new Date(reminder.dueDate);
              const overdue = due.getTime() < startOfToday().getTime();
              return (
                <article key={reminder.id} className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#e4f4dc] text-[#12613f]"><Leaf className="h-5 w-5" /></span>
                      <div>
                        <h3 className="text-xl font-bold text-[#153f2f]">{reminder.careEventTypeActionName || reminder.careEventTypeName || "Plant care"}</h3>
                        <p className={`mt-1 inline-flex items-center gap-1.5 text-sm font-bold ${overdue ? "text-amber-700" : "text-[#557064]"}`}>
                          {overdue ? <CircleAlert className="h-4 w-4" /> : <CalendarCheck className="h-4 w-4" />}
                          {formatDueDate(due)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={completingId === reminder.id}
                      onClick={() => void completeReminder(reminder)}
                      className="auth-button auth-button-primary shrink-0"
                    >
                      <Check className="h-4 w-4" />{completingId === reminder.id ? "Saving…" : "Done"}
                    </button>
                  </div>
                  {plainText(reminder.instructions) ? <RichHtml content={reminder.instructions ?? ""} className="mt-5 border-t border-emerald-950/10 pt-4 text-sm" /> : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-5"><EmptyState title="All caught up" description="There are no pending care actions for this plant." /></div>
        )}
      </section>

      <section className="mt-9">
        <p className="eyebrow">Photo journal</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold text-[#153f2f]">Watch your plant grow</h2>
            <p className="mt-1 text-sm text-[#637b70]">Capture a dated photo whenever you notice a change.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <input
              value={photoCaption}
              onChange={(event) => setPhotoCaption(event.target.value)}
              maxLength={1000}
              placeholder="What changed? (optional)"
              className="min-w-64 rounded-full border border-emerald-950/15 bg-white px-4 py-2.5 text-sm text-[#153f2f] outline-none focus:border-[#12613f]"
            />
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={(event) => void uploadPhoto(event.target.files?.[0])}
            />
            <button
              type="button"
              disabled={isUploadingPhoto}
              onClick={() => photoInputRef.current?.click()}
              className="auth-button auth-button-primary"
            >
              <Camera className="h-4 w-4" />{isUploadingPhoto ? "Recording…" : "Take or add photo"}
            </button>
          </div>
        </div>
        {photos.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <article key={photo.id} className="group overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-sm">
                <button type="button" aria-label="View full photo" onClick={() => setSelectedPhoto(photo)} className="group/photo relative block w-full overflow-hidden">
                  {/* Blob hosts are configured per environment, so native images avoid a brittle domain allow-list. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.cardUrl || photo.thumbnailUrl || photo.url} alt={photo.altText || photo.caption || displayName} className="aspect-[4/3] w-full object-cover transition duration-300 group-hover/photo:scale-[1.02]" />
                  <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm"><Maximize2 className="h-4 w-4" /></span>
                </button>
                <div className="flex items-start justify-between gap-3 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#71877c]">{new Date(photo.capturedDate).toLocaleDateString()}</p>
                    <p className="mt-1 text-sm text-[#456357]">{photo.caption || "A moment in this plant’s story."}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Delete photo"
                    disabled={deletingPhotoId === photo.id}
                    onClick={() => void deletePhoto(photo.id)}
                    className="rounded-full p-2 text-[#71877c] hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  ><Trash2 className="h-4 w-4" /></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5"><EmptyState title="No photos yet" description="Take the first photo to begin this plant’s visual journal." /></div>
        )}
      </section>

      <section className="mt-9 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="detail-panel">
          <p className="eyebrow">About this plant</p>
          <h2 className="mt-1 text-2xl font-bold text-[#153f2f]">{catalogPlant?.name || gardenPlant.plantName || displayName}</h2>
          {plainText(catalogPlant?.description) ? <RichHtml content={catalogPlant?.description ?? ""} className="mt-4" /> : <p className="mt-3 text-[#637b70]">Plant details are being prepared.</p>}
          {catalogPlant?.slug ? <Link href={`/plants/${catalogPlant.slug}`} className="mt-5 inline-flex font-bold text-[#12613f]">View full plant profile</Link> : null}
        </div>
        <div className="detail-panel">
          <p className="eyebrow">Growing conditions</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {traits.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-3 rounded-2xl bg-[#f3faef] p-4"><Icon className="h-5 w-5 text-[#12613f]" /><div><p className="text-xs font-bold uppercase tracking-wider text-[#71877c]">{label}</p><p className="font-bold text-[#153f2f]">{value}</p></div></div>)}
          </div>
          {gardenPlant.notes ? <div className="mt-5 border-t pt-5"><p className="text-xs font-bold uppercase tracking-wider text-[#71877c]">Your notes</p><p className="mt-2 whitespace-pre-wrap text-[#557064]">{gardenPlant.notes}</p></div> : null}
        </div>
      </section>

      {selectedPhoto ? (
        <div role="dialog" aria-modal="true" aria-label="Plant photo" className="fixed inset-0 z-[90] grid place-items-center bg-black/90 p-4">
          <button type="button" aria-label="Close full photo" onClick={() => setSelectedPhoto(undefined)} className="absolute inset-0" />
          <div className="relative z-10 flex max-h-full max-w-6xl flex-col items-center gap-4">
            <button type="button" aria-label="Close full photo" onClick={() => setSelectedPhoto(undefined)} className="absolute -right-2 -top-2 z-20 grid h-11 w-11 place-items-center rounded-full bg-white text-[#153f2f] shadow-xl"><X className="h-5 w-5" /></button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selectedPhoto.url} alt={selectedPhoto.altText || selectedPhoto.caption || displayName} className="max-h-[82vh] max-w-full rounded-2xl object-contain shadow-2xl" />
            {selectedPhoto.caption ? <p className="max-w-3xl text-center text-sm text-white/85">{selectedPhoto.caption}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function startOfToday(): Date {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function formatDueDate(date: Date): string {
  const today = startOfToday();
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return `Overdue by ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due ${date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined })}`;
}
