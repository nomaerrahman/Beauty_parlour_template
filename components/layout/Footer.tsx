import { Instagram } from "lucide-react";
import { site } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t hairline bg-linen/50 py-14">
      <div className="container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm text-mist">{site.description}</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          {site.nav.map((n) => (
            <a key={n.href} href={n.href} className="text-slate/75 hover:text-bronze-deep">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="text-sm">
          <p>{site.address.line1}</p>
          <p className="text-mist">{site.address.line2}</p>
          <a href={`https://instagram.com/${site.instagram}`} className="mt-3 inline-flex items-center gap-2 text-bronze-deep hover:underline" target="_blank" rel="noreferrer">
            <Instagram className="h-4 w-4" /> @{site.instagram}
          </a>
        </div>
      </div>
      <div className="container mt-12 flex flex-col justify-between gap-2 text-xs text-mist sm:flex-row">
        <p>© {new Date().getFullYear()} {site.fullName}. Demo template — fictional brand.</p>
        <p>Photography via Unsplash.</p>
      </div>
    </footer>
  );
}
