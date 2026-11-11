# AURA Beauty Lounge — luxury salon reference site

A white-label Next.js template for beauty salons, aesthetic clinics and spas. Built as a demo to show prospective salon clients.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

Needs Node 18.18+ (Node 20 or newer recommended).

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS 3 with CSS-variable design tokens
- Framer Motion for animation
- Lucide icons
- shadcn-style primitives in `components/ui` (no CLI needed)

## Structure

```
app/
  layout.tsx          fonts, metadata, BookingProvider + BookingDrawer
  page.tsx            section order
  globals.css         colour tokens (rebrand here)
components/
  layout/             Navbar (glass + scroll progress), Footer, Logo
  sections/           Hero, TreatmentMenu, PackageBuilder, ConsultationQuiz,
                      Specialists, Lookbook, BeforeAfterSlider, Amenities,
                      Testimonials (+ Instagram grid), Contact
  booking/            BookingProvider (state), BookingDrawer, BookingSteps
  ui/                 Button, SmartImage, Reveal, SectionHeading, Stars
data/
  site.ts             brand name, contact, address, hours, nav
  services.ts         categories, treatments, add-ons
  specialists.ts      team, filters, working days
  gallery.ts          lookbook, before/after items, Instagram posts
  reviews.ts          testimonials
lib/
  availability.ts     mock calendar and slot engine
  utils.ts            cn(), price/duration formatting, package pricing rule
  types.ts            shared types
```

## Interactive features

- **Booking drawer** (5 steps: treatment, specialist, date and time, add-ons, details). Opens from the nav, hero bar, every "Select & Book", specialist cards, quiz results and the package builder, pre-filled with whatever was chosen. Validates details, shows a confirmation with a reference and an "Add to calendar" (.ics) download.
- **Treatment menu** with animated category tabs and expandable treatment rows.
- **Package builder** with live time and price estimate and a 10% package discount at 3+ treatments (the same rule is applied in the booking drawer).
- **Consultation quiz** (skin type, desired vibe, time available) that scores treatments and recommends three.
- **Specialists** with specialty filters and hover/tap reveal of bio, certifications and portfolio.
- **Before/after slider** that works with mouse, touch and keyboard (arrow keys, Home, End).
- **Lookbook** with tag filters and a keyboard-friendly lightbox.
- **Testimonial carousel** with autoplay, pause and progress bars.
- **Contact** with an illustrated map (no API key), live "Open now" status and today's hours highlighted.

## Customising for a client

1. **Brand and contact:** edit `data/site.ts`.
2. **Colours:** edit the RGB values at the top of `app/globals.css`. Tailwind classes such as `bg-bronze` and `text-slate` read from these.
3. **Fonts:** change the Google Fonts link in `app/layout.tsx` and the `--font-display` / `--font-sans` variables.
4. **Logo:** replace `components/layout/Logo.tsx` and `app/icon.svg`.
5. **Menu, team, gallery:** edit the files in `data/`.
6. **Real bookings:** replace `lib/availability.ts` and `confirm()` in `BookingProvider.tsx` with calls to the salon's booking system (Fresha, Timely, Square Appointments, etc.).

## Before going live

- `data/reviews.ts` contains **fictional demo reviews**. Replace them with the salon's real, verified reviews.
- The before/after slider uses one photo with a CSS filter for the "before" state. Swap in real before/after pairs (with client consent).
- Photography is from Unsplash. If any image fails to load, `SmartImage` shows a soft gradient instead.
- Instagram handles and the address are placeholders.
