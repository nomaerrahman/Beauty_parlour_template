import { cn } from "@/lib/utils";

/** Vector logo placeholder: an arch (the vanity-mirror motif) over the wordmark. */
export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg viewBox="0 0 32 40" className="h-9 w-7" aria-hidden>
        <path
          d="M2 39V16C2 8.3 8.3 2 16 2s14 6.3 14 14v23"
          fill="none"
          stroke="rgb(var(--bronze))"
          strokeWidth="1.6"
        />
        <path
          d="M8 39V18c0-4.4 3.6-8 8-8s8 3.6 8 8v21"
          fill="none"
          stroke="rgb(var(--gold))"
          strokeWidth="1.2"
        />
        <circle cx="16" cy="22" r="2.2" fill="rgb(var(--bronze))" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-2xl tracking-[0.18em]", light ? "text-champagne" : "text-slate")}>
          AURA
        </span>
        <span className={cn("mt-1 text-[0.68rem] tracking-[0.32em]", light ? "text-champagne/70" : "text-mist")}>
          beauty lounge
        </span>
      </span>
    </span>
  );
}
