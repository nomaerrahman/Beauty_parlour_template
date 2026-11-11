import type { Metadata, Viewport } from "next";
import { BookingDrawer } from "@/components/booking/BookingDrawer";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: `${site.fullName} | Hair, Skin, Makeup & Spa in Marylebone`,
  description: site.description,
  openGraph: { title: site.fullName, description: site.description, type: "website" },
};

export const viewport: Viewport = { themeColor: "#FDFBF7" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        {/* Loaded at runtime so builds work offline; swap for next/font if preferred */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500&family=Jost:wght@300;400;500&display=swap"
        />
      </head>
      <body>
        <BookingProvider>
          {children}
          <BookingDrawer />
        </BookingProvider>
      </body>
    </html>
  );
}
