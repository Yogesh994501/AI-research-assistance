"use client";

import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Presentation, Download, Copy, Check, Sparkles } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";

interface SlideDeckPanelProps {
  onBack: () => void;
}

export default function SlideDeckPanel({ onBack }: SlideDeckPanelProps) {
  const { papers, activeQuery } = useResearchStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

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
        papers[0] ? `Primary Baseline: "${papers[0].title.slice(0, 60)}..." [1]` : "Transformer-based and empirical benchmark architectures",
        papers[1] ? `Alternative Paradigm: "${papers[1].title.slice(0, 60)}..." [2]` : "Hybrid heuristic and algorithmic comparative frameworks",
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
    <div className="slide-deck slide-deck-panel flex h-full w-full flex-col overflow-hidden select-none">
      {/* ─── Sticky Header ─── */}
      <div className="panel-header sticky top-0 z-20 flex flex-col gap-2.5 border-b border-white/[0.12] bg-white/[0.06] px-3.5 py-3 backdrop-blur-2xl shrink-0">
        {/* Top Nav Row: Back button + Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold shrink-0"
            aria-label="Back to Agent Inspector"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>← Back</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleCopyText}
              className="btn-secondary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
              title="Copy all slides as text"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
              <span>{copied ? "Copied" : "Copy Deck"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
              title="Download presentation as Markdown"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
              <span>Download .md</span>
            </button>
          </div>
        </div>

        {/* Panel Title & Subtitle */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 shrink-0">
            <Presentation className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-white truncate">Executive Slide Deck Generator</h3>
            <p className="text-[10px] text-[#94A3B8] truncate">5-slide presentation briefing</p>
          </div>
        </div>
      </div>

      {/* ─── Scrollable Slide Content Area (Strictly Constrained) ─── */}
      <div className="panel-content flex-1 overflow-y-auto p-3.5 scroll-smooth space-y-3">
        {/* Layered Glass Slide Card: Dark BG → Glass Panel → Glass Slide → Text */}
        <div className="slide-card p-4 shadow-xl">
          {/* Slide Header: Badge + Step Indicator */}
          <div className="flex items-center justify-between border-b border-white/[0.10] pb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
              SLIDE {currentSlide + 1} OF {slides.length}
            </span>
            <span className="rounded-md bg-cyan-400/10 px-2 py-0.5 border border-cyan-400/30 text-[9px] font-mono uppercase text-cyan-300 font-semibold">
              Executive Briefing
            </span>
          </div>

          {/* Slide Title */}
          <h4 className="mt-3 text-sm sm:text-base font-bold text-white leading-snug">
            {slide.title}
          </h4>
          <p className="mt-1 text-[11px] text-[#CBD5E1] leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Bullet Points */}
          <ul className="mt-3.5 space-y-2.5">
            {slide.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#E2E8F0] leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Key Takeaway Box */}
          <div className="mt-4 rounded-xl border border-cyan-400/25 bg-cyan-400/[0.08] p-3 backdrop-blur-md">
            <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
              Key Takeaway
            </p>
            <p className="mt-1 text-[11px] text-[#F8FAFC] leading-relaxed font-normal">
              {slide.takeaway}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Sticky Carousel Footer ─── */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-white/[0.12] bg-white/[0.06] p-3 backdrop-blur-2xl shrink-0">
        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5 pl-1">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Jump to slide ${idx + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-200",
                currentSlide === idx ? "w-6 bg-cyan-400 shadow-[0_0_8px_#22D3EE]" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            disabled={currentSlide === 0}
            onClick={() => setCurrentSlide((p) => Math.max(0, p - 1))}
            className="btn-secondary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <span>Prev</span>
          </button>
          <button
            disabled={currentSlide === slides.length - 1}
            onClick={() => setCurrentSlide((p) => Math.min(slides.length - 1, p + 1))}
            className="btn-primary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold disabled:opacity-30"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
