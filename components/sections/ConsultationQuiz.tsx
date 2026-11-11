"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Droplets,
  Feather,
  Flame,
  Hourglass,
  Leaf,
  Moon,
  RotateCcw,
  Sparkles,
  Sun,
  Timer,
  Waves,
  Wind,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/services";
import type { QuizTag } from "@/lib/types";
import { cn, formatDuration, formatPriceRange } from "@/lib/utils";

const QUESTIONS: {
  title: string;
  options: { tag: QuizTag; label: string; hint: string; icon: React.ElementType }[];
}[] = [
  {
    title: "How does your skin usually feel?",
    options: [
      { tag: "dry", label: "Dry or tight", hint: "Flaky patches, drinks up moisturiser", icon: Droplets },
      { tag: "oily", label: "Oily", hint: "Shine by midday, visible pores", icon: Sun },
      { tag: "combination", label: "Combination", hint: "Oily T-zone, drier cheeks", icon: Waves },
      { tag: "sensitive", label: "Sensitive", hint: "Reacts to new products, flushes easily", icon: Feather },
    ],
  },
  {
    title: "What are you in the mood for?",
    options: [
      { tag: "natural", label: "Natural polish", hint: "You, on a very good day", icon: Leaf },
      { tag: "glam", label: "Full glam", hint: "Camera-ready, made for an occasion", icon: Sparkles },
      { tag: "relax", label: "Total switch-off", hint: "Quiet, warm, unhurried", icon: Moon },
      { tag: "refresh", label: "A fresh start", hint: "Brighter skin, a new look", icon: Wind },
    ],
  },
  {
    title: "How much time do you have?",
    options: [
      { tag: "express", label: "Under an hour", hint: "A lunch-break visit", icon: Timer },
      { tag: "standard", label: "One to two hours", hint: "Time for a proper treatment", icon: Clock },
      { tag: "indulgent", label: "Half a day or more", hint: "Make an occasion of it", icon: Hourglass },
    ],
  },
];

function recommend(answers: QuizTag[]) {
  const [skin, vibe, time] = answers;
  const timeFits = (mins: number) =>
    time === "express" ? mins <= 60 : time === "standard" ? mins <= 150 : true;

  return services
    .map((s) => {
      let score = 0;
      if (s.tags.includes(vibe)) score += 3;
      if (s.tags.includes(time)) score += 2;
      if (s.category === "skin" && s.tags.includes(skin)) score += 2.5;
      if (s.tags.includes(skin)) score += 1;
      if (!timeFits(s.duration)) score -= 4;
      if (s.popular) score += 0.25;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((r) => r.s);
}

export function ConsultationQuiz() {
  const { openBooking } = useBooking();
  const [answers, setAnswers] = useState<QuizTag[]>([]);
  const step = answers.length;
  const done = step === QUESTIONS.length;
  const results = useMemo(() => (done ? recommend(answers) : []), [done, answers]);

  return (
    <section id="quiz" className="py-24 md:py-32">
      <div className="container">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-rose/50 px-6 py-12 md:px-14 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/40 blur-3xl"
          />
          <div className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-display-md">Not sure what to book?</h2>
              <p className="mt-4 max-w-sm text-slate/75">
                Answer three quick questions and we&rsquo;ll suggest treatments to start with. Your specialist will
                fine-tune them at your consultation.
              </p>
              {!done && (
                <div className="mt-8 flex gap-2" aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>
                  {QUESTIONS.map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        i < step ? "w-10 bg-bronze" : i === step ? "w-10 bg-slate" : "w-6 bg-slate/15",
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="min-h-[360px]">
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <h3 className="text-2xl md:text-3xl">
                        <span className="text-mist">{step + 1}/{QUESTIONS.length} </span>
                        {QUESTIONS[step].title}
                      </h3>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {QUESTIONS[step].options.map((o) => (
                        <motion.button
                          key={o.tag}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setAnswers((a) => [...a, o.tag])}
                          className="group flex items-start gap-4 rounded-2xl border border-white/70 bg-white/60 p-5 text-left backdrop-blur transition hover:border-bronze hover:bg-white"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-champagne text-bronze-deep transition group-hover:bg-gold/50">
                            <o.icon className="h-5 w-5" />
                          </span>
                          <span>
                            <span className="block font-medium">{o.label}</span>
                            <span className="block text-sm text-mist">{o.hint}</span>
                          </span>
                        </motion.button>
                      ))}
                    </div>
                    {step > 0 && (
                      <button
                        onClick={() => setAnswers((a) => a.slice(0, -1))}
                        className="mt-5 inline-flex items-center gap-2 text-sm text-mist hover:text-slate"
                      >
                        <ArrowLeft className="h-4 w-4" /> Previous question
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <h3 className="text-2xl md:text-3xl">Your suggested treatments</h3>
                    <ul className="mt-6 space-y-3">
                      {results.map((s, i) => (
                        <motion.li
                          key={s.id}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.12 * i }}
                          className={cn(
                            "flex items-center gap-4 rounded-2xl p-3 pr-4",
                            i === 0 ? "bg-white shadow-soft" : "bg-white/55",
                          )}
                        >
                          <span className="relative h-20 w-16 shrink-0 overflow-hidden rounded-arch-sm bg-linen">
                            <SmartImage src={s.image} alt="" fill sizes="64px" className="object-cover" />
                          </span>
                          <span className="flex-1">
                            {i === 0 && (
                              <span className="mb-1 inline-flex items-center gap-1 text-xs text-bronze-deep">
                                <Flame className="h-3.5 w-3.5" /> Best match
                              </span>
                            )}
                            <span className="block font-display text-xl">{s.title}</span>
                            <span className="block text-sm text-mist">
                              {formatDuration(s.duration)} · {formatPriceRange(s.priceFrom, s.priceTo)}
                            </span>
                          </span>
                          <Button
                            size="sm"
                            variant={i === 0 ? "primary" : "outline"}
                            onClick={() => openBooking({ serviceIds: [s.id] })}
                          >
                            Book
                          </Button>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <Button onClick={() => openBooking({ serviceIds: results.map((r) => r.id) })}>
                        Book all three as a package
                      </Button>
                      <button
                        onClick={() => setAnswers([])}
                        className="inline-flex items-center gap-2 text-sm text-mist hover:text-slate"
                      >
                        <RotateCcw className="h-4 w-4" /> Start again
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
