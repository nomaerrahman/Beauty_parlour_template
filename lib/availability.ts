import { site } from "@/data/site";
import { getSpecialist } from "@/data/specialists";

/** Mock availability engine — swap for a real booking API (Fresha, Square, Timely…) */

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function hoursFor(date: Date) {
  return site.hours.find((h) => h.day === WEEKDAY_NAMES[date.getDay()])!;
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const toTime = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;

/** Deterministic pseudo-random so "booked" slots stay stable between renders */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function isDayBookable(date: Date, specialistId: string | null) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return false;
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);
  if (date > maxDate) return false;
  if (!hoursFor(date).open) return false;
  if (specialistId && specialistId !== "any") {
    const sp = getSpecialist(specialistId);
    if (sp && !sp.workingDays.includes(date.getDay())) return false;
  }
  return true;
}

export interface Slot {
  time: string;
  available: boolean;
}

export function slotsFor(iso: string, durationMins: number, specialistId: string | null): Slot[] {
  const date = fromISODate(iso);
  const hours = hoursFor(date);
  if (!hours.open || !hours.close) return [];
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  const length = Math.max(durationMins, 30);
  const now = new Date();
  const isToday = toISODate(now) === iso;
  const nowMins = now.getHours() * 60 + now.getMinutes() + 60; // 1hr booking notice

  const slots: Slot[] = [];
  for (let t = open; t + length <= close; t += 30) {
    const time = toTime(t);
    // "First available" sees more open slots because any specialist will do
    const busyChance = specialistId === "any" ? 0.18 : 0.38;
    const busy = hash(`${iso}-${time}-${specialistId ?? "any"}`) < busyChance;
    slots.push({ time, available: !busy && !(isToday && t < nowMins) });
  }
  return slots;
}

export function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hh}${suffix}` : `${hh}:${String(m).padStart(2, "0")}${suffix}`;
}

export function addMinutesToTime(t: string, mins: number) {
  return toTime(toMinutes(t) + mins);
}

/** Next bookable date (used by the hero "Check availability" bar) */
export function nextOpenDate(specialistId: string | null = null, durationMins = 60) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 60; i++) {
    const iso = toISODate(d);
    if (isDayBookable(d, specialistId) && slotsFor(iso, durationMins, specialistId).some((s) => s.available))
      return iso;
    d.setDate(d.getDate() + 1);
  }
  return toISODate(new Date());
}
