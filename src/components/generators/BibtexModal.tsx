"use client";

import { useState, useMemo } from "react";
import { X, FileDown, Copy, Check, Download } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";

interface BibtexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BibtexModal({ isOpen, onClose }: BibtexModalProps) {
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2.5 sm:p-4 backdrop-blur-md">
      <div className="flex h-[88vh] sm:h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-700/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 sm:pb-4 shrink-0">
          <div className="flex items-center gap-2 text-cyan-400 min-w-0">
            <FileDown className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 truncate">BibTeX Library</h2>
              <p className="text-[10px] sm:text-xs text-zinc-400 truncate">{papers.length} sources formatted</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800 active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-400 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 sm:px-3 py-1.5 text-xs text-cyan-400 transition hover:bg-cyan-900/40 active:scale-95"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Download .bib</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95"
            >
              <X className="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="my-3 sm:my-4 flex-1 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 sm:p-4 font-mono text-[11px] sm:text-xs text-zinc-300">
          <pre className="whitespace-pre-wrap">{bibtexContent}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/60 shrink-0">
          <span>Standard BibTeX UTF-8</span>
          <span>{papers.length} citations</span>
        </div>
      </div>
    </div>
  );
}
