"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CalendarCheck, ChevronDown, Sparkles, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Stars } from "@/components/ui/Stars";
import { categories, services } from "@/data/services";
import { site } from "@/data/site";
import { specialists } from "@/data/specialists";
import { nextOpenDate } from "@/lib/availability";
import { unsplash } from "@/lib/utils";

const HERO_BG = unsplash("1560066984-138dadb4c035", 2000);
const HERO_MIRROR = unsplash("1487412947147-5cebf100ffc2", 1200);

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { openBooking } = useBooking();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mirrorY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const [serviceId, setServiceId] = useState("");
  const [specialistId, setSpecialistId] = useState("");

  const lines = ["Elegance Redefined.", "Radiance Unlocked."];

  const check = () =>
    openBooking({
      serviceIds: serviceId ? [serviceId] : undefined,
      specialistId: specialistId || undefined,
      date:
        serviceId && specialistId
          ? nextOpenDate(specialistId, services.find((s) => s.id === serviceId)?.duration)
          : undefined,
    });

  return (
    <section ref={ref} id="top" className="relative isolate overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32">
      {/* Full-bleed editorial background, softened so the type leads */}
      <div className="absolute inset-0 -z-10">
        <SmartImage src={HERO_BG} alt="" fill priority sizes="100vw" className="scale-110 object-cover blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-champagne via-champagne/90 to-champagne/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-champagne via-transparent to-champagne/60" />
      </div>

      <div className="container grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="text-display-xl">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-2">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.18, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-7 max-w-lg text-lg text-slate/75 md:text-xl"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
          >
            Hair, skin, makeup, nails and spa rituals in a quiet Marylebone mews. Unhurried appointments with
            specialists who listen first.
          </motion.p>
        </div>

        {/* The vanity-mirror arch */}
        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <motion.div
            className="relative aspect-[3/4] overflow-hidden rounded-arch border-[10px] border-porcelain bg-linen shadow-soft"
            initial={reduce ? false : { clipPath: "inset(100% 0% 0% 0% round 999px 999px 24px 24px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 24px 24px)" }}
            transition={{ duration: 1.4, delay: 0.25, ease }}
          >
            <motion.div className="absolute inset-[-8%]" style={reduce ? undefined : { y: mirrorY }}>
              <SmartImage src={HERO_MIRROR} alt="Makeup artist finishing a client's look" fill priority sizes="(min-width:1024px) 40vw, 90vw" className="object-cover" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/25" />
          </motion.div>

          {/* Floating rating badge */}
          <motion.div
            className="glass absolute -left-4 bottom-10 rounded-2xl px-5 py-4 sm:-left-10"
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2, ease }}
          >
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl">{site.rating}</span>
              <div>
                <Stars rating={5} />
                <p className="mt-0.5 text-sm text-mist">{site.reviewCount}+ client reviews</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive action bar */}
      <motion.div
        className="container mt-12 lg:-mt-6"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.9, ease }}
      >
        <div className="glass relative z-10 grid gap-2 rounded-[1.75rem] p-2 md:grid-cols-[1fr_1fr_auto] lg:max-w-[880px]">
          <HeroSelect
            icon={<Sparkles className="h-5 w-5 text-bronze-deep" />}
            label="Choose treatment"
            value={serviceId}
            onChange={setServiceId}
          >
            <option value="">Any treatment</option>
            {categories.map((c) => (
              <optgroup key={c.id} label={c.label}>
                {services
                  .filter((s) => s.category === c.id)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </HeroSelect>
          <HeroSelect
            icon={<UserRound className="h-5 w-5 text-bronze-deep" />}
            label="Select specialist"
            value={specialistId}
            onChange={setSpecialistId}
          >
            <option value="">First available</option>
            {specialists.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {s.specialty}
              </option>
            ))}
          </HeroSelect>
          <Button size="lg" onClick={check} className="h-16 rounded-[1.4rem]">
            <CalendarCheck className="h-5 w-5" />
            Check availability
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function HeroSelect({
  icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex h-16 items-center gap-3 rounded-[1.4rem] bg-white/60 px-5 transition hover:bg-white/90">
      {icon}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-mist">{label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none truncate bg-transparent pr-6 font-medium outline-none"
        >
          {children}
        </select>
      </span>
      <ChevronDown className="pointer-events-none absolute right-5 h-4 w-4 text-mist" />
    </label>
  );
}
