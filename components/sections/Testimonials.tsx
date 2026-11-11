"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, Instagram, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/Stars";
import { instagramPosts } from "@/data/gallery";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;

export function Testimonials() {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const r = reviews[index];

  const go = (delta: number) => setState(([i]) => [(i + delta + reviews.length) % reviews.length, delta]);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, reduce]);

  return (
    <section id="reviews" className="bg-slate py-24 text-champagne md:py-32">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="text-display-lg">Kind words</h2>
          <p className="flex items-center gap-3 text-champagne/75">
            <span className="font-display text-3xl text-champagne">{site.rating}</span>
            <Stars rating={5} />
            from {site.reviewCount}+ reviews
          </p>
        </div>

        <div
          className="relative mt-14 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          aria-roledescription="carousel"
          aria-label="Client testimonials"
        >
          <div className="relative h-40 w-32 shrink-0 md:h-56 md:w-44">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={r.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 overflow-hidden rounded-arch border-4 border-champagne/10 bg-white/10"
              >
                <SmartImage src={r.avatar} alt={r.name} fill sizes="180px" className="object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="min-h-[300px]" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={r.id}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -40 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Stars rating={r.rating} />
                <blockquote className="mt-6 max-w-3xl font-display text-2xl leading-snug md:text-[2.1rem]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-center gap-3">
                  <span className="font-medium">{r.name}</span>
                  <span className="rounded-full border border-gold/40 px-3 py-1 text-sm text-gold">{r.treatment}</span>
                  <span className="text-sm text-champagne/50">{r.date}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-4">
              <button onClick={() => go(-1)} className="rounded-full border border-white/20 p-3 transition hover:bg-white/10" aria-label="Previous review">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={() => go(1)} className="rounded-full border border-white/20 p-3 transition hover:bg-white/10" aria-label="Next review">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="ml-2 flex gap-2">
                {reviews.map((rv, i) => (
                  <button
                    key={rv.id}
                    onClick={() => setState([i, i > index ? 1 : -1])}
                    aria-label={`Show review ${i + 1}`}
                    aria-current={i === index}
                    className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/15"
                  >
                    {i === index && (
                      <motion.span
                        key={`${r.id}-${paused}`}
                        className="absolute inset-y-0 left-0 bg-gold"
                        initial={{ width: paused || reduce ? "100%" : "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: paused || reduce ? 0 : INTERVAL / 1000, ease: "linear" }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPaused((p) => !p)}
                className="ml-auto rounded-full p-2 text-champagne/60 hover:text-champagne"
                aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Instagram feed */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="text-display-md">From the studio</h3>
              <p className="mt-2 text-champagne/65">Fresh work, posted daily.</p>
            </div>
            <a
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 transition hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" /> Follow @{site.instagram}
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {instagramPosts.map((p, i) => (
              <li key={p.id}>
                <a
                  href={`https://instagram.com/${site.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className={cn("group relative block aspect-square overflow-hidden rounded-2xl bg-white/10")}
                  aria-label={p.caption}
                >
                  <SmartImage src={p.image} alt="" fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate/60 p-3 text-center opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Heart className="h-4 w-4 fill-champagne" /> {p.likes.toLocaleString(site.locale)}
                    </span>
                    <span className="text-xs text-champagne/80">{p.caption}</span>
                  </span>
                  {i === 0 && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-slate/70 px-2 py-0.5 text-[0.7rem]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" /> New
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
