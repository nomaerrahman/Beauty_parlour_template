"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { gallery, galleryTags, transformations } from "@/data/gallery";
import { getSpecialist } from "@/data/specialists";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function Lookbook() {
  const [tag, setTag] = useState<(typeof galleryTags)[number]>("All");
  const [tIndex, setTIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = tag === "All" ? gallery : gallery.filter((g) => g.tag === tag);
  const t = transformations[tIndex];

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % items.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightbox, items.length]);

  return (
    <section id="lookbook" className="py-24 md:py-32">
      <div className="container">
        {/* Transformations */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <BeforeAfterSlider key={t.id} item={t} />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-display-lg text-balance">Transformations</h2>
            <p className="mt-5 max-w-md text-lg text-mist">
              Drag the handle to compare. Every result here comes from a single visit or a short course of
              treatments.
            </p>
            <ul className="mt-10 space-y-2">
              {transformations.map((tr, i) => (
                <li key={tr.id}>
                  <button
                    onClick={() => setTIndex(i)}
                    aria-pressed={i === tIndex}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition",
                      i === tIndex ? "border-bronze bg-bronze/10" : "border-slate/10 hover:border-bronze/50",
                    )}
                  >
                    <span>
                      <span className="block font-display text-xl">{tr.label}</span>
                      <span className="block text-sm text-mist">{tr.treatment}</span>
                    </span>
                    <span
                      className={cn("h-2.5 w-2.5 rounded-full transition", i === tIndex ? "bg-bronze" : "bg-slate/15")}
                    />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-mist">
              Demo visuals. Replace with consented client photos when customising.
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-28">
          <SectionHeading title="The lookbook" intro="Recent work from the studio, filtered by treatment.">
            <LayoutGroup id="gallery-filter">
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Filter gallery">
                {galleryTags.map((g) => (
                  <button
                    key={g}
                    onClick={() => setTag(g)}
                    aria-pressed={tag === g}
                    className={cn(
                      "relative shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                      tag === g ? "border-slate text-champagne" : "border-slate/15 hover:border-bronze",
                    )}
                  >
                    {tag === g && <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-slate" />}
                    <span className="relative">{g}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </SectionHeading>

          <motion.ul layout className="grid auto-rows-[240px] grid-flow-dense grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {items.map((g, i) => (
                <motion.li
                  key={g.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={cn(g.tall && "row-span-2")}
                >
                  <button
                    onClick={() => setLightbox(i)}
                    className="group relative block h-full w-full overflow-hidden rounded-petal bg-linen"
                    aria-label={`Open ${g.title}`}
                  >
                    <SmartImage
                      src={g.image}
                      alt={g.title}
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-slate/75 to-transparent p-5 pt-16 text-left text-champagne opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="block font-display text-xl">{g.title}</span>
                      <span className="text-sm text-champagne/75">
                        {g.tag} · by {getSpecialist(g.specialistId)?.name}
                      </span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && items[lightbox] && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate/85 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label={items[lightbox].title}
          >
            <motion.figure
              key={items[lightbox].id}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="relative h-[78vh] w-full max-w-3xl overflow-hidden rounded-petal bg-linen"
              onClick={(e) => e.stopPropagation()}
            >
              <SmartImage src={items[lightbox].image} alt={items[lightbox].title} fill sizes="90vw" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate/80 to-transparent p-6 pt-20 text-champagne">
                <span className="block font-display text-2xl">{items[lightbox].title}</span>
                <span className="text-sm text-champagne/75">{items[lightbox].tag}</span>
              </figcaption>
            </motion.figure>
            <button className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-champagne hover:bg-white/25" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-champagne hover:bg-white/25"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i! - 1 + items.length) % items.length);
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-champagne hover:bg-white/25"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((i) => (i! + 1) % items.length);
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
