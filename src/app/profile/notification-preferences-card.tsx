"use client";

import { useEffect, useState } from "react";
import { Bell, Clock3, LoaderCircle } from "lucide-react";
import type { NotificationPreferences } from "@/models/users/notification-preferences";

const timeZones = ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];

export default function NotificationPreferencesCard() {
  const [value, setValue] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/users/me/notification-preferences", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Notification preferences could not be loaded.");
        setValue(await response.json() as NotificationPreferences);
      })
      .catch(error => setMessage(error instanceof Error ? error.message : "Notification preferences could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  function setType(type: "CARE-REMINDER" | "CARE-OVERDUE", isEnabled: boolean) {
    if (!value) return;
    setValue({ ...value, preferences: value.preferences.map(item =>
      item.notificationTypeCode === type ? { ...item, isEnabled } : item) });
  }

  async function save() {
    if (!value || saving) return;
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/users/me/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      const result = await response.json() as NotificationPreferences | { message?: string };
      if (!response.ok) throw new Error("message" in result ? result.message : "Notification preferences could not be saved.");
      setValue(result as NotificationPreferences);
      setMessage("Notification preferences saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Notification preferences could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-7 shadow-sm"><p className="flex items-center gap-2 text-[#557064]"><LoaderCircle className="h-5 w-5 animate-spin" />Loading notification preferences…</p></article>;
  if (!value) return <article className="rounded-[2rem] border border-red-900/10 bg-red-50 p-7 text-red-800">{message}</article>;
  const quietHoursEnabled = Boolean(value.quietHoursStart && value.quietHoursEnd);

  return <article className="rounded-[2rem] border border-emerald-950/10 bg-white p-7 shadow-sm">
    <h2 className="flex items-center gap-2 text-xl font-bold text-[#153f2f]"><Bell className="h-5 w-5" />Notifications</h2>
    <p className="mt-2 text-sm text-[#637b70]">Choose which care updates FamPlants may send to your registered devices.</p>
    <div className="mt-5 divide-y divide-emerald-950/10">
      <PreferenceToggle label="Allow notifications" description="Master control for all FamPlants messages." checked={value.areNotificationsEnabled} onChange={checked => setValue({ ...value, areNotificationsEnabled: checked })} />
      <PreferenceToggle label="Care reminders" description="Notify me when plant care is due." checked={enabled(value, "CARE-REMINDER")} disabled={!value.areNotificationsEnabled} onChange={checked => setType("CARE-REMINDER", checked)} />
      <PreferenceToggle label="Overdue care" description="Notify me when care remains overdue." checked={enabled(value, "CARE-OVERDUE")} disabled={!value.areNotificationsEnabled} onChange={checked => setType("CARE-OVERDUE", checked)} />
    </div>
    <div className="mt-5 grid gap-4 border-t border-emerald-950/10 pt-5 sm:grid-cols-2">
      <label className="text-sm font-bold text-[#153f2f]">Time zone<select className="form-input mt-2" value={value.timeZoneId} onChange={event => setValue({ ...value, timeZoneId: event.target.value })}>{timeZones.map(zone => <option key={zone}>{zone}</option>)}</select></label>
      <label className="flex items-center gap-3 text-sm font-bold text-[#153f2f]"><input type="checkbox" checked={quietHoursEnabled} onChange={event => setValue({ ...value, quietHoursStart: event.target.checked ? "22:00:00" : null, quietHoursEnd: event.target.checked ? "07:00:00" : null })} /> <Clock3 className="h-4 w-4" />Use quiet hours</label>
      {quietHoursEnabled ? <><TimeField label="Quiet hours start" value={value.quietHoursStart!} onChange={time => setValue({ ...value, quietHoursStart: `${time}:00` })} /><TimeField label="Quiet hours end" value={value.quietHoursEnd!} onChange={time => setValue({ ...value, quietHoursEnd: `${time}:00` })} /></> : null}
    </div>
    {message ? <p role="status" className={`mt-4 text-sm font-bold ${message.includes("saved") ? "text-emerald-800" : "text-red-700"}`}>{message}</p> : null}
    <button className="auth-button auth-button-primary mt-5 w-full" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save notification settings"}</button>
  </article>;
}

function enabled(value: NotificationPreferences, type: string) {
  return value.preferences.find(item => item.notificationTypeCode === type)?.isEnabled ?? true;
}

function PreferenceToggle({ label, description, checked, disabled, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center justify-between gap-5 py-4"><span><span className="block font-bold text-[#153f2f]">{label}</span><span className="block text-sm text-[#637b70]">{description}</span></span><input type="checkbox" checked={checked} disabled={disabled} onChange={event => onChange(event.target.checked)} className="h-5 w-5 accent-[#12613f]" /></label>;
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-sm font-bold text-[#153f2f]">{label}<input type="time" className="form-input mt-2" value={value.slice(0, 5)} onChange={event => onChange(event.target.value)} /></label>;
}
