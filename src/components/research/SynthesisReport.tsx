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
      <h1 className="mt-6 mb-3 text-lg font-bold text-zinc-100">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-5 mb-2.5 text-base font-semibold text-zinc-100">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-4 mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-300">
        <span className="h-px w-3 bg-cyan-500/50" />
        {children}
      </h3>
    ),
    p: ({ children }: { children?: React.ReactNode }) => {
      if (typeof children === "string") {
        return (
          <p className="mb-3 text-xs leading-relaxed text-zinc-300">
            <TextWithCitations content={children} onCitationClick={handleCitationClick} />
          </p>
        );
      }
      return <p className="mb-3 text-xs leading-relaxed text-zinc-300">{children}</p>;
    },
    li: ({ children }: { children?: React.ReactNode }) => {
      if (typeof children === "string") {
        return (
          <li className="mb-1.5 text-xs leading-relaxed text-zinc-300">
            <TextWithCitations content={children} onCitationClick={handleCitationClick} />
          </li>
        );
      }
      return <li className="mb-1.5 text-xs leading-relaxed text-zinc-300">{children}</li>;
    },
    ul: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-3 ml-4 list-disc space-y-1 text-zinc-300">{children}</ul>
    ),
    ol: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-3 ml-4 list-decimal space-y-1 text-zinc-300">{children}</ol>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-3 rounded-r-lg border-l-2 border-cyan-500/60 bg-cyan-950/20 px-3 py-2 text-xs italic text-zinc-300">
        {children}
      </blockquote>
    ),
    table: ({ children }: { children?: React.ReactNode }) => (
      <div className="my-4 overflow-x-auto rounded-lg border border-zinc-800/80 bg-zinc-950/60">
        <table className="w-full text-left text-xs border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: React.ReactNode }) => (
      <thead className="border-b border-zinc-700/60 bg-zinc-900/60 font-semibold text-zinc-300">{children}</thead>
    ),
    tbody: ({ children }: { children?: React.ReactNode }) => (
      <tbody className="divide-y divide-zinc-800/40 text-zinc-300">{children}</tbody>
    ),
    th: ({ children }: { children?: React.ReactNode }) => (
      <th className="px-3 py-2 font-medium text-zinc-300">{children}</th>
    ),
    td: ({ children }: { children?: React.ReactNode }) => (
      <td className="px-3 py-2 text-zinc-300">{children}</td>
    ),
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-zinc-100">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-zinc-400">{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-[11px] text-cyan-300">{children}</code>
    ),
  }), [handleCitationClick]);

  /* Loading State */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-zinc-300">Synthesizing grounded research…</p>
        <p className="text-xs text-zinc-500">{activeQuery}</p>
      </div>
    );
  }

  /* Empty State */
  if (!synthesisReport) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
        <div className="relative">
          <Sparkles className="h-12 w-12 text-zinc-700" />
          <div className="absolute inset-0 blur-xl bg-cyan-500/10 rounded-full" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-300">Ask Nexus3D a research question</h2>
          <p className="text-xs text-zinc-500 mt-2 max-w-sm">
            Multi-engine scholarly search across OpenAlex, arXiv & Semantic Scholar.
            All findings are grounded with verified inline citations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-4 py-4 space-y-1 animate-fade-in")}>
      {/* Research Question Header Badge */}
      {activeQuery && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/50">
          <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-xs text-zinc-400">Research Question:</span>
          <span className="text-xs text-zinc-200 font-medium">{activeQuery}</span>
        </div>
      )}

      {/* Markdown Body */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {synthesisReport}
      </ReactMarkdown>
    </div>
  );
}
