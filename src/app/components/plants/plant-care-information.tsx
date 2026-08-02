"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BookOpen, LocateFixed, MapPin, ThumbsUp } from "lucide-react";
import type { CareGuide } from "@/models/plants/care-guide";
import type { CareGuideApplicableHardinessZone } from "@/models/plants/care-guide-applicable-hardiness-zone";
import type { CareGuideApplicableType } from "@/models/plants/care-guide-applicable-type";
import type { CareInformation } from "@/models/plants/care-information";
import type { HardinessZone } from "@/models/plants/hardiness-zone";
import { plainText } from "@/lib/text";
import { CareGuideHardinessZonesService } from "@/utils/services/plants/care-guide-hardiness-zones-service";
import { CareGuidesService } from "@/utils/services/plants/care-guides-service";
import { CareGuideTypesService } from "@/utils/services/plants/care-guide-types-service";
import { CareInformationService } from "@/utils/services/plants/care-information-service";
import { HardinessZonesService } from "@/utils/services/plants/hardiness-zones-service";
import RichHtml from "@/app/components/common/rich-html";

interface GuideMetadata {
  hardinessZones: CareGuideApplicableHardinessZone[];
  types: CareGuideApplicableType[];
}

interface PostalCodeResult {
  postalCode?: string;
  attribution?: string;
  message?: string;
}

export default function PlantCareInformation({ plantId }: { plantId: string }) {
  const [guides, setGuides] = useState<CareGuide[]>([]);
  const [metadata, setMetadata] = useState<Record<string, GuideMetadata>>({});
  const [zipCode, setZipCode] = useState("");
  const [hardinessZone, setHardinessZone] = useState<HardinessZone | null>(null);
  const [locationAttribution, setLocationAttribution] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [guideId, setGuideId] = useState<string | null>(null);
  const [information, setInformation] = useState<CareInformation[]>([]);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [ratingIds, setRatingIds] = useState<Set<string>>(new Set());
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingInformation, setIsLoadingInformation] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const careGuides = await CareGuidesService.getByPlantId(plantId);
        const entries = await Promise.all(careGuides.map(async (guide) => {
          const [hardinessZones, types] = await Promise.all([
            CareGuideHardinessZonesService.getAll(guide.id),
            CareGuideTypesService.getAll(guide.id),
          ]);
          return [guide.id, { hardinessZones, types }] as const;
        }));
        if (!active) return;
        setGuides(careGuides);
        setMetadata(Object.fromEntries(entries));
        setIsLoading(false);
      } catch {
        if (!active) return;
        setHasError(true);
        setIsLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [plantId]);

  useEffect(() => {
    let active = true;
    if (!("geolocation" in navigator)) {
      setLocationMessage("Enter your ZIP code to find the right hardiness-zone guide.");
      return () => { active = false; };
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        void resolveLocation(position.coords.latitude, position.coords.longitude)
          .then(async (result) => {
            if (!active || !result.postalCode) return;
            const zone = await HardinessZonesService.getByZipCode(result.postalCode);
            if (!active) return;
            setZipCode(result.postalCode);
            setHardinessZone(zone);
            setLocationAttribution(result.attribution ?? null);
            setLocationMessage(`Using ZIP ${result.postalCode} from your current location.`);
          })
          .catch(() => {
            if (active) setLocationMessage("We could not detect your ZIP code. Enter it below instead.");
          })
          .finally(() => {
            if (active) setIsLocating(false);
          });
      },
      () => {
        if (!active) return;
        setIsLocating(false);
        setLocationMessage("Location access is off. Enter your ZIP code to find your hardiness zone.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 },
    );
    return () => { active = false; };
  }, []);

  const selection = useMemo(() => {
    const requiresHardinessZone = Object.values(metadata)
      .some((item) => item.hardinessZones.length > 0);
    const zoneGuides = requiresHardinessZone && !hardinessZone ? [] : guides.filter((guide) => {
      const zones = metadata[guide.id]?.hardinessZones ?? [];
      return !hardinessZone || !zones.length
        || zones.some((item) => item.hardinessZoneId === hardinessZone.id);
    });
    const availableTypes = Array.from(new Map(
      zoneGuides
        .flatMap((guide) => metadata[guide.id]?.types ?? [])
        .map((type) => [type.careGuideTypeId, type]),
    ).values()).sort((left, right) => (left.name ?? "").localeCompare(right.name ?? ""));
    const selectedTypeId = availableTypes.length === 1
      ? availableTypes[0].careGuideTypeId
      : availableTypes.some((type) => type.careGuideTypeId === typeId) ? typeId : null;
    const matchedGuides = availableTypes.length > 1 && !selectedTypeId
      ? []
      : zoneGuides.filter((guide) => !selectedTypeId
        || (metadata[guide.id]?.types ?? []).some((type) => type.careGuideTypeId === selectedTypeId));
    const selectedGuideId = matchedGuides.length === 1
      ? matchedGuides[0].id
      : matchedGuides.some((guide) => guide.id === guideId) ? guideId : null;
    return {
      requiresHardinessZone,
      zoneGuides,
      availableTypes,
      selectedTypeId,
      matchedGuides,
      selectedGuideId,
    };
  }, [guideId, guides, hardinessZone, metadata, typeId]);

  useEffect(() => {
    let active = true;
    async function loadInformation() {
      if (!selection.selectedGuideId) {
        setInformation([]);
        return;
      }
      setIsLoadingInformation(true);
      try {
        const items = await CareInformationService.getAll(selection.selectedGuideId);
        if (active) setInformation(sortInformation(items));
      } catch {
        if (active) setInformation([]);
      } finally {
        if (active) setIsLoadingInformation(false);
      }
    }
    void loadInformation();
    return () => { active = false; };
  }, [selection.selectedGuideId]);

  async function findZone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedZip = zipCode.match(/\b\d{5}\b/)?.[0];
    if (!normalizedZip) {
      setLocationMessage("Enter a valid five-digit U.S. ZIP code.");
      return;
    }
    setIsLocating(true);
    setLocationMessage(null);
    try {
      const zone = await HardinessZonesService.getByZipCode(normalizedZip);
      setZipCode(normalizedZip);
      setHardinessZone(zone);
      setTypeId(null);
      setGuideId(null);
      setLocationAttribution(null);
      setLocationMessage(`ZIP ${normalizedZip} is in hardiness zone ${zone.code}.`);
    } catch {
      setHardinessZone(null);
      setLocationMessage("We could not find a hardiness zone for that ZIP code.");
    } finally {
      setIsLocating(false);
    }
  }

  async function rate(item: CareInformation) {
    const selectedGuideId = selection.selectedGuideId;
    if (!selectedGuideId || ratedIds.has(item.id) || ratingIds.has(item.id)) return;
    setRatingError(null);
    setRatingIds((current) => new Set(current).add(item.id));
    try {
      const updated = await CareInformationService.rate(selectedGuideId, item.id);
      setInformation((current) => sortInformation(current.map((entry) => entry.id === updated.id ? updated : entry)));
      setRatedIds((current) => new Set(current).add(item.id));
    } catch {
      setRatingError("We could not save your feedback right now.");
    } finally {
      setRatingIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }
  }

  if (isLoading) return <CareStatus message="Loading care information..." />;
  if (hasError) return <CareStatus message="Care information is not available right now." />;
  if (!guides.length) return <CareStatus message="No care guides are available for this plant yet." />;

  const selectedGuide = guides.find((guide) => guide.id === selection.selectedGuideId);
  const visibleInformation = information.filter((item) => plainText(item.content));

  return (
    <section>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#e4f4dc] text-[#12613f]"><BookOpen className="h-5 w-5" /></span>
        <div><p className="eyebrow">Grow with confidence</p><h2 className="text-3xl font-bold text-[#0A3D27]">Care information</h2></div>
      </div>

      {selection.requiresHardinessZone ? (
        <div className="mt-7 rounded-[2rem] bg-[#f3faef] p-6">
          <div className="flex items-start gap-3"><LocateFixed className="mt-1 h-5 w-5 shrink-0 text-[#12613f]" /><div><h3 className="font-bold text-[#153f2f]">Find your hardiness zone</h3><p className="mt-1 text-sm leading-6 text-[#557064]">We use your browser location, when permitted, to detect a ZIP code and match it through the FamPlants hardiness-zone data.</p></div></div>
          <form onSubmit={findZone} className="mt-4 flex max-w-md gap-3">
            <input aria-label="ZIP code" inputMode="numeric" autoComplete="postal-code" maxLength={10} value={zipCode} onChange={(event) => setZipCode(event.target.value)} placeholder="ZIP code" className="form-input" />
            <button disabled={isLocating} className="auth-button auth-button-secondary shrink-0 disabled:opacity-60">{isLocating ? "Finding..." : "Find zone"}</button>
          </form>
          {hardinessZone ? <p className="mt-4 font-bold text-[#12613f]">Hardiness zone {hardinessZone.code} · {hardinessZone.minTemperatureInclusiveF}°F to {hardinessZone.maxTemperatureExclusiveF}°F</p> : null}
          {locationMessage ? <p className="mt-2 text-sm text-[#637b70]">{locationMessage}</p> : null}
          {locationAttribution ? <p className="mt-2 text-xs text-[#71877c]">Location lookup {locationAttribution}</p> : null}
        </div>
      ) : null}

      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {selection.availableTypes.length > 1 ? <Select label="Care guide type" value={selection.selectedTypeId ?? ""} onChange={(value) => { setTypeId(value || null); setGuideId(null); }} options={selection.availableTypes.map((type) => ({ value: type.careGuideTypeId, label: type.name || "Unnamed type" }))} placeholder="Select a type" /> : null}
        {selection.matchedGuides.length > 1 ? <Select label="Care guide" value={selection.selectedGuideId ?? ""} onChange={(value) => setGuideId(value || null)} options={selection.matchedGuides.map((guide) => ({ value: guide.id, label: guide.name || "Unnamed guide" }))} placeholder="Select a guide" /> : null}
      </div>

      {selection.requiresHardinessZone && !hardinessZone ? <CareStatus message="Allow location access or enter your ZIP code to find matching care guides." />
        : !selection.zoneGuides.length ? <CareStatus message={`No care guides are available for hardiness zone ${hardinessZone?.code ?? "this location"}.`} />
          : selection.availableTypes.length > 1 && !selection.selectedTypeId ? <CareStatus message="Select a care guide type to continue." />
            : selection.matchedGuides.length > 1 && !selection.selectedGuideId ? <CareStatus message="Select a care guide to see its recommendations." />
              : selectedGuide ? <div className="mt-7"><div className="rounded-[2rem] bg-[#f3faef] p-6"><h3 className="text-xl font-bold text-[#153f2f]">{selectedGuide.name || "Care guide"}</h3>{plainText(selectedGuide.description) ? <RichHtml content={selectedGuide.description ?? ""} className="mt-3" /> : null}</div>{isLoadingInformation ? <CareStatus message="Loading recommendations..." /> : visibleInformation.length ? <div className="mt-5 space-y-4">{visibleInformation.map((item) => <article key={item.id} className="rounded-[2rem] border border-emerald-950/10 bg-white p-6"><p className="eyebrow">{item.category?.name || "Care tip"}</p><RichHtml content={item.content ?? ""} className="mt-3" /><button type="button" disabled={ratedIds.has(item.id) || ratingIds.has(item.id)} onClick={() => void rate(item)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#12613f] disabled:opacity-60"><ThumbsUp className="h-4 w-4" />{ratedIds.has(item.id) ? "Marked useful" : ratingIds.has(item.id) ? "Saving..." : "Useful"}<span className="font-normal text-[#71877c]">({item.usefulnessRateCount})</span></button></article>)}</div> : <CareStatus message="No care information is available for this guide yet." />}{ratingError ? <p role="alert" className="mt-4 text-sm font-bold text-red-700">{ratingError}</p> : null}</div> : null}
    </section>
  );
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; placeholder: string }) {
  return <label className="form-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="form-input"><option value="">{placeholder}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function CareStatus({ message }: { message: string }) {
  return <div className="mt-7 flex items-center gap-3 rounded-[2rem] bg-[#f3faef] p-6 text-[#557064]"><MapPin className="h-5 w-5 shrink-0 text-[#40916c]" /><p>{message}</p></div>;
}

async function resolveLocation(latitude: number, longitude: number): Promise<PostalCodeResult> {
  const response = await fetch(`/api/location/postal-code?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`);
  const result = await response.json() as PostalCodeResult;
  if (!response.ok) throw new Error(result.message || "Postal-code detection failed.");
  return result;
}

function sortInformation(items: CareInformation[]): CareInformation[] {
  return [...items].sort((left, right) => categoryOrder(left.category?.order) - categoryOrder(right.category?.order));
}

function categoryOrder(value?: string): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : Number.MAX_SAFE_INTEGER;
}
