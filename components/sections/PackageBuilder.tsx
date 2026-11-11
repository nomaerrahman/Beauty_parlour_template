"use client";

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Check, Clock, Gift, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { categories, services } from "@/data/services";
import { BUNDLE_DISCOUNT, BUNDLE_THRESHOLD, bundleFactor, cn, formatDuration, formatPrice } from "@/lib/utils";

/** Animated number for the live estimate */
function Counter({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => format(Math.round(v)));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

export function PackageBuilder() {
  const { openBooking } = useBooking();
  const [selected, setSelected] = useState<string[]>(["glass-skin", "silk-blowout", "builder-gel"]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const totals = useMemo(() => {
    const items = services.filter((s) => selected.includes(s.id));
    const min = items.reduce((n, s) => n + s.priceFrom, 0);
    const max = items.reduce((n, s) => n + s.priceTo, 0);
    const factor = bundleFactor(items.length);
    const bundle = factor < 1;
    return {
      count: items.length,
      duration: items.reduce((n, s) => n + s.duration, 0),
      min: min * factor,
      max: max * factor,
      saving: bundle ? Math.round(min * BUNDLE_DISCOUNT) : 0,
      bundle,
    };
  }, [selected]);

  return (
    <Reveal className="mt-24 overflow-hidden rounded-[2.5rem] bg-slate text-champagne">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr]">
        <div className="p-8 md:p-12">
          <h3 className="text-display-md">Build your own beauty day</h3>
          <p className="mt-3 max-w-lg text-champagne/70">
            Tick the treatments you&rsquo;d like. Choose {BUNDLE_THRESHOLD} or more and we take{" "}
            {BUNDLE_DISCOUNT * 100}% off the package.
          </p>

          <div className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {categories.map((c) => (
              <fieldset key={c.id}>
                <legend className="mb-3 font-display text-lg text-gold">{c.label}</legend>
                <ul className="space-y-1">
                  {services
                    .filter((s) => s.category === c.id)
                    .map((s) => {
                      const on = selected.includes(s.id);
                      return (
                        <li key={s.id}>
                          <label className="group flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={on}
                              onChange={() => toggle(s.id)}
                            />
                            <span
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition peer-focus-visible:ring-2 peer-focus-visible:ring-gold",
                                on ? "border-gold bg-gold text-slate" : "border-champagne/30",
                              )}
                            >
                              {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                            </span>
                            <span className="flex-1 text-[0.95rem]">{s.title}</span>
                            <span className="text-sm text-champagne/55">{formatPrice(s.priceFrom)}+</span>
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </fieldset>
            ))}
          </div>
        </div>

        {/* Live estimate */}
        <aside className="relative flex flex-col border-t border-white/10 bg-white/[0.04] p-8 md:p-12 lg:border-l lg:border-t-0">
          <div className="lg:sticky lg:top-28">
            <p className="text-champagne/60">Your package</p>
            <p className="mt-1 font-display text-2xl">
              {totals.count === 0 ? "Nothing selected" : `${totals.count} treatment${totals.count > 1 ? "s" : ""}`}
            </p>

            <dl className="mt-10 space-y-6">
              <div>
                <dt className="flex items-center gap-2 text-sm text-champagne/60">
                  <Clock className="h-4 w-4" /> Time in the lounge
                </dt>
                <dd className="mt-1 font-display text-4xl">
                  {totals.duration ? formatDuration(totals.duration) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-champagne/60">Estimated price</dt>
                <dd className="mt-1 font-display text-4xl">
                  {totals.count ? (
                    <>
                      <Counter value={totals.min} format={formatPrice} />
                      {totals.max !== totals.min && (
                        <span className="text-champagne/60">
                          {" "}– <Counter value={totals.max} format={formatPrice} />
                        </span>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>

            <AnimatePresence>
              {totals.bundle ? (
                <motion.p
                  key="saving"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex items-center gap-2 rounded-xl bg-gold/15 px-4 py-3 text-sm text-gold"
                >
                  <Gift className="h-4 w-4" /> Package saving of about {formatPrice(totals.saving)}
                </motion.p>
              ) : totals.count > 0 ? (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 text-sm text-champagne/60"
                >
                  Add {BUNDLE_THRESHOLD - totals.count} more to unlock {BUNDLE_DISCOUNT * 100}% off.
                </motion.p>
              ) : null}
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                size="lg"
                disabled={!totals.count}
                onClick={() => openBooking({ serviceIds: selected })}
                className="bg-gold text-slate hover:bg-champagne hover:text-slate disabled:bg-white/10 disabled:text-champagne/40"
              >
                Book this package
              </Button>
              {totals.count > 0 && (
                <button
                  onClick={() => setSelected([])}
                  className="inline-flex items-center justify-center gap-2 py-2 text-sm text-champagne/60 hover:text-champagne"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Clear selection
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </Reveal>
  );
}
