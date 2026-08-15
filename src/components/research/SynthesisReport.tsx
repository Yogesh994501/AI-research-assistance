"use client";

import { useMemo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  Sparkles,
  Loader2,
  Search,
  DownloadCloud,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Download,
  Bookmark,
  FileText,
  Link2,
} from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import { getCitedPaper } from "@/lib/citations";
import CitationBadge from "./CitationBadge";
import { cn, formatCount } from "@/lib/utils";

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
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleCitationClick = useCallback(
    (index: number) => {
      const paper = getCitedPaper(index, papers);
      if (paper) {
        // Smooth scroll to the reference card at the bottom of the studio
        const refElement = document.getElementById(`reference-${index}`);
        if (refElement) {
          refElement.scrollIntoView({ behavior: "smooth", block: "center" });
          setHighlightedIndex(index);
          setTimeout(() => setHighlightedIndex(null), 3000);
        } else {
          setSelectedPaper(paper);
        }
      }
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
        <div className="relative flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
          <div className="absolute inset-0 blur-xl bg-cyan-400/20 rounded-full" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-white tracking-wide">Synthesizing grounded research report…</p>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm font-mono">{activeQuery}</p>
        </div>
      </div>
    );
  }

  /* Sophisticated Hero AI Research Empty State */
  if (!synthesisReport) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 sm:px-6 text-center space-y-6 animate-fade-in max-w-2xl mx-auto">
        {/* Glowing Hero Icon */}
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <Sparkles className="h-8 w-8 stroke-[1.75]" />
          </div>
          <div className="absolute -inset-2 rounded-2xl bg-cyan-400/20 blur-xl -z-10 animate-pulse" />
        </div>

        {/* Hero Title & Subtitle */}
        <div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-white uppercase">
            Ask Nexus3D a Research Question
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1.5 max-w-md mx-auto leading-relaxed">
            Multi-engine scholarly search across OpenAlex, arXiv & Semantic Scholar with factual citation grounding.
          </p>
        </div>

        {/* ─── AI Triangulation Architecture Node Visual ─── */}
        <div className="w-full rounded-2xl border border-white/[0.12] bg-white/[0.03] p-4 sm:p-5 backdrop-blur-xl shadow-lg">
          {/* Central Nexus AI Engine */}
          <div className="mx-auto flex w-max items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
            <Cpu className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">NEXUS AI ENGINE</span>
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          </div>

          {/* SVG Connecting Branches */}
          <div className="my-2 flex justify-center">
            <svg className="w-64 h-8" viewBox="0 0 256 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M128 0V16M128 16L40 32M128 16L128 32M128 16L216 32" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
          </div>

          {/* 3 Connected Academic Repositories */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="architecture-node p-2 sm:p-2.5 text-center">
              <span className="text-[10px] font-mono font-semibold text-emerald-400">OpenAlex</span>
              <p className="text-[9px] text-[#94A3B8]">250M+ Works</p>
            </div>
            <div className="architecture-node p-2 sm:p-2.5 text-center">
              <span className="text-[10px] font-mono font-semibold text-amber-400">arXiv</span>
              <p className="text-[9px] text-[#94A3B8]">Preprints API</p>
            </div>
            <div className="architecture-node p-2 sm:p-2.5 text-center">
              <span className="text-[10px] font-mono font-semibold text-purple-400">Semantic Scholar</span>
              <p className="text-[9px] text-[#94A3B8]">Citation Graph</p>
            </div>
          </div>
        </div>

        {/* ─── Horizontal Research Pipeline Stepper ─── */}
        <div className="w-full">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#94A3B8] mb-3">
            Autonomous Pipeline Flow
          </p>
          <div className="flex items-center justify-between gap-1 overflow-x-auto py-1">
            {[
              { num: "01", label: "Search", icon: Search, active: true },
              { num: "02", label: "Retrieve", icon: DownloadCloud, active: false },
              { num: "03", label: "Rank", icon: Layers, active: false },
              { num: "04", label: "Synthesize", icon: Cpu, active: false },
              { num: "05", label: "Verify", icon: CheckCircle2, active: false },
            ].map((step, idx, arr) => (
              <div key={step.num} className="flex items-center gap-1 shrink-0">
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono border transition-all",
                    step.active
                      ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                      : "border-white/[0.08] bg-white/[0.03] text-[#94A3B8]"
                  )}
                >
                  <span className="text-[10px] font-bold">{step.num}</span>
                  <step.icon className="h-3 w-3" />
                  <span className="text-[11px] uppercase font-semibold">{step.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-white/20 shrink-0 mx-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Research Engine Status Bottom Card ─── */}
        <div className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] p-3 backdrop-blur-md">
          <div className="flex items-center justify-between text-[11px] mb-2 px-1">
            <span className="font-mono uppercase tracking-wider text-xs font-bold text-white">Research Engine Status</span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 text-[#CBD5E1]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px]">OpenAlex: <strong className="text-white">Ready</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CBD5E1]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px]">arXiv: <strong className="text-white">Ready</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CBD5E1]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px]">S2 Graph: <strong className="text-white">Ready</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#CBD5E1]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[11px]">Gemini 3.5: <strong className="text-white">Ready</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Populated Synthesis Report with Integrated Bottom References Section */
  return (
    <div className={cn("px-4 sm:px-6 py-5 space-y-6 animate-fade-in")}>
      {/* Research Question Header Badge */}
      {activeQuery && (
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.10]">
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="text-xs text-[#94A3B8] shrink-0">Research Topic:</span>
            <span className="text-xs text-white font-bold truncate">{activeQuery}</span>
          </div>
          <span className="rounded bg-cyan-400/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-400/25 shrink-0">
            Grounded RAG
          </span>
        </div>
      )}

      {/* Main Grounded Report Body */}
      <div className="prose-report">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
          {synthesisReport}
        </ReactMarkdown>
      </div>

      {/* ─── AUTHENTIC RESEARCH PAPER REFERENCES & SOURCES SECTION (AT BOTTOM) ─── */}
      {papers.length > 0 && (
        <div className="pt-6 border-t border-white/[0.12] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
                References & Primary Sources
              </h2>
            </div>
            <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-white/[0.10]">
              {papers.length} Scholarly Citations
            </span>
          </div>

          <div className="space-y-3">
            {papers.map((paper, idx) => {
              const citeNum = idx + 1;
              const isHighlighted = highlightedIndex === citeNum;

              return (
                <div
                  key={paper.id}
                  id={`reference-${citeNum}`}
                  className={cn(
                    "paper-card p-3.5 sm:p-4 transition-all duration-300 rounded-xl",
                    isHighlighted
                      ? "bg-cyan-500/20 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.30)] scale-[1.01]"
                      : "bg-white/[0.04] border-white/[0.10] hover:border-cyan-400/40"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Citation Index Number Pill */}
                    <span className="citation-pill shrink-0 px-2 py-0.5 text-xs font-mono font-bold mt-0.5">
                      [{citeNum}]
                    </span>

                    {/* Paper Details */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                        {paper.title}
                      </h4>

                      {/* Authors & Publication Year */}
                      <p className="text-[11px] sm:text-xs text-[#CBD5E1] mt-1">
                        {paper.authors.length > 0 ? paper.authors.join(", ") : "Unknown Authors"}
                        {paper.year ? ` (${paper.year})` : ""}
                      </p>

                      {/* Meta badges and links */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="rounded bg-white/[0.08] px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-white/[0.08] uppercase">
                          {paper.source === "arxiv" ? "arXiv Preprint" : paper.source === "openalex" ? "OpenAlex" : "Semantic Scholar"}
                        </span>

                        <span className="text-[#94A3B8] text-[11px]">
                          {formatCount(paper.citationCount)} citations
                        </span>

                        {paper.doi && (
                          <a
                            href={`https://doi.org/${paper.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 underline underline-offset-2 ml-1"
                          >
                            <Link2 className="h-3 w-3" />
                            <span>doi:{paper.doi}</span>
                          </a>
                        )}

                        <div className="ml-auto flex items-center gap-1.5 pt-1 sm:pt-0">
                          {paper.openAccessPdf && (
                            <a
                              href={paper.openAccessPdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium"
                              title="Download open-access PDF"
                            >
                              <Download className="h-3 w-3" />
                              <span>PDF</span>
                            </a>
                          )}
                          {paper.url && (
                            <a
                              href={paper.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium"
                              title="View paper at source"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Source</span>
                            </a>
                          )}
                          <button
                            onClick={() => setSelectedPaper(paper)}
                            className="btn-secondary inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium"
                            title="Inspect metadata & abstract"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Abstract</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
