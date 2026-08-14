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
    <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-950/70 select-none">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-20 flex flex-col gap-2 border-b border-zinc-800/80 bg-zinc-950/95 px-3 py-2.5 backdrop-blur-xl shrink-0">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 active:scale-95 shrink-0"
            aria-label="Back to Agent Inspector"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-purple-400 shrink-0" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-zinc-700/80 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
            >
              {copied ? <Check className="h-3 w-3 text-green-400 shrink-0" /> : <Copy className="h-3 w-3 shrink-0" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg border border-purple-500/40 bg-purple-950/40 px-2.5 py-1 text-xs font-medium text-purple-300 transition hover:bg-purple-900/50 active:scale-95"
            >
              <Download className="h-3 w-3 shrink-0" />
              <span>.bib</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-purple-500/30 bg-purple-950/50 text-purple-400 shrink-0">
            <FileDown className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-zinc-100 truncate">Export BibTeX Library</h3>
            <p className="text-[10px] text-zinc-500 truncate">{papers.length} citations ready for LaTeX & Zotero</p>
          </div>
        </div>
      </div>

      {/* ─── Scrollable Code Content ─── */}
      <div className="flex-1 overflow-y-auto p-3 scroll-smooth">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 font-mono text-[11px] text-zinc-300">
          <pre className="whitespace-pre-wrap leading-relaxed">{bibtexContent}</pre>
        </div>
      </div>

      {/* ─── Sticky Footer ─── */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/95 px-3 py-2 text-[10px] text-zinc-500 backdrop-blur-xl shrink-0">
        <span>Standard BibTeX UTF-8</span>
        <span>{papers.length} sources</span>
      </div>
    </div>
  );
}
