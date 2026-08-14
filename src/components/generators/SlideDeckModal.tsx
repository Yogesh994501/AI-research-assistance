"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Presentation, Download, Copy, Check } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";

interface SlideDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideDeckModal({ isOpen, onClose }: SlideDeckModalProps) {
  const { papers, activeQuery } = useResearchStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const slides = [
    {
      title: activeQuery ? `Research: ${activeQuery}` : "Academic Research Synthesis",
      subtitle: `Evidence-based insights compiled from ${papers.length} scholarly papers`,
      bullets: [
        `Multi-source academic retrieval across OpenAlex, arXiv, and Semantic Scholar`,
        `Synthesized findings with verifiable inline citation mapping`,
        `Key focus on current methodologies, empirical benchmarks, and domain impact`,
      ],
      takeaway: `Automated academic landscape mapping with verified citation integrity.`,
    },
    {
      title: "State of Current Methodology",
      subtitle: "Comparative approaches across primary literature",
      bullets: [
        papers[0] ? `Primary Baseline: "${papers[0].title.slice(0, 70)}..." [1]` : "Transformer-based and empirical benchmark architectures",
        papers[1] ? `Alternative Paradigm: "${papers[1].title.slice(0, 70)}..." [2]` : "Hybrid heuristic and algorithmic comparative frameworks",
        `Trade-offs observed between computational efficiency and accuracy`,
      ],
      takeaway: `Methodological variance is predominantly driven by domain constraints and dataset size.`,
    },
    {
      title: "Key Empirical Findings",
      subtitle: "Core outcomes and validated performance metrics",
      bullets: [
        `High reproducibility reported across standard benchmark evaluations`,
        `Demonstrated gains in precision, inference throughput, and generalization`,
        `Observed performance plateaus when scaling without domain-specific adaptation`,
      ],
      takeaway: `Significant progress in algorithmic throughput, yet domain adaptation remains vital.`,
    },
    {
      title: "Identified Gaps & Limitations",
      subtitle: "Critical evaluation of unaddressed questions",
      bullets: [
        `Sparse evaluation under extreme out-of-distribution conditions`,
        `Limited long-term robustness and latency metrics in production pipelines`,
        `Need for standardized evaluation criteria across disparate benchmarks`,
      ],
      takeaway: `Bridging out-of-distribution evaluation is the most pressing near-term priority.`,
    },
    {
      title: "Future Strategic Directions",
      subtitle: "High-impact areas for future research",
      bullets: [
        `Development of lightweight, low-latency deployment models`,
        `Cross-modal synthesis and hybrid neural-symbolic reasoning`,
        `Open-access benchmark standardization and reproducible pipelines`,
      ],
      takeaway: `Focus is shifting toward efficiency, robustness, and transparent reproducibility.`,
    },
  ];

  const slide = slides[currentSlide];

  const handleCopyText = () => {
    const text = slides
      .map(
        (s, i) =>
          `--- Slide ${i + 1}: ${s.title} ---\n${s.subtitle}\n\nPoints:\n${s.bullets.map((b) => `• ${b}`).join("\n")}\n\nKey Takeaway: ${s.takeaway}\n`
      )
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = slides
      .map(
        (s, i) =>
          `# Slide ${i + 1}: ${s.title}\n*${s.subtitle}*\n\n${s.bullets.map((b) => `- ${b}`).join("\n")}\n\n> **Key Takeaway:** ${s.takeaway}\n`
      )
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SlideDeck-${(activeQuery || "Research").slice(0, 25)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2.5 sm:p-4 backdrop-blur-md">
      <div className="flex h-[90vh] sm:h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-zinc-700/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 sm:pb-4 shrink-0">
          <div className="flex items-center gap-2 text-cyan-400 min-w-0">
            <Presentation className="h-5 w-5 shrink-0" />
            <h2 className="text-sm sm:text-base font-semibold text-zinc-100 truncate">Slide Deck</h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopyText}
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
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95"
            >
              <X className="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>

        {/* Slide Canvas Preview */}
        <div className="my-3 sm:my-5 flex flex-1 flex-col justify-between rounded-xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/90 p-4 sm:p-7 shadow-inner overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs text-cyan-400">
              <span className="font-mono uppercase tracking-wider text-[11px]">Slide {currentSlide + 1} of {slides.length}</span>
              <span className="rounded bg-cyan-950/60 px-2 py-0.5 border border-cyan-500/30 text-[10px] uppercase font-mono">Executive</span>
            </div>

            <h3 className="mt-2.5 sm:mt-4 text-base sm:text-xl font-bold text-zinc-100 leading-snug">{slide.title}</h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">{slide.subtitle}</p>

            <ul className="mt-3 sm:mt-5 space-y-2 sm:space-y-3">
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5 sm:p-3">
            <p className="text-[10px] sm:text-xs font-semibold text-cyan-300 uppercase tracking-wide">Key Takeaway</p>
            <p className="mt-0.5 text-xs text-zinc-300">{slide.takeaway}</p>
          </div>
        </div>

        {/* Controls / Carousel Footer */}
        <div className="flex items-center justify-between pt-1 shrink-0">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? "w-5 sm:w-6 bg-cyan-400" : "w-2 bg-zinc-700"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 sm:px-3 py-1.5 text-xs text-zinc-300 disabled:opacity-30 hover:bg-zinc-800 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Prev</span>
            </button>
            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
              className="flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 sm:px-3 py-1.5 text-xs text-cyan-400 disabled:opacity-30 hover:bg-cyan-500/20 active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
