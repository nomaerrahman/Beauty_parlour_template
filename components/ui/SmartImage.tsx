"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image wrapper that fades in on load and falls back to a soft
 * champagne gradient if a remote placeholder ever goes missing.
 */
export function SmartImage({ className, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(var(--gold)/0.55),transparent_55%),radial-gradient(circle_at_80%_90%,rgb(var(--rose)),transparent_60%)] bg-linen",
          className,
        )}
      />
    );
  }

  return (
    <Image
      alt={alt}
      {...props}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={cn("transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0", className)}
    />
  );
}
