"use client";

import { motion } from "framer-motion";
import { CalendarPlus, Check, ChevronLeft, ChevronRight, Sparkles, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Button } from "@/components/ui/Button";
import { addOns, categories, getAddOn, getService, services } from "@/data/services";
import { getSpecialist, specialists } from "@/data/specialists";
import { site } from "@/data/site";
import {
  addMinutesToTime,
  formatTime12,
  fromISODate,
  isDayBookable,
  slotsFor,
  toISODate,
} from "@/lib/availability";
import type { BookingDraft, CategoryId } from "@/lib/types";
import { cn, formatDuration, formatPrice, formatPriceRange } from "@/lib/utils";
import { useBooking } from "./BookingProvider";

type StepProps = { showErrors?: boolean };

const StepIntro = ({ title, text }: { title: string; text: string }) => (
  <div className="mb-6">
    <h3 className="text-2xl">{title}</h3>
    <p className="mt-1 text-mist">{text}</p>
  </div>
);

/* ------------------------------------------------------------------ */
/* 1. Service                                                          */
/* ------------------------------------------------------------------ */
export function StepService() {
  const { draft, toggleService } = useBooking();
  const firstSelected = draft.serviceIds[0] ? getService(draft.serviceIds[0])?.category : undefined;
  const [cat, setCat] = useState<CategoryId>(firstSelected ?? "hair");

  return (
    <div>
      <StepIntro title="Choose your treatments" text="Pick one or several. We'll schedule them back to back." />
      <div className="no-scrollbar -mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist">
        {categories.map((c) => {
          const count = draft.serviceIds.filter((id) => getService(id)?.category === c.id).length;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={cat === c.id}
              onClick={() => setCat(c.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm transition",
                cat === c.id ? "border-slate bg-slate text-champagne" : "border-slate/15 hover:border-bronze",
              )}
            >
              {c.label}
              {count > 0 && <span className="ml-2 rounded-full bg-bronze px-1.5 text-xs text-slate">{count}</span>}
            </button>
          );
        })}
      </div>
      <ul className="space-y-3">
        {services
          .filter((s) => s.category === cat)
          .map((s) => {
            const selected = draft.serviceIds.includes(s.id);
            return (
              <li key={s.id}>
                <button
                  onClick={() => toggleService(s.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition",
                    selected ? "border-bronze bg-bronze/10" : "border-slate/10 bg-porcelain hover:border-bronze/60",
                  )}
                >
                  <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-arch-sm bg-linen">
                    <SmartImage src={s.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{s.title}</span>
                    <span className="block text-sm text-mist">
                      {formatDuration(s.duration)} · {formatPriceRange(s.priceFrom, s.priceTo)}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                      selected ? "border-bronze bg-bronze text-slate" : "border-slate/25",
                    )}
                  >
                    {selected && <Check className="h-3.5 w-3.5" />}
                  </span>
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Specialist                                                       */
/* ------------------------------------------------------------------ */
export function StepSpecialist() {
  const { draft, update } = useBooking();
  const neededCats = new Set(draft.serviceIds.map((id) => getService(id)?.category));
  const matching = specialists.filter((sp) => sp.categories.some((c) => neededCats.has(c)));
  const list = matching.length ? matching : specialists;

  const choose = (id: string) => update({ specialistId: id, time: null });

  return (
    <div>
      <StepIntro
        title="Who would you like to see?"
        text="Specialists shown are trained in the treatments you picked."
      />
      <div className="space-y-3">
        <button
          onClick={() => choose("any")}
          aria-pressed={draft.specialistId === "any"}
          className={cn(
            "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition",
            draft.specialistId === "any" ? "border-bronze bg-bronze/10" : "border-slate/10 bg-porcelain hover:border-bronze/60",
          )}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/40">
            <Sparkles className="h-6 w-6 text-bronze-deep" />
          </span>
          <span className="flex-1">
            <span className="block font-medium">First available</span>
            <span className="block text-sm text-mist">The widest choice of times with any senior specialist</span>
          </span>
          {draft.specialistId === "any" && <Check className="h-5 w-5 text-bronze-deep" />}
        </button>
        {list.map((sp) => {
          const selected = draft.specialistId === sp.id;
          return (
            <button
              key={sp.id}
              onClick={() => choose(sp.id)}
              aria-pressed={selected}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition",
                selected ? "border-bronze bg-bronze/10" : "border-slate/10 bg-porcelain hover:border-bronze/60",
              )}
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-linen">
                <SmartImage src={sp.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{sp.name}</span>
                <span className="block text-sm text-mist">
                  {sp.role} · {sp.yearsExperience} yrs
                </span>
              </span>
              {selected && <Check className="h-5 w-5 text-bronze-deep" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Date & time                                                      */
/* ------------------------------------------------------------------ */
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function StepDateTime() {
  const { draft, update, totals } = useBooking();
  const today = new Date();
  const initial = draft.date ? fromISODate(draft.date) : today;
  const [view, setView] = useState(new Date(initial.getFullYear(), initial.getMonth(), 1));

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // Monday-first grid
    const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: count }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
    ];
  }, [view]);

  const slots = draft.date ? slotsFor(draft.date, totals.duration, draft.specialistId) : [];
  const canGoBack = view > new Date(today.getFullYear(), today.getMonth(), 1);
  const maxView = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const canGoForward = view < maxView;
  const specialist = draft.specialistId && draft.specialistId !== "any" ? getSpecialist(draft.specialistId) : null;

  return (
    <div>
      <StepIntro
        title="Pick a date and time"
        text={specialist ? `Showing ${specialist.name.split(" ")[0]}'s working days.` : "Closed Mondays. Late opening Thursday and Friday."}
      />

      <div className="rounded-2xl border hairline bg-porcelain p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
            disabled={!canGoBack}
            className="rounded-full p-2 hover:bg-linen disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="font-display text-lg">
            {view.toLocaleDateString(site.locale, { month: "long", year: "numeric" })}
          </p>
          <button
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
            disabled={!canGoForward}
            className="rounded-full p-2 hover:bg-linen disabled:opacity-30"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-mist">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1">{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const iso = toISODate(d);
            const bookable =
              isDayBookable(d, draft.specialistId) &&
              slotsFor(iso, totals.duration, draft.specialistId).some((s) => s.available);
            const selected = draft.date === iso;
            const isToday = toISODate(today) === iso;
            return (
              <button
                key={iso}
                disabled={!bookable}
                onClick={() => update({ date: iso, time: null })}
                aria-pressed={selected}
                aria-label={d.toLocaleDateString(site.locale, { weekday: "long", day: "numeric", month: "long" })}
                className={cn(
                  "relative aspect-square rounded-full text-sm transition",
                  bookable ? "hover:bg-bronze/15" : "cursor-not-allowed text-slate/25 line-through decoration-slate/20",
                  selected && "bg-slate text-champagne hover:bg-slate",
                )}
              >
                {d.getDate()}
                {isToday && !selected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-bronze" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {draft.date && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="mb-3 font-medium">
            {fromISODate(draft.date).toLocaleDateString(site.locale, { weekday: "long", day: "numeric", month: "long" })}
          </p>
          {slots.some((s) => s.available) ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => (
                <button
                  key={s.time}
                  disabled={!s.available}
                  onClick={() => update({ time: s.time })}
                  aria-pressed={draft.time === s.time}
                  className={cn(
                    "rounded-full border py-2 text-sm transition",
                    !s.available && "cursor-not-allowed border-transparent bg-linen/60 text-slate/30 line-through",
                    s.available && draft.time !== s.time && "border-slate/15 bg-porcelain hover:border-bronze",
                    draft.time === s.time && "border-slate bg-slate text-champagne",
                  )}
                >
                  {formatTime12(s.time)}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-linen p-4 text-sm">
              No times left on this day for a {formatDuration(totals.duration)} visit. Try another date or choose
              &ldquo;First available&rdquo;.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Add-ons                                                          */
/* ------------------------------------------------------------------ */
export function StepAddOns() {
  const { draft, toggleAddOn } = useBooking();
  return (
    <div>
      <StepIntro title="Anything extra?" text="Small add-ons that fit into your visit. Entirely optional." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {addOns.map((a) => {
          const selected = draft.addOnIds.includes(a.id);
          return (
            <li key={a.id}>
              <button
                onClick={() => toggleAddOn(a.id)}
                aria-pressed={selected}
                className={cn(
                  "flex h-full w-full flex-col rounded-2xl border p-4 text-left transition",
                  selected ? "border-bronze bg-bronze/10" : "border-slate/10 bg-porcelain hover:border-bronze/60",
                )}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-medium">{a.title}</span>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      selected ? "border-bronze bg-bronze text-slate" : "border-slate/25",
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                </span>
                <span className="mt-1 text-sm text-mist">{a.description}</span>
                <span className="mt-3 text-sm">
                  +{formatPrice(a.price)}
                  {a.duration > 0 && <span className="text-mist"> · {a.duration} min</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Details & summary                                                */
/* ------------------------------------------------------------------ */
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v: string) => v.replace(/[^\d]/g, "").length >= 10;

export function detailsValid(c: BookingDraft["customer"]) {
  return c.name.trim().length > 1 && emailOk(c.email) && phoneOk(c.phone);
}

function Field({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm">{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        className={cn(
          "h-12 w-full rounded-xl border bg-porcelain px-4 outline-none transition placeholder:text-slate/35 focus:border-bronze focus:ring-2 focus:ring-bronze/25",
          error ? "border-red-400" : "border-slate/15",
        )}
      />
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}

function Summary() {
  const { draft, totals } = useBooking();
  const sp = draft.specialistId && draft.specialistId !== "any" ? getSpecialist(draft.specialistId) : null;
  return (
    <div className="rounded-2xl bg-linen/70 p-5 text-sm">
      <ul className="space-y-2">
        {draft.serviceIds.map((id) => {
          const s = getService(id)!;
          return (
            <li key={id} className="flex justify-between gap-4">
              <span>{s.title}</span>
              <span className="text-mist">{formatPriceRange(s.priceFrom, s.priceTo)}</span>
            </li>
          );
        })}
        {draft.addOnIds.map((id) => {
          const a = getAddOn(id)!;
          return (
            <li key={id} className="flex justify-between gap-4 text-mist">
              <span>+ {a.title}</span>
              <span>{formatPrice(a.price)}</span>
            </li>
          );
        })}
      </ul>
      {totals.packageDiscount && (
        <p className="mt-3 text-bronze-deep">Package price: 10% off treatments applied</p>
      )}
      <div className="mt-4 space-y-1 border-t border-slate/10 pt-4">
        <p className="flex items-center gap-2">
          <UserRound className="h-4 w-4 text-bronze-deep" />
          {sp ? sp.name : "First available specialist"}
        </p>
        {draft.date && draft.time && (
          <p className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4 text-bronze-deep" />
            {fromISODate(draft.date).toLocaleDateString(site.locale, { weekday: "short", day: "numeric", month: "short" })},{" "}
            {formatTime12(draft.time)}–{formatTime12(addMinutesToTime(draft.time, totals.duration))}
          </p>
        )}
      </div>
    </div>
  );
}

export function StepDetails({ showErrors }: StepProps) {
  const { draft, update } = useBooking();
  const c = draft.customer;
  const set = (k: keyof typeof c) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    update({ customer: { ...c, [k]: e.target.value } });

  return (
    <div>
      <StepIntro title="Your details" text="We'll send a confirmation and a reminder the day before." />
      <div className="space-y-4">
        <Field
          label="Full name"
          autoComplete="name"
          value={c.name}
          onChange={set("name")}
          placeholder="Charlotte Williams"
          error={showErrors && c.name.trim().length < 2 ? "Enter your name" : undefined}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            type="email"
            autoComplete="email"
            value={c.email}
            onChange={set("email")}
            placeholder="you@example.com"
            error={showErrors && !emailOk(c.email) ? "Enter a valid email address" : undefined}
          />
          <Field
            label="Mobile"
            type="tel"
            autoComplete="tel"
            value={c.phone}
            onChange={set("phone")}
            placeholder="07700 900123"
            error={showErrors && !phoneOk(c.phone) ? "Enter a mobile number with at least 10 digits" : undefined}
          />
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm">Notes for your specialist (optional)</span>
          <textarea
            value={c.notes}
            onChange={set("notes")}
            rows={3}
            placeholder="Allergies, inspiration photos, accessibility needs…"
            className="w-full rounded-xl border border-slate/15 bg-porcelain px-4 py-3 outline-none transition placeholder:text-slate/35 focus:border-bronze focus:ring-2 focus:ring-bronze/25"
          />
        </label>
      </div>
      <div className="mt-6">
        <Summary />
      </div>
      <p className="mt-4 text-xs text-mist">
        Free cancellation up to 24 hours before. No payment is taken now.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Confirmation                                                        */
/* ------------------------------------------------------------------ */
function downloadIcs(draft: BookingDraft, duration: number, ref: string) {
  if (!draft.date || !draft.time) return;
  const start = fromISODate(draft.date);
  const [h, m] = draft.time.split(":").map(Number);
  start.setHours(h, m);
  const end = new Date(start.getTime() + duration * 60000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const titles = draft.serviceIds.map((id) => getService(id)?.title).join(", ");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AURA Beauty Lounge//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${ref}@aura-lounge`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${site.fullName} — ${titles}`,
    `LOCATION:${site.address.line1}, ${site.address.line2}`,
    `DESCRIPTION:Booking reference ${ref}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `aura-booking-${ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export function Confirmation() {
  const { draft, totals, confirmed, closeBooking, reset } = useBooking();
  const firstName = draft.customer.name.trim().split(" ")[0];
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/50 shadow-glow"
      >
        <Check className="h-9 w-9 text-bronze-deep" strokeWidth={2.4} />
      </motion.div>
      <h3 className="mt-6 text-3xl">See you soon{firstName ? `, ${firstName}` : ""}</h3>
      <p className="mx-auto mt-2 max-w-sm text-mist">
        Confirmation sent to {draft.customer.email}. Your reference is{" "}
        <span className="font-medium text-slate">{confirmed}</span>.
      </p>
      <div className="mt-8 text-left">
        <Summary />
        <p className="mt-3 text-right text-sm">
          Estimated total <span className="font-medium">{formatPriceRange(totals.min, totals.max)}</span>
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1" onClick={() => downloadIcs(draft, totals.duration, confirmed!)}>
          <CalendarPlus className="h-4 w-4" />
          Add to calendar
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            closeBooking();
            setTimeout(reset, 400);
          }}
        >
          Done
        </Button>
      </div>
      <p className="mt-6 text-xs text-mist">Demo only — no appointment has been created.</p>
    </div>
  );
}
