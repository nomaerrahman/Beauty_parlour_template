"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { Button } from "@/components/ui/Button";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function Navbar() {
  const { openBooking } = useBooking();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Highlight the section in view
  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav
        className={cn(
          "relative mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 overflow-hidden rounded-full px-4 transition-all duration-500 sm:px-6",
          scrolled ? "glass" : "border border-transparent bg-transparent",
        )}
        aria-label="Main"
      >
        <a href="#top" aria-label={`${site.fullName} home`}>
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "relative rounded-full px-3 py-2 text-[0.92rem] transition-colors hover:text-bronze-deep",
                  active === item.href.slice(1) ? "text-bronze-deep" : "text-slate/80",
                )}
              >
                {item.label}
                {active === item.href.slice(1) && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-bronze"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button onClick={() => openBooking()} className="hidden sm:inline-flex">
            Book Appointment
          </Button>
          <button
            className="rounded-full p-2 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Scroll progress indicator */}
        <motion.span
          aria-hidden
          style={{ scaleX: progress }}
          className="absolute inset-x-6 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-gold via-bronze to-bronze-deep"
        />
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-champagne px-6 pb-8 pt-6"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setMenuOpen(false)} className="rounded-full p-2" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <ul className="mt-12 space-y-2">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 font-display text-4xl"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-auto w-full"
              onClick={() => {
                setMenuOpen(false);
                openBooking();
              }}
            >
              Book Appointment
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
