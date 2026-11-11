"use client";

import { motion } from "framer-motion";
import { MoveHorizontal } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Transformation } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Drag-to-compare slider. Works with mouse, touch (pointer events)
 * and keyboard (arrow keys / Home / End on the handle).
 */
export function BeforeAfterSlider({ item, className }: { item: Transformation; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((x: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100)));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative aspect-[4/5] select-none overflow-hidden rounded-arch border-[8px] border-porcelain bg-linen shadow-soft sm:aspect-[5/6]",
        dragging ? "cursor-grabbing" : "cursor-ew-resize",
        className,
      )}
      style={{ touchAction: "pan-y" }}
      onPointerDown={(e) => {
        setDragging(true);
        e.currentTarget.setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      {/* After (full) */}
      <SmartImage src={item.image} alt={`${item.label} — after`} fill sizes="(min-width:1024px) 50vw, 100vw" className="pointer-events-none object-cover" draggable={false} />

      {/* Before (clipped) */}
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <SmartImage
          src={item.image}
          alt={`${item.label} — before`}
          fill
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover"
          style={{ filter: item.beforeFilter }}
          draggable={false}
        />
      </div>

      <span className="glass pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm" style={{ opacity: pos > 12 ? 1 : 0 }}>
        Before
      </span>
      <span className="glass pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm" style={{ opacity: pos < 88 ? 1 : 0 }}>
        After
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 w-px bg-white/90" style={{ left: `${pos}%` }} />
      <motion.div
        role="slider"
        tabIndex={0}
        aria-label={`Compare before and after: ${item.label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-valuetext={`${Math.round(pos)}% before`}
        onKeyDown={onKey}
        animate={{ scale: dragging ? 1.12 : 1 }}
        className="absolute top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate shadow-glow"
        style={{ left: `${pos}%` }}
      >
        <MoveHorizontal className="h-5 w-5" />
      </motion.div>
    </div>
  );
}
