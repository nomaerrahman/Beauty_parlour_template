import type { Review } from "@/lib/types";
import { unsplash } from "@/lib/utils";

/**
 * DEMO CONTENT — fictional clients for the template.
 * Replace with the salon's real, verified reviews before going live
 * (e.g. pulled from Google Business Profile or Fresha).
 */
export const reviews: Review[] = [
  {
    id: "r1",
    name: "Charlotte W.",
    avatar: unsplash("1438761681033-6461ffad8d80", 200),
    rating: 5,
    treatment: "Glass Skin Facial",
    quote: "My skin genuinely looked different walking out. Amara explained every step and never once pushed products on me.",
    date: "October 2026",
  },
  {
    id: "r2",
    name: "Priya S.",
    avatar: unsplash("1573496359142-b8d87734a5a2", 200),
    rating: 5,
    treatment: "Bridal Makeup & Trial",
    quote: "Sofia made me feel calm on the most hectic morning of my life. The makeup lasted through tears, dancing and a London drizzle.",
    date: "September 2026",
  },
  {
    id: "r3",
    name: "Hannah L.",
    avatar: unsplash("1508214751196-bcfd4ca60f91", 200),
    rating: 5,
    treatment: "Signature Balayage",
    quote: "Three salons couldn't get my colour right. Isabella did it in one appointment and the regrowth is still beautiful.",
    date: "October 2026",
  },
  {
    id: "r4",
    name: "Olivia R.",
    avatar: unsplash("1544005313-94ddf0286df2", 200),
    rating: 5,
    treatment: "Hot Stone Ritual",
    quote: "The quietest ninety minutes of my month. Champagne afterwards in the lounge was the perfect finish.",
    date: "August 2026",
  },
  {
    id: "r5",
    name: "Grace M.",
    avatar: unsplash("1531746020798-e6953c6e8e04", 200),
    rating: 4,
    treatment: "Editorial Nail Art",
    quote: "Yuki is an artist. Booking online took a minute, and they sent a reminder the day before.",
    date: "November 2026",
  },
];
