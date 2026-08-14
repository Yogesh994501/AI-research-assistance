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

  // Generate valid BibTeX entries for all retrieved papers
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="flex h-[80vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-700/80 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-400">
            <FileDown className="h-5 w-5" />
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Export BibTeX Library</h2>
              <p className="text-xs text-zinc-400">Formatted for LaTeX, Overleaf, Zotero & Mendeley ({papers.length} sources)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy to Clipboard"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs text-cyan-400 transition hover:bg-cyan-900/40"
            >
              <Download className="h-3.5 w-3.5" />
              Download .bib
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="my-4 flex-1 overflow-auto rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 font-mono text-xs text-zinc-300">
          <pre className="whitespace-pre-wrap">{bibtexContent}</pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800/60">
          <span>Standard BibTeX UTF-8 format</span>
          <span>{papers.length} citations ready for export</span>
        </div>
      </div>
    </div>
  );
}
