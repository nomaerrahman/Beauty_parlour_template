"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { BookingDraft } from "@/lib/types";
import { getAddOn, getService } from "@/data/services";
import { bundleFactor } from "@/lib/utils";

export const BOOKING_STEPS = ["Treatment", "Specialist", "Date & time", "Add-ons", "Your details"] as const;

const emptyDraft = (): BookingDraft => ({
  serviceIds: [],
  specialistId: null,
  date: null,
  time: null,
  addOnIds: [],
  customer: { name: "", email: "", phone: "", notes: "" },
});

interface OpenOptions {
  serviceIds?: string[];
  specialistId?: string;
  date?: string;
}

interface BookingContextValue {
  isOpen: boolean;
  step: number;
  confirmed: string | null; // booking reference once confirmed
  draft: BookingDraft;
  totals: { duration: number; min: number; max: number; packageDiscount: boolean };
  openBooking: (opts?: OpenOptions) => void;
  closeBooking: () => void;
  setStep: (s: number) => void;
  next: () => void;
  back: () => void;
  update: (patch: Partial<BookingDraft>) => void;
  toggleService: (id: string) => void;
  toggleAddOn: (id: string) => void;
  confirm: () => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const openBooking = useCallback((opts: OpenOptions = {}) => {
    setConfirmed(null);
    setDraft((d) => {
      // Start fresh if the previous booking was completed
      const base = confirmed ? emptyDraft() : d;
      return {
        ...base,
        serviceIds: opts.serviceIds ?? base.serviceIds,
        specialistId: opts.specialistId ?? base.specialistId,
        date: opts.date ?? base.date,
        // a new specialist or date invalidates the chosen slot
        time: opts.specialistId || opts.date ? null : base.time,
      };
    });
    // Jump past steps that the entry point already answered
    if (opts.serviceIds?.length && opts.specialistId) setStep(2);
    else if (opts.serviceIds?.length) setStep(1);
    else setStep(0);
    setOpen(true);
  }, [confirmed]);

  const closeBooking = useCallback(() => setOpen(false), []);

  const update = useCallback((patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch })), []);

  const toggleService = useCallback(
    (id: string) =>
      setDraft((d) => ({
        ...d,
        serviceIds: d.serviceIds.includes(id) ? d.serviceIds.filter((s) => s !== id) : [...d.serviceIds, id],
        time: null, // duration changed, so re-pick a slot
      })),
    [],
  );

  const toggleAddOn = useCallback(
    (id: string) =>
      setDraft((d) => ({
        ...d,
        addOnIds: d.addOnIds.includes(id) ? d.addOnIds.filter((a) => a !== id) : [...d.addOnIds, id],
      })),
    [],
  );

  const totals = useMemo(() => {
    const svc = draft.serviceIds.map(getService).filter(Boolean);
    const add = draft.addOnIds.map(getAddOn).filter(Boolean);
    const addPrice = add.reduce((n, a) => n + a!.price, 0);
    const factor = bundleFactor(svc.length);
    return {
      duration: svc.reduce((n, s) => n + s!.duration, 0) + add.reduce((n, a) => n + a!.duration, 0),
      min: Math.round(svc.reduce((n, s) => n + s!.priceFrom, 0) * factor) + addPrice,
      max: Math.round(svc.reduce((n, s) => n + s!.priceTo, 0) * factor) + addPrice,
      packageDiscount: factor < 1,
    };
  }, [draft.serviceIds, draft.addOnIds]);

  const confirm = useCallback(() => {
    const ref = "AURA-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    setConfirmed(ref);
  }, []);

  const reset = useCallback(() => {
    setDraft(emptyDraft());
    setConfirmed(null);
    setStep(0);
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({
      isOpen,
      step,
      confirmed,
      draft,
      totals,
      openBooking,
      closeBooking,
      setStep,
      next: () => setStep((s) => Math.min(s + 1, BOOKING_STEPS.length - 1)),
      back: () => setStep((s) => Math.max(s - 1, 0)),
      update,
      toggleService,
      toggleAddOn,
      confirm,
      reset,
    }),
    [isOpen, step, confirmed, draft, totals, openBooking, closeBooking, update, toggleService, toggleAddOn, confirm, reset],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
