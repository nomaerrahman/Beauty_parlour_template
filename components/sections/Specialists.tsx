"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Award, CalendarCheck, Instagram } from "lucide-react";
import { useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { specialists, specialtyFilters } from "@/data/specialists";
import type { Specialist } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Specialists() {
  const [filter, setFilter] = useState<(typeof specialtyFilters)[number]>("All");
  const list = filter === "All" ? specialists : specialists.filter((s) => s.specialty === filter);

  return (
    <section id="specialists" className="bg-linen/60 py-24 md:py-32">
      <div className="container">
        <SectionHeading
          title="Meet your specialists"
          intro="Senior artists only, each with at least seven years behind the chair. Hover or tap a portrait for their credentials and recent work."
        />

        <LayoutGroup id="specialist-filter">
          <div className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter by specialty">
            {specialtyFilters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={cn(
                  "relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                  filter === f ? "border-slate text-champagne" : "border-slate/15 text-slate/80 hover:border-bronze",
                )}
              >
                {filter === f && (
                  <motion.span layoutId="spec-pill" className="absolute inset-0 rounded-full bg-slate" />
                )}
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>

        <motion.ul layout className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((sp) => (
              <motion.li
                key={sp.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <SpecialistCard sp={sp} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

function SpecialistCard({ sp }: { sp: Specialist }) {
  const { openBooking } = useBooking();
  const [revealed, setRevealed] = useState(false);
  const firstName = sp.name.split(" ")[0];

  return (
    <article
      className="group"
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
    >
      <button
        onClick={() => setRevealed((r) => !r)}
        aria-expanded={revealed}
        aria-label={`${revealed ? "Hide" : "Show"} details for ${sp.name}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-arch bg-linen text-left"
      >
        <SmartImage
          src={sp.image}
          alt={sp.name}
          fill
          sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
          className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
        />
        {/* Glass reveal panel */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="glass-dark absolute inset-x-3 bottom-3 rounded-[1.25rem] p-5 text-champagne"
            >
              <p className="text-sm text-champagne/75">{sp.bio}</p>
              <ul className="mt-3 space-y-1">
                {sp.certifications.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm">
                    <Award className="h-3.5 w-3.5 shrink-0 text-gold" /> {c}
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {sp.portfolio.map((p, i) => (
                  <span key={i} className="relative aspect-square overflow-hidden rounded-lg bg-white/10">
                    <SmartImage src={p} alt="" fill sizes="80px" className="object-cover" />
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl">{sp.name}</h3>
          <p className="text-mist">{sp.role}</p>
          <a
            href={`https://instagram.com/${sp.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm text-bronze-deep hover:underline"
          >
            <Instagram className="h-4 w-4" />@{sp.instagram}
          </a>
        </div>
        <button
          onClick={() => openBooking({ specialistId: sp.id })}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate/15 px-4 py-2 text-sm transition hover:border-bronze hover:bg-bronze/10"
        >
          <CalendarCheck className="h-4 w-4" /> Book {firstName}
        </button>
      </div>
    </article>
  );
}
