"use client";

import { FileText, ExternalLink, BookOpen, Star } from "lucide-react";
import type { Paper } from "@/types";
import { cn, truncate, formatCount } from "@/lib/utils";

interface PaperCardProps {
  paper: Paper;
  index: number;
  isSelected: boolean;
  onSelect: (paper: Paper) => void;
  compact?: boolean;
}

const SOURCE_STYLES: Record<Paper["source"], { badge: string; label: string }> = {
  openalex: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    label: "OpenAlex",
  },
  arxiv: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    label: "arXiv",
  },
  semantic_scholar: {
    badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    label: "S2",
  },
};

export default function PaperCard({ paper, index, isSelected, onSelect, compact = false }: PaperCardProps) {
  const sourceInfo = SOURCE_STYLES[paper.source] || SOURCE_STYLES.openalex;

  return (
    <button
      onClick={() => onSelect(paper)}
      className={cn(
        "paper-card w-full text-left p-3.5 focus:outline-none focus:ring-2 focus:ring-cyan-400/40",
        isSelected && "bg-white/[0.12] border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
      )}
      aria-label={`Select paper: ${paper.title}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-semibold text-cyan-400">[{index + 1}]</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              "inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium border",
              sourceInfo.badge
            )}
          >
            {sourceInfo.label}
          </span>
          {paper.openAccessPdf && (
            <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              OA
            </span>
          )}
        </div>
      </div>

      {/* Paper Title */}
      <h3 className={cn("mt-1.5 font-semibold leading-snug text-[#F8FAFC]", compact ? "text-xs" : "text-xs sm:text-sm")}>
        {compact ? truncate(paper.title, 80) : paper.title}
      </h3>

      {/* Authors */}
      {paper.authors.length > 0 && !compact && (
        <p className="mt-1 text-[11px] text-[#94A3B8] line-clamp-1">
          {paper.authors.slice(0, 3).join(", ")}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
        </p>
      )}

      {/* Metadata Row */}
      <div className="mt-2.5 flex items-center flex-wrap gap-2.5 text-[11px] text-[#94A3B8]">
        {paper.year && (
          <span className="flex items-center gap-1 shrink-0">
            <BookOpen className="h-3 w-3 text-[#64748B] shrink-0" />
            <span>{paper.year}</span>
          </span>
        )}
        <span className="flex items-center gap-1 shrink-0">
          <FileText className="h-3 w-3 text-[#64748B] shrink-0" />
          <span>{formatCount(paper.citationCount)} cites</span>
        </span>
        {paper.relevanceScore > 0 && (
          <span className="flex items-center gap-1 text-cyan-300 font-medium shrink-0">
            <Star className="h-3 w-3 text-cyan-400 shrink-0 fill-cyan-400/20" />
            <span>{paper.relevanceScore}%</span>
          </span>
        )}
        {paper.url && (
          <ExternalLink className="h-3 w-3 text-[#64748B] ml-auto shrink-0" />
        )}
      </div>
    </button>
  );
}
