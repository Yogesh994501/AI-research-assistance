"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, FileDown, Copy, Check, Download } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";

interface BibtexPanelProps {
  onBack: () => void;
}

export default function BibtexPanel({ onBack }: BibtexPanelProps) {
  const { papers, activeQuery } = useResearchStore();
  const [copied, setCopied] = useState(false);

  const bibtexContent = useMemo(() => {
    if (papers.length === 0) {
      return "% No papers currently loaded in workspace.\n% Search for a research topic to generate citations.";
    }

    return papers
      .map((p, i) => {
        const firstAuthor = p.authors[0]?.split(" ").pop()?.toLowerCase() || "anon";
        const year = p.year || "2024";
        const key = `${firstAuthor}${year}${i + 1}`;
        const authors = p.authors.join(" and ") || "Unknown Author";

        return `@article{${key},
  title = {${p.title}},
  author = {${authors}},
  year = {${year}},
  journal = {${p.source === "arxiv" ? "arXiv preprint" : "Scholarly Literature"}},
  ${p.doi ? `doi = {${p.doi}},` : ""}
  ${p.url ? `url = {${p.url}},` : ""}
  ${p.abstract ? `abstract = {${p.abstract.slice(0, 200).replace(/[{}\\]/g, "")}...}` : ""}
}`;
      })
      .join("\n\n");
  }, [papers]);

  const handleCopy = () => {
    navigator.clipboard.writeText(bibtexContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([bibtexContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `citations-${(activeQuery || "research").slice(0, 20)}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="slide-deck slide-deck-panel flex h-full w-full flex-col overflow-hidden select-none">
      {/* ─── Sticky Header ─── */}
      <div className="panel-header sticky top-0 z-20 flex flex-col gap-2.5 border-b border-white/[0.12] bg-white/[0.06] px-3.5 py-3 backdrop-blur-2xl shrink-0">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold shrink-0"
            aria-label="Back to Agent Inspector"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>← Back</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span>.bib</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-400/10 text-purple-300 shrink-0">
            <FileDown className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-white truncate">Export BibTeX Library</h3>
            <p className="text-[10px] text-[#94A3B8] truncate">{papers.length} citations ready for LaTeX & Zotero</p>
          </div>
        </div>
      </div>

      {/* ─── Scrollable Code Content ─── */}
      <div className="panel-content flex-1 overflow-y-auto p-3.5 scroll-smooth">
        <div className="slide-card p-3.5 font-mono text-[11px] text-[#E2E8F0] shadow-inner">
          <pre className="whitespace-pre-wrap leading-relaxed">{bibtexContent}</pre>
        </div>
      </div>

      {/* ─── Sticky Footer ─── */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-white/[0.12] bg-white/[0.06] px-3.5 py-2.5 text-[10px] text-[#94A3B8] backdrop-blur-2xl shrink-0">
        <span>Standard BibTeX UTF-8</span>
        <span>{papers.length} sources</span>
      </div>
    </div>
  );
}
