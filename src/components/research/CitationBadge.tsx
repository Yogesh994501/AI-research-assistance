"use client";

import { useState } from "react";
import type { Paper } from "@/types";
import { cn } from "@/lib/utils";
import { ExternalLink, ArrowDown } from "lucide-react";

interface CitationBadgeProps {
  index: number;
  paper?: Paper | null;
  calloutId?: string;
  onClick?: (index: number, calloutId?: string) => void;
  inline?: boolean;
}

export default function CitationBadge({
  index,
  paper,
  calloutId,
  onClick,
  inline = false,
}: CitationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(index, calloutId);
  };

  return (
    <span className="relative inline-block align-baseline group/cite">
      <button
        id={calloutId}
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          "citation-pill inline-flex items-center justify-center font-mono font-semibold cursor-pointer",
          "transition-all duration-150 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-cyan-400/50",
          inline ? "text-[10px] px-1.5 py-0 mx-0.5" : "text-xs px-2 py-0.5"
        )}
        aria-label={`Jump to source [${index}] at bottom of research paper`}
        title={paper ? `[${index}] ${paper.title}` : `Source [${index}]`}
      >
        [{index}]
      </button>

      {/* ─── Hover Preview Tooltip Card ─── */}
      {paper && showTooltip && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 sm:w-72 pointer-events-none sm:pointer-events-auto",
            "rounded-xl border border-cyan-400/30 bg-[#0B151A]/95 p-3 shadow-2xl backdrop-blur-2xl animate-fade-in text-left",
            "text-xs leading-normal select-none"
          )}
        >
          <div className="flex items-center justify-between gap-1 border-b border-white/[0.08] pb-1.5 mb-1.5">
            <span className="font-mono text-[10px] text-cyan-400 font-bold">
              SOURCE [{index}]
            </span>
            <span className="text-[9px] uppercase font-mono text-cyan-300 rounded bg-cyan-400/10 px-1 py-0.2 border border-cyan-400/20">
              {paper.source === "arxiv" ? "arXiv" : paper.source === "openalex" ? "OpenAlex" : "S2"}
            </span>
          </div>

          <p className="font-semibold text-white text-[11px] line-clamp-2 leading-snug">
            {paper.title}
          </p>

          <p className="text-[10px] text-[#94A3B8] mt-1 truncate">
            {paper.authors.length > 0 ? paper.authors.slice(0, 2).join(", ") : "Unknown Author"}
            {paper.authors.length > 2 && " et al."} {paper.year ? `(${paper.year})` : ""}
          </p>

          <div className="mt-2 pt-1.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-cyan-300">
            <span className="flex items-center gap-1 font-medium">
              <ArrowDown className="h-3 w-3 text-cyan-400" />
              Click to view below
            </span>
            {paper.url && (
              <span className="text-[#94A3B8] flex items-center gap-0.5">
                <ExternalLink className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
