"use client";

import { Hexagon, Activity, Cpu, Sparkles } from "lucide-react";
import SearchBar from "@/components/research/SearchBar";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";

export default function Header() {
  const { agentState, papers } = useResearchStore();

  return (
    <header className="safe-top flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-3 border-b border-white/[0.12] bg-white/[0.04] backdrop-blur-2xl z-20 shrink-0">
      {/* ─── LEFT: Logo & Subtitle ─── */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex items-center justify-center">
          <Hexagon className="h-7 w-7 text-cyan-400 shrink-0 stroke-[1.8]" />
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full transition-all duration-300",
              agentState === "idle" && "bg-cyan-400 shadow-[0_0_8px_#22D3EE]",
              agentState === "searching" && "bg-cyan-400 shadow-[0_0_12px_#22D3EE] animate-ping",
              agentState === "synthesizing" && "bg-purple-400 shadow-[0_0_12px_#A78BFA] animate-pulse",
              agentState === "complete" && "bg-emerald-400 shadow-[0_0_10px_#34D399]",
              agentState === "error" && "bg-rose-400 shadow-[0_0_10px_#FB7185]"
            )}
          />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-bold tracking-tight text-white leading-none">
              NEXUS<span className="text-cyan-400">3D</span>
            </h1>
            <span className="rounded bg-cyan-400/10 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-400/25">
              v2.4
            </span>
          </div>
          <p className="text-[9px] text-[#94A3B8] uppercase tracking-[0.18em] font-semibold mt-0.5">Research Studio</p>
        </div>
      </div>

      {/* ─── CENTER: Large Research Search Bar ─── */}
      <div className="flex-1 max-w-3xl min-w-0">
        <SearchBar />
      </div>

      {/* ─── RIGHT: Bloomberg/Scientific Status Dashboard ─── */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        {/* System Online Status Pill */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">System Online</span>
        </div>

        {/* AI Engine Status Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.12] bg-white/[0.05] px-2.5 py-1 text-xs text-[#CBD5E1]">
          <Cpu className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="text-[11px] font-medium">Gemini 3.5</span>
        </div>

        {/* Sources Counter Pill */}
        {papers.length > 0 && (
          <div className="flex items-center gap-1 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-300 font-mono">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>{papers.length} Sources</span>
          </div>
        )}
      </div>
    </header>
  );
}
