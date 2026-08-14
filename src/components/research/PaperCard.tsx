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

const SOURCE_COLORS: Record<Paper["source"], string> = {
  openalex: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  arxiv: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  semantic_scholar: "bg-violet-500/15 text-violet-400 border-violet-500/30",
};

const SOURCE_LABELS: Record<Paper["source"], string> = {
  openalex: "OpenAlex",
  arxiv: "arXiv",
  semantic_scholar: "S2",
};

export default function PaperCard({ paper, index, isSelected, onSelect, compact = false }: PaperCardProps) {
  return (
    <button
      onClick={() => onSelect(paper)}
      className={cn(
        "w-full text-left rounded-xl p-3 transition-all duration-200",
        "border focus:outline-none focus:ring-2 focus:ring-cyan-500/40",
        isSelected
          ? "bg-cyan-500/10 border-cyan-500/40 glow-accent"
          : "bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/50 hover:border-zinc-700/60 active:scale-[0.99]"
      )}
      aria-label={`Select paper: ${paper.title}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono font-medium text-cyan-400">[{index + 1}]</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={cn(
              "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border",
              SOURCE_COLORS[paper.source]
            )}
          >
            {SOURCE_LABELS[paper.source]}
          </span>
          {paper.openAccessPdf && (
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-green-500/15 text-green-400 border border-green-500/30">
              OA
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={cn("mt-1.5 font-medium leading-snug text-zinc-100", compact ? "text-xs" : "text-xs sm:text-sm")}>
        {compact ? truncate(paper.title, 80) : paper.title}
      </h3>

      {/* Authors */}
      {paper.authors.length > 0 && !compact && (
        <p className="mt-1 text-[11px] text-zinc-400 line-clamp-1">
          {paper.authors.slice(0, 3).join(", ")}
          {paper.authors.length > 3 && ` +${paper.authors.length - 3}`}
        </p>
      )}

      {/* Metadata row */}
      <div className="mt-2.5 flex items-center flex-wrap gap-2.5 text-[11px] text-zinc-400">
        {paper.year && (
          <span className="flex items-center gap-1 shrink-0">
            <BookOpen className="h-3 w-3 text-zinc-500 shrink-0" />
            <span>{paper.year}</span>
          </span>
        )}
        <span className="flex items-center gap-1 shrink-0">
          <FileText className="h-3 w-3 text-zinc-500 shrink-0" />
          <span>{formatCount(paper.citationCount)} citations</span>
        </span>
        {paper.relevanceScore > 0 && (
          <span className="flex items-center gap-1 text-cyan-400 font-medium shrink-0">
            <Star className="h-3 w-3 text-cyan-400 shrink-0" />
            <span>{paper.relevanceScore}%</span>
          </span>
        )}
        {paper.url && (
          <ExternalLink className="h-3 w-3 text-zinc-500 ml-auto shrink-0" />
        )}
      </div>
    </button>
  );
}
