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
    <div className="glass-panel-elevated p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFC] leading-snug">{paper.title}</h3>
        <button
          onClick={onClose}
          className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.10] text-[#94A3B8] hover:text-[#F8FAFC] transition active:scale-95"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4 shrink-0" />
        </button>
      </div>

      {/* Authors */}
      {paper.authors.length > 0 && (
        <p className="text-[11px] sm:text-xs text-[#CBD5E1] mb-3">
          {paper.authors.join(", ")}
        </p>
      )}

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3 bg-white/[0.04] p-3 rounded-xl border border-white/[0.10]">
        {paper.year && (
          <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1]">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>{paper.year}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1]">
          <FileText className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span>{formatCount(paper.citationCount)} citations</span>
        </div>
        {paper.doi && (
          <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1] col-span-2 min-w-0">
            <Link2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-cyan-300 hover:text-cyan-200 transition underline underline-offset-2"
            >
              {paper.doi}
            </a>
          </div>
        )}
      </div>

      {/* Abstract */}
      {paper.abstract && (
        <div className="mb-3.5">
          <p className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider mb-1">Abstract</p>
          <p className="text-xs text-[#CBD5E1] leading-relaxed max-h-48 overflow-y-auto pr-1">
            {paper.abstract}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.10]">
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "btn-secondary flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              "active:scale-95"
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
              "btn-primary flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium",
              "active:scale-95"
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
