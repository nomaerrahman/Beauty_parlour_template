/**
 * White-label brand configuration.
 * Swap these values (plus the colour tokens in app/globals.css)
 * to re-skin the template for a new salon client.
 */
export const site = {
  name: "AURA",
  fullName: "AURA Beauty Lounge",
  tagline: "Elegance Redefined. Radiance Unlocked.",
  description:
    "A London beauty lounge for hair, skin, makeup, nails and spa rituals — booked in under a minute.",
  locale: "en-GB",
  currency: "GBP",
  rating: 4.9,
  reviewCount: 650,
  instagram: "aurabeautylounge",
  phone: "+44 20 7946 0321",
  whatsapp: "+447700900321",
  email: "hello@aura-lounge.example",
  address: {
    line1: "24 Rosewood Mews",
    line2: "Marylebone, London W1U 4QT",
    mapQuery: "Marylebone, London W1U",
  },
  parking:
    "Complimentary valet from 10:00 at the mews entrance. Nearest Tube: Bond Street (4 min walk).",
  hours: [
    { day: "Monday", open: null, close: null },
    { day: "Tuesday", open: "10:00", close: "19:00" },
    { day: "Wednesday", open: "10:00", close: "19:00" },
    { day: "Thursday", open: "10:00", close: "21:00" },
    { day: "Friday", open: "09:00", close: "21:00" },
    { day: "Saturday", open: "09:00", close: "18:00" },
    { day: "Sunday", open: "11:00", close: "17:00" },
  ] as { day: string; open: string | null; close: string | null }[],
  nav: [
    { label: "Treatments & Menu", href: "#treatments" },
    { label: "Specialists", href: "#specialists" },
    { label: "Lookbook", href: "#lookbook" },
    { label: "The Spa Experience", href: "#experience" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ],
};

export type Site = typeof site;
