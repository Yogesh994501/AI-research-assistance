"use client";

import { useMemo, useCallback, Fragment } from "react";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import { getCitedPaper } from "@/lib/citations";
import CitationBadge from "./CitationBadge";
import { cn } from "@/lib/utils";

/** Parse markdown text and replace [N] with interactive CitationBadge components */
function renderWithCitations(
  text: string,
  onCitationClick: (index: number) => void
): React.ReactNode[] {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      return <CitationBadge key={i} index={idx} onClick={onCitationClick} inline />;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Simple markdown-to-JSX renderer */
function renderMarkdown(
  markdown: string,
  onCitationClick: (index: number) => void
): React.ReactNode[] {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); /* skip separator row */
      elements.push(
        <div key={`table-${elements.length}`} className="my-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-700/60">
                {headerRow.map((cell, ci) => (
                  <th key={ci} className="px-3 py-2 text-left text-zinc-400 font-medium">
                    {renderWithCitations(cell.trim(), onCitationClick)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri} className="border-b border-zinc-800/40">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-zinc-300">
                      {renderWithCitations(cell.trim(), onCitationClick)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    /* Table detection */
    if (line.includes("|") && line.trim().startsWith("|")) {
      if (!inTable) inTable = true;
      const cells = line.split("|").filter((c) => c.trim() !== "");
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    /* Headings */
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm font-semibold text-zinc-200 mt-5 mb-2 flex items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent max-w-[40px]" />
          {renderWithCitations(line.slice(4), onCitationClick)}
        </h3>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base font-semibold text-zinc-100 mt-6 mb-3">
          {renderWithCitations(line.slice(3), onCitationClick)}
        </h2>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="my-2 border-l-2 border-cyan-500/40 pl-3 text-xs text-zinc-400 italic">
          {renderWithCitations(line.slice(2), onCitationClick)}
        </blockquote>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={i} className="ml-4 text-xs text-zinc-300 leading-relaxed list-disc">
          {renderWithCitations(line.slice(2), onCitationClick)}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={i} className="ml-4 text-xs text-zinc-300 leading-relaxed list-decimal">
          {renderWithCitations(line.replace(/^\d+\.\s/, ""), onCitationClick)}
        </li>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      /* Apply inline bold/italic */
      let processed = line;
      processed = processed.replace(/\*\*(.+?)\*\*/g, "⟨b⟩$1⟨/b⟩");
      processed = processed.replace(/\*(.+?)\*/g, "⟨i⟩$1⟨/i⟩");

      const inlineParts = processed.split(/(⟨\/?[bi]⟩)/g);
      let bold = false;
      let italic = false;
      const inlineElements: React.ReactNode[] = [];

      for (let j = 0; j < inlineParts.length; j++) {
        const p = inlineParts[j];
        if (p === "⟨b⟩") { bold = true; continue; }
        if (p === "⟨/b⟩") { bold = false; continue; }
        if (p === "⟨i⟩") { italic = true; continue; }
        if (p === "⟨/i⟩") { italic = false; continue; }
        if (p) {
          const citElements = renderWithCitations(p, onCitationClick);
          if (bold) {
            inlineElements.push(<strong key={j} className="text-zinc-100 font-semibold">{citElements}</strong>);
          } else if (italic) {
            inlineElements.push(<em key={j} className="text-zinc-400">{citElements}</em>);
          } else {
            inlineElements.push(<Fragment key={j}>{citElements}</Fragment>);
          }
        }
      }

      elements.push(
        <p key={i} className="text-xs text-zinc-300 leading-relaxed">
          {inlineElements}
        </p>
      );
    }
  }

  if (inTable) flushTable();

  return elements;
}

export default function SynthesisReport() {
  const { synthesisReport, papers, agentState, activeQuery, isLoading, setSelectedPaper } = useResearchStore();

  const handleCitationClick = useCallback(
    (index: number) => {
      const paper = getCitedPaper(index, papers);
      if (paper) setSelectedPaper(paper);
    },
    [papers, setSelectedPaper]
  );

  const renderedReport = useMemo(() => {
    if (!synthesisReport) return null;
    return renderMarkdown(synthesisReport, handleCitationClick);
  }, [synthesisReport, handleCitationClick]);

  /* Loading state */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-zinc-400">Synthesizing research…</p>
        <p className="text-xs text-zinc-600">{activeQuery}</p>
      </div>
    );
  }

  /* Empty state */
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
            All findings are grounded with inline citations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("px-4 py-4 space-y-1 animate-fade-in", "max-w-none prose-sm")}>
      {/* Query badge */}
      {activeQuery && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800/50">
          <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
          <span className="text-xs text-zinc-400">Research Question:</span>
          <span className="text-xs text-zinc-200 font-medium">{activeQuery}</span>
        </div>
      )}
      {renderedReport}
    </div>
  );
}
