import type { GalleryItem, GalleryTag, Transformation } from "@/lib/types";
import { unsplash } from "@/lib/utils";

export const galleryTags: ("All" | GalleryTag)[] = ["All", "Hair Color", "Bridal Makeup", "Glass Skin Facial", "Nail Art"];

export const gallery: GalleryItem[] = [
  { id: "g1", tag: "Hair Color", title: "Honey balayage", image: unsplash("1562322140-8baeececf3df", 900), specialistId: "isabella", tall: true },
  { id: "g2", tag: "Bridal Makeup", title: "Soft bridal glow", image: unsplash("1487412947147-5cebf100ffc2", 900), specialistId: "sofia" },
  { id: "g3", tag: "Glass Skin Facial", title: "Post-facial luminosity", image: unsplash("1570172619644-dfd03ed5d881", 900), specialistId: "amara" },
  { id: "g4", tag: "Nail Art", title: "Milky chrome", image: unsplash("1604654894610-df63bc536371", 900), specialistId: "yuki", tall: true },
  { id: "g5", tag: "Hair Color", title: "Glossy brunette", image: unsplash("1522337360788-8b13dee7a37e", 900), specialistId: "marcus" },
  { id: "g6", tag: "Bridal Makeup", title: "Evening reception look", image: unsplash("1516975080664-ed2fc6a32937", 900), specialistId: "sofia", tall: true },
  { id: "g7", tag: "Glass Skin Facial", title: "Hydro-infusion finish", image: unsplash("1616394584738-fc6e612e71b9", 900), specialistId: "amara" },
  { id: "g8", tag: "Nail Art", title: "Hand-painted florals", image: unsplash("1607779097040-26e80aa78e66", 900), specialistId: "yuki" },
  { id: "g9", tag: "Hair Color", title: "Lived-in blonde", image: unsplash("1560869713-7d0a29430803", 900), specialistId: "isabella" },
];

/**
 * Before/after demo: one image per transformation, with a CSS filter
 * simulating the "before" state. Replace with real client photo pairs
 * (with consent) when customising for a salon.
 */
export const transformations: Transformation[] = [
  {
    id: "t1",
    label: "Glass Skin Facial",
    treatment: "6-week course with Amara",
    image: unsplash("1531746020798-e6953c6e8e04", 1400),
    beforeFilter: "saturate(0.55) brightness(0.88) contrast(0.92) sepia(0.12)",
  },
  {
    id: "t2",
    label: "Colour Makeover",
    treatment: "Balayage + gloss with Isabella",
    image: unsplash("1529626455594-4ff0802cfb7e", 1400),
    beforeFilter: "grayscale(0.7) brightness(0.85) contrast(0.95)",
  },
  {
    id: "t3",
    label: "Bridal Makeup",
    treatment: "Wedding morning with Sofia",
    image: unsplash("1517841905240-472988babdf9", 1400),
    beforeFilter: "saturate(0.4) brightness(0.9) contrast(0.88)",
  },
];

export const instagramPosts = [
  { id: "i1", image: unsplash("1604654894610-df63bc536371", 600), likes: 1284, caption: "Milky chrome for the holidays" },
  { id: "i2", image: unsplash("1562322140-8baeececf3df", 600), likes: 2310, caption: "Honey balayage by Isabella" },
  { id: "i3", image: unsplash("1515377905703-c4788e51af15", 600), likes: 876, caption: "Sunday in the candle suite" },
  { id: "i4", image: unsplash("1596462502278-27bfdc403348", 600), likes: 1542, caption: "Our bridal kit, restocked" },
  { id: "i5", image: unsplash("1570172619644-dfd03ed5d881", 600), likes: 1967, caption: "Glass skin, no filter" },
  { id: "i6", image: unsplash("1560066984-138dadb4c035", 600), likes: 1120, caption: "Morning light in the studio" },
];
