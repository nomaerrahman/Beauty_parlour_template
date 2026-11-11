"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Check, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories, services } from "@/data/services";
import type { CategoryId } from "@/lib/types";
import { cn, formatDuration, formatPriceRange } from "@/lib/utils";
import { PackageBuilder } from "./PackageBuilder";

export function TreatmentMenu() {
  const { openBooking } = useBooking();
  const [cat, setCat] = useState<CategoryId>("hair");
  const list = services.filter((s) => s.category === cat);
  const [activeId, setActiveId] = useState(list[0].id);
  const active = services.find((s) => s.id === activeId) ?? list[0];
  const category = categories.find((c) => c.id === cat)!;

  const changeCategory = (id: CategoryId) => {
    setCat(id);
    setActiveId(services.find((s) => s.category === id)!.id);
  };

  return (
    <section id="treatments" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading
          title="The treatment menu"
          intro="Every visit starts with a short consultation, so prices show a range. Your specialist confirms the final price before they begin."
        />

        {/* Category tabs */}
        <LayoutGroup id="treatment-tabs">
          <div
            role="tablist"
            aria-label="Treatment categories"
            className="no-scrollbar -mx-5 mb-12 flex gap-1 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={cat === c.id}
                aria-controls="treatment-panel"
                onClick={() => changeCategory(c.id)}
                className={cn(
                  "relative shrink-0 rounded-full px-5 py-3 text-[0.95rem] transition-colors",
                  cat === c.id ? "text-champagne" : "text-slate/75 hover:text-slate",
                )}
              >
                {cat === c.id && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 -z-0 rounded-full bg-slate"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{c.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <div id="treatment-panel" role="tabpanel" className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Sticky preview image */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-petal bg-linen">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SmartImage src={active.image} alt={active.title} fill sizes="45vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate/70 to-transparent p-8 pt-24 text-champagne">
                <p className="font-display text-3xl">{category.label}</p>
                <p className="mt-1 text-champagne/80">{category.blurb}</p>
              </div>
            </div>
          </div>

          {/* Menu list */}
          <AnimatePresence mode="wait">
            <motion.ul
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="divide-y divide-slate/10 border-y border-slate/10"
            >
              <p className="py-4 text-mist lg:hidden">{category.blurb}</p>
              {list.map((s) => {
                const open = s.id === active.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveId(s.id)}
                      aria-expanded={open}
                      className="group flex w-full items-baseline gap-4 py-6 text-left"
                    >
                      <span className="flex-1">
                        <span className="flex flex-wrap items-center gap-3">
                          <span
                            className={cn(
                              "font-display text-2xl transition-colors md:text-[1.75rem]",
                              open ? "text-slate" : "text-slate/70 group-hover:text-slate",
                            )}
                          >
                            {s.title}
                          </span>
                          {s.popular && (
                            <span className="rounded-full bg-gold/45 px-2.5 py-0.5 text-xs text-bronze-deep">
                              Client favourite
                            </span>
                          )}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-sm text-mist">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(s.duration)}
                        </span>
                      </span>
                      <span className="shrink-0 font-medium">{formatPriceRange(s.priceFrom, s.priceTo)}</span>
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pb-7">
                            <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-2xl bg-linen lg:hidden">
                              <SmartImage src={s.image} alt={s.title} fill sizes="100vw" className="object-cover" />
                            </div>
                            <p className="max-w-xl text-slate/80">{s.description}</p>
                            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                              {s.benefits.map((b) => (
                                <li key={b} className="flex items-start gap-2 text-sm">
                                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-bronze-deep" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                            <Button className="mt-6" onClick={() => openBooking({ serviceIds: [s.id] })}>
                              <Plus className="h-4 w-4" />
                              Select &amp; Book
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>

        <PackageBuilder />
      </div>
    </section>
  );
}
