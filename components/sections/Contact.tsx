"use client";

import { motion } from "framer-motion";
import { Car, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function useOpenStatus() {
  const [state, setState] = useState<{ today: string; open: boolean } | null>(null);
  useEffect(() => {
    const now = new Date();
    const today = DAY_NAMES[now.getDay()];
    const h = site.hours.find((x) => x.day === today)!;
    const mins = now.getHours() * 60 + now.getMinutes();
    const toM = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
    setState({ today, open: !!h.open && mins >= toM(h.open) && mins < toM(h.close!) });
  }, []);
  return state;
}

/** Stylised illustrated map — no API key needed. Links out to Google Maps. */
function MapPreview() {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapQuery)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block h-full min-h-[360px] overflow-hidden rounded-petal bg-[#F1E9DE]"
      aria-label="Open location in Google Maps"
    >
      <svg viewBox="0 0 600 460" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="600" height="460" fill="#F3EBE1" />
        {/* park */}
        <path d="M380 20h200v150H420c-30 0-40-20-40-50z" fill="#E4E7D6" />
        <circle cx="470" cy="85" r="18" fill="#D6DCC4" />
        <circle cx="520" cy="120" r="12" fill="#D6DCC4" />
        {/* blocks */}
        {[
          [30, 30, 140, 90], [200, 30, 150, 90], [30, 160, 90, 120], [150, 160, 200, 50],
          [150, 240, 90, 40], [270, 240, 80, 120], [30, 320, 210, 110], [380, 210, 190, 90],
          [380, 330, 190, 100], [270, 390, 80, 50],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="#FBF7F1" stroke="#EADFCF" />
        ))}
        {/* streets */}
        <path d="M0 140h600M0 300h360M360 0v460M250 140v320M130 140v170" stroke="#FFFFFF" strokeWidth="14" />
        <path d="M0 190 C 200 210, 420 160, 600 195" stroke="#E6C594" strokeWidth="10" fill="none" opacity="0.7" />
        <text x="20" y="133" fontSize="11" fill="#9A8F84" fontFamily="Jost, sans-serif">Wigmore Street</text>
        <text x="372" y="450" fontSize="11" fill="#9A8F84" fontFamily="Jost, sans-serif" transform="rotate(-90 372 450)">
          Marylebone Lane
        </text>
        <text x="420" y="60" fontSize="11" fill="#8A9672" fontFamily="Jost, sans-serif">Paddington St Gardens</text>
      </svg>

      {/* Pin */}
      <div className="absolute left-[52%] top-[52%] -translate-x-1/2 -translate-y-full">
        <motion.span
          className="absolute left-1/2 top-full h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bronze/30"
          animate={{ scale: [0.6, 1.4], opacity: [0.8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <span className="relative flex h-12 w-12 items-center justify-center rounded-full rounded-br-none bg-slate shadow-glow [transform:rotate(45deg)]">
          <MapPin className="h-5 w-5 -rotate-45 text-gold" />
        </span>
      </div>

      <div className="glass absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-2xl p-4 sm:right-auto">
        <div>
          <p className="font-medium">{site.fullName}</p>
          <p className="text-sm text-mist">
            {site.address.line1}, {site.address.line2}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate text-champagne transition group-hover:bg-bronze-deep">
          <Navigation className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

export function Contact() {
  const { openBooking } = useBooking();
  const status = useOpenStatus();

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="container">
        <SectionHeading title="Visit the lounge" intro="Tucked behind Marylebone High Street, four minutes from Bond Street.">
          {status && (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm",
                status.open ? "bg-emerald-50 text-emerald-800" : "bg-linen text-slate",
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-slate/40")} />
              {status.open ? "Open now" : "Closed now"}
            </span>
          )}
        </SectionHeading>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <MapPreview />

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="mb-4 text-2xl">Opening hours</h3>
              <dl className="divide-y divide-slate/10 border-y border-slate/10">
                {site.hours.map((h) => (
                  <div
                    key={h.day}
                    className={cn(
                      "flex justify-between px-2 py-2.5",
                      status?.today === h.day && "rounded-lg bg-gold/25 font-medium",
                    )}
                  >
                    <dt>{h.day}</dt>
                    <dd className={cn(!h.open && "text-mist")}>{h.open ? `${h.open} – ${h.close}` : "Closed"}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <p className="flex gap-3 rounded-2xl bg-linen/70 p-4 text-sm">
              <Car className="mt-0.5 h-5 w-5 shrink-0 text-bronze-deep" />
              {site.parking}
            </p>

            <div className="grid grid-cols-3 gap-3">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-2 rounded-2xl border border-slate/10 p-4 text-sm transition hover:border-bronze hover:bg-bronze/5">
                <Phone className="h-5 w-5 text-bronze-deep" /> Call
              </a>
              <a href={`https://wa.me/${site.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 rounded-2xl border border-slate/10 p-4 text-sm transition hover:border-bronze hover:bg-bronze/5">
                <MessageCircle className="h-5 w-5 text-bronze-deep" /> WhatsApp
              </a>
              <a href={`mailto:${site.email}`} className="flex flex-col items-center gap-2 rounded-2xl border border-slate/10 p-4 text-sm transition hover:border-bronze hover:bg-bronze/5">
                <Mail className="h-5 w-5 text-bronze-deep" /> Email
              </a>
            </div>

            <Button size="lg" onClick={() => openBooking()}>
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
