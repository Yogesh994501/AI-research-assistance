"use client";

import { Hexagon } from "lucide-react";
import SearchBar from "@/components/research/SearchBar";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";

export default function Header() {
  const { agentState } = useResearchStore();

  return (
    <header className="safe-top flex items-center justify-between gap-3 sm:gap-5 px-4 sm:px-6 py-3 border-b border-white/[0.12] bg-white/[0.04] backdrop-blur-2xl z-20">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative flex items-center justify-center">
          <Hexagon className="h-7 w-7 text-cyan-400 shrink-0 stroke-[1.75]" />
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full transition-all duration-300",
              agentState === "idle" && "bg-slate-400",
              agentState === "searching" && "bg-cyan-400 shadow-[0_0_10px_#22D3EE]",
              agentState === "synthesizing" && "bg-violet-400 shadow-[0_0_10px_#A78BFA]",
              agentState === "complete" && "bg-emerald-400 shadow-[0_0_10px_#34D399]",
              agentState === "error" && "bg-rose-400 shadow-[0_0_10px_#FB7185]"
            )}
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold tracking-tight text-white leading-none">
            NEXUS<span className="text-cyan-400">3D</span>
          </h1>
          <p className="text-[9px] text-[#94A3B8] uppercase tracking-[0.18em] font-medium mt-0.5">Research Studio</p>
        </div>
      </div>

      {/* Search Bar Input */}
      <div className="flex-1 max-w-2xl min-w-0">
        <SearchBar />
      </div>

      {/* Spacer for desktop balance */}
      <div className="hidden lg:block w-20 shrink-0" />
    </header>
  );
}
