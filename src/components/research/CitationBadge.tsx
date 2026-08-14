"use client";

import { cn } from "@/lib/utils";

interface CitationBadgeProps {
  index: number;
  onClick?: (index: number) => void;
  inline?: boolean;
}

export default function CitationBadge({ index, onClick, inline = false }: CitationBadgeProps) {
  return (
    <button
      onClick={() => onClick?.(index)}
      className={cn(
        "citation-pill inline-flex items-center justify-center font-mono font-semibold",
        "focus:outline-none focus:ring-2 focus:ring-cyan-400/50",
        inline ? "text-[10px] px-1.5 py-0 mx-0.5 align-baseline" : "text-xs px-2 py-0.5"
      )}
      aria-label={`View source [${index}]`}
    >
      [{index}]
    </button>
  );
}
