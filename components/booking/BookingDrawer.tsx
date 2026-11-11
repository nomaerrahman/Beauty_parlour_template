"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Clock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn, formatDuration, formatPriceRange } from "@/lib/utils";
import { BOOKING_STEPS, useBooking } from "./BookingProvider";
import { Confirmation, StepAddOns, StepDateTime, StepDetails, StepService, StepSpecialist, detailsValid } from "./BookingSteps";

export function BookingDrawer() {
  const { isOpen, closeBooking, step, setStep, next, back, draft, totals, confirmed, confirm } = useBooking();
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(1);
  const [showErrors, setShowErrors] = useState(false);

  // Escape to close, lock page scroll, move focus into the drawer
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeBooking();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [isOpen, closeBooking]);

  useEffect(() => setShowErrors(false), [step]);

  const canContinue = [
    draft.serviceIds.length > 0,
    draft.specialistId !== null,
    !!draft.date && !!draft.time,
    true,
    detailsValid(draft.customer),
  ][step];

  const goNext = () => {
    if (step === BOOKING_STEPS.length - 1) {
      if (!canContinue) return setShowErrors(true);
      return confirm();
    }
    setDirection(1);
    next();
  };
  const goBack = () => {
    setDirection(-1);
    back();
  };
  const jumpTo = (i: number) => {
    if (i >= step) return;
    setDirection(-1);
    setStep(i);
  };

  const StepComponent = [StepService, StepSpecialist, StepDateTime, StepAddOns, StepDetails][step];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="booking-title">
          <motion.div
            className="absolute inset-0 bg-slate/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBooking}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col bg-champagne shadow-2xl outline-none sm:rounded-l-petal"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            {/* Header */}
            <div className="border-b hairline px-6 pb-4 pt-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-mist">AURA Beauty Lounge</p>
                  <h2 id="booking-title" className="mt-1 text-3xl">
                    {confirmed ? "You're booked" : "Book an appointment"}
                  </h2>
                </div>
                <button
                  onClick={closeBooking}
                  className="rounded-full p-2 text-slate transition hover:bg-linen"
                  aria-label="Close booking"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!confirmed && (
                <ol className="mt-6 grid grid-cols-5 gap-2" aria-label="Booking progress">
                  {BOOKING_STEPS.map((label, i) => (
                    <li key={label}>
                      <button
                        onClick={() => jumpTo(i)}
                        disabled={i >= step}
                        className="group w-full text-left disabled:cursor-default"
                        aria-current={i === step ? "step" : undefined}
                      >
                        <span className="block h-1 overflow-hidden rounded-full bg-linen">
                          <motion.span
                            className="block h-full rounded-full bg-bronze"
                            initial={false}
                            animate={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
                            transition={{ duration: 0.5 }}
                          />
                        </span>
                        <span
                          className={cn(
                            "mt-2 hidden text-xs sm:block",
                            i === step ? "text-slate" : "text-mist",
                            i < step && "group-hover:text-bronze-deep",
                          )}
                        >
                          {i + 1}. {label}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              )}
              {!confirmed && (
                <p className="mt-3 text-sm text-mist sm:hidden">
                  Step {step + 1} of {BOOKING_STEPS.length}: {BOOKING_STEPS[step]}
                </p>
              )}
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 sm:px-8">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={confirmed ? "done" : step}
                  custom={direction}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  {confirmed ? <Confirmation /> : <StepComponent showErrors={showErrors} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer summary + navigation */}
            {!confirmed && (
              <div className="border-t hairline bg-porcelain/70 px-6 py-4 backdrop-blur sm:px-8">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-mist">
                    <Clock className="h-4 w-4" />
                    {totals.duration ? formatDuration(totals.duration) : "No treatments yet"}
                  </span>
                  <span className="font-medium">
                    {totals.min ? `Est. ${formatPriceRange(totals.min, totals.max)}` : ""}
                  </span>
                </div>
                <div className="flex gap-3">
                  {step > 0 && (
                    <Button variant="outline" onClick={goBack} aria-label="Previous step">
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    onClick={goNext}
                    disabled={step < BOOKING_STEPS.length - 1 && !canContinue}
                  >
                    {step === BOOKING_STEPS.length - 1
                      ? "Confirm booking"
                      : step === 3 && draft.addOnIds.length === 0
                        ? "Continue without add-ons"
                        : `Continue to ${BOOKING_STEPS[step + 1].toLowerCase()}`}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
