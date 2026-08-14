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
        "inline-flex items-center justify-center font-mono font-medium",
        "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded",
        "transition-all duration-150",
        "hover:bg-cyan-500/25 hover:border-cyan-500/50 hover:scale-105",
        "focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        inline ? "text-[10px] px-1 py-0 mx-0.5 align-super" : "text-xs px-1.5 py-0.5"
      )}
      aria-label={`View source ${index}`}
    >
      {index}
    </button>
  );
}
