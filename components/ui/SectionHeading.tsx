import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHeading({
  title,
  intro,
  align = "left",
  className,
  children,
}: {
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <h2 className="text-display-lg text-balance">{title}</h2>
        {intro && <p className="mt-5 max-w-xl text-lg text-mist">{intro}</p>}
      </div>
      {children}
    </Reveal>
  );
}
