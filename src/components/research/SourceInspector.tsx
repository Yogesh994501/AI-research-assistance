"use client";

import { X, ExternalLink, FileText, BookOpen, Link2, Download } from "lucide-react";
import type { Paper } from "@/types";
import { cn, formatCount } from "@/lib/utils";

interface SourceInspectorProps {
  paper: Paper;
  onClose: () => void;
}

export default function SourceInspector({ paper, onClose }: SourceInspectorProps) {
  return (
    <div className="glass-elevated rounded-xl p-3.5 sm:p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-100 leading-snug">{paper.title}</h3>
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4 shrink-0" />
        </button>
      </div>

      {/* Authors */}
      {paper.authors.length > 0 && (
        <p className="text-[11px] sm:text-xs text-zinc-400 mb-3">
          {paper.authors.join(", ")}
        </p>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/60">
        {paper.year && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>{paper.year}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <FileText className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>{formatCount(paper.citationCount)} citations</span>
        </div>
        {paper.doi && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 col-span-2 min-w-0">
            <Link2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-cyan-400 transition"
            >
              {paper.doi}
            </a>
          </div>
        )}
      </div>

      {/* Abstract */}
      {paper.abstract && (
        <div className="mb-3.5">
          <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Abstract</p>
          <p className="text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto pr-1">
            {paper.abstract}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-zinc-800/60">
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              "bg-zinc-800/80 text-zinc-200 border border-zinc-700/60",
              "hover:bg-zinc-700 hover:text-zinc-100 transition active:scale-95"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span>View Source</span>
          </a>
        )}
        {paper.openAccessPdf && (
          <a
            href={paper.openAccessPdf}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
              "hover:bg-cyan-500/30 transition active:scale-95"
            )}
          >
            <Download className="h-3.5 w-3.5 shrink-0" />
            <span>Open PDF</span>
          </a>
        )}
      </div>
    </div>
  );
}
