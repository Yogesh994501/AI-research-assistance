"use client";

import { FileSearch, Database, Sparkles, Layers, ShieldCheck } from "lucide-react";
import type { Paper } from "@/types";
import { useResearchStore } from "@/store/researchStore";
import PaperCard from "./PaperCard";

interface PaperListProps {
  papers: Paper[];
}

export default function PaperList({ papers }: PaperListProps) {
  const { selectedPaper, setSelectedPaper, isLoading } = useResearchStore();

  /* Loading Skeleton State */
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between px-1 py-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono text-cyan-300">Searching repositories...</span>
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white/[0.04] border border-white/[0.08] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 w-12 rounded bg-white/[0.10]" />
              <div className="h-3 w-16 rounded bg-white/[0.08]" />
            </div>
            <div className="h-3.5 w-full rounded bg-white/[0.12] mb-1.5" />
            <div className="h-3.5 w-3/4 rounded bg-white/[0.08] mb-3" />
            <div className="flex gap-3">
              <div className="h-2.5 w-12 rounded bg-white/[0.06]" />
              <div className="h-2.5 w-16 rounded bg-white/[0.06]" />
              <div className="h-2.5 w-10 rounded bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* Informative Research Discovery Empty State */
  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 py-8 text-center space-y-4">
        {/* Animated Database Radar Icon */}
        <div className="relative flex items-center justify-center">
          <div className="h-14 w-14 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center text-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.20)]">
            <Database className="h-7 w-7 stroke-[1.75]" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-cyan-400/20 blur-md -z-10 animate-pulse" />
        </div>

        {/* Informative Copy */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#F8FAFC]">
            No Papers Loaded
          </h3>
          <p className="text-[11px] text-[#94A3B8] mt-1 max-w-[220px] mx-auto leading-relaxed">
            Search the scholarly literature above to begin building your evidence base.
          </p>
        </div>

        {/* 3 Capability Cards */}
        <div className="w-full space-y-2 pt-2">
          <div className="paper-card flex items-center gap-3 p-2.5 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shrink-0">
              <Layers className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">15+ Sources</p>
              <p className="text-[10px] text-[#94A3B8] truncate">Retrieved & ranked per query</p>
            </div>
          </div>

          <div className="paper-card flex items-center gap-3 p-2.5 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/30 bg-purple-400/10 text-purple-300 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">3 Engines</p>
              <p className="text-[10px] text-[#94A3B8] truncate">OpenAlex · arXiv · Semantic Scholar</p>
            </div>
          </div>

          <div className="paper-card flex items-center gap-3 p-2.5 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">AI Evidence Ranking</p>
              <p className="text-[10px] text-[#94A3B8] truncate">Grounded citation verification</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Populated Papers List */
  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto">
      <div className="flex items-center justify-between px-1 pb-1">
        <div className="flex items-center gap-2">
          <FileSearch className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold text-[#CBD5E1]">
            {papers.length} Sources Ranked
          </span>
        </div>
        <span className="rounded bg-white/[0.08] px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 border border-white/[0.08]">
          Top Evidence
        </span>
      </div>
      {papers.map((paper, index) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          index={index}
          isSelected={selectedPaper?.id === paper.id}
          onSelect={setSelectedPaper}
        />
      ))}
    </div>
  );
}
