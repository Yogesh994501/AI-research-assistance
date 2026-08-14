"use client";

import { useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import { getCitedPaper } from "@/lib/citations";
import CitationBadge from "./CitationBadge";
import { cn } from "@/lib/utils";

interface TextWithCitationsProps {
  content: string;
  onCitationClick: (index: number) => void;
}

function TextWithCitations({ content, onCitationClick }: TextWithCitationsProps) {
  const parts = content.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/);
        if (match) {
          const idx = parseInt(match[1], 10);
          return (
            <CitationBadge
              key={i}
              index={idx}
              onClick={onCitationClick}
              inline
            />
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function SynthesisReport() {
  const { synthesisReport, papers, activeQuery, isLoading, setSelectedPaper } = useResearchStore();

  const handleCitationClick = useCallback(
    (index: number) => {
      const paper = getCitedPaper(index, papers);
      if (paper) setSelectedPaper(paper);
    },
    [papers, setSelectedPaper]
  );

  const customComponents = useMemo(() => ({
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="mt-6 mb-3 text-lg sm:text-xl font-bold tracking-tight text-white border-b border-white/[0.10] pb-2">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-5 mb-2.5 text-base sm:text-lg font-bold tracking-tight text-white">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-5 mb-2 flex items-center gap-2 text-sm sm:text-base font-bold text-cyan-300">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
        <span>{children}</span>
      </h3>
    ),
    p: ({ children }: { children?: React.ReactNode }) => {
      if (typeof children === "string") {
        return (
          <p className="mb-3.5 text-xs sm:text-[13px] leading-relaxed text-[#E2E8F0]">
            <TextWithCitations content={children} onCitationClick={handleCitationClick} />
          </p>
        );
      }
      return <p className="mb-3.5 text-xs sm:text-[13px] leading-relaxed text-[#E2E8F0]">{children}</p>;
    },
    li: ({ children }: { children?: React.ReactNode }) => {
      if (typeof children === "string") {
        return (
          <li className="mb-2 text-xs sm:text-[13px] leading-relaxed text-[#E2E8F0]">
            <TextWithCitations content={children} onCitationClick={handleCitationClick} />
          </li>
        );
      }
      return <li className="mb-2 text-xs sm:text-[13px] leading-relaxed text-[#E2E8F0]">{children}</li>;
    },
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-3.5 ml-4 list-disc space-y-1.5 text-[#E2E8F0]">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-3.5 ml-4 list-decimal space-y-1.5 text-[#E2E8F0]">{children}</ol>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-3.5 rounded-r-xl border-l-2 border-cyan-400 bg-white/[0.04] px-4 py-2.5 text-xs italic text-[#CBD5E1]">
        {children}
      </blockquote>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
      <div className="my-4 overflow-x-auto rounded-xl border border-white/[0.12] bg-white/[0.03]">
        <table className="w-full text-left text-xs border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <thead className="border-b border-white/[0.12] bg-white/[0.05] font-semibold text-white">{children}</thead>
    ),
    tbody: ({ children }: { children?: React.ReactNode }) => (
      <tbody className="divide-y divide-white/[0.06] text-[#E2E8F0]">{children}</tbody>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className="px-3.5 py-2.5 font-semibold text-white text-xs">{children}</th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className="px-3.5 py-2.5 text-[#E2E8F0] text-xs">{children}</td>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-[#CBD5E1]">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[11px] text-cyan-300 border border-white/[0.08]">{children}</code>
    ),
  }), [handleCitationClick]);

  /* Loading State */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-semibold text-white">Synthesizing grounded research report…</p>
        <p className="text-xs text-[#94A3B8] max-w-sm text-center">{activeQuery}</p>
      </div>
    );
  }

  /* Empty State */
  if (!synthesisReport) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-cyan-400/40" />
          <div className="absolute inset-0 blur-xl bg-cyan-400/10 rounded-full" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Ask Nexus3D a research question</h2>
          <p className="text-xs text-[#94A3B8] mt-2 max-w-md leading-relaxed">
            Multi-engine scholarly search across OpenAlex, arXiv & Semantic Scholar.
            All findings are synthesized with verified inline citations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-4 sm:px-6 py-5 space-y-1 animate-fade-in")}>
      {/* Research Question Header Badge */}
      {activeQuery && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.10]">
          <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="text-xs text-[#94A3B8]">Research Topic:</span>
          <span className="text-xs text-[#F8FAFC] font-semibold">{activeQuery}</span>
        </div>
      )}

      {/* Markdown Body */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {synthesisReport}
      </ReactMarkdown>
    </div>
  );
}
