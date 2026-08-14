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
    <div className="glass-elevated rounded-xl p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold text-zinc-100 leading-snug">{paper.title}</h3>
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Authors */}
      {paper.authors.length > 0 && (
        <p className="text-xs text-zinc-400 mb-3">
          {paper.authors.join(", ")}
        </p>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {paper.year && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <BookOpen className="h-3 w-3" />
            <span>{paper.year}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <FileText className="h-3 w-3" />
          <span>{formatCount(paper.citationCount)} citations</span>
        </div>
        {paper.doi && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 col-span-2">
            <Link2 className="h-3 w-3 shrink-0" />
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
        <div className="mb-3">
          <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mb-1">Abstract</p>
          <p className="text-xs text-zinc-400 leading-relaxed max-h-40 overflow-y-auto">
            {paper.abstract}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
              "bg-zinc-800/60 text-zinc-300 border border-zinc-700/60",
              "hover:bg-zinc-700/60 hover:text-zinc-100 transition"
            )}
          >
            <ExternalLink className="h-3 w-3" />
            View Paper
          </a>
        )}
        {paper.openAccessPdf && (
          <a
            href={paper.openAccessPdf}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
              "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
              "hover:bg-cyan-500/25 transition"
            )}
          >
            <Download className="h-3 w-3" />
            Open PDF
          </a>
        )}
      </div>
    </div>
  );
}
