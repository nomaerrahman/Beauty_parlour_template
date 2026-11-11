import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { site } from "@/data/site";

/** shadcn-style className merger */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPriceRange(min: number, max: number) {
  return min === max ? formatPrice(min) : `${formatPrice(min)}–${formatPrice(max)}`;
}

export function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}

/** Package pricing rule shared by the builder and the booking drawer */
export const BUNDLE_THRESHOLD = 3;
export const BUNDLE_DISCOUNT = 0.1;
export const bundleFactor = (treatmentCount: number) =>
  treatmentCount >= BUNDLE_THRESHOLD ? 1 - BUNDLE_DISCOUNT : 1;

/** Unsplash helper — keeps image URLs consistent and sized */
export function unsplash(id: string, w = 1200, q = 75) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}
