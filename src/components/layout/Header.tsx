"use client";

import { Hexagon } from "lucide-react";
import SearchBar from "@/components/research/SearchBar";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";

export default function Header() {
  const { agentState } = useResearchStore();

  return (
    <header className="safe-top flex items-center gap-4 px-4 py-3 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl z-20">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <Hexagon className="h-7 w-7 text-cyan-400" />
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full transition-all",
              agentState === "idle" && "bg-zinc-500",
              agentState === "searching" && "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]",
              agentState === "synthesizing" && "bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)]",
              agentState === "complete" && "bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
              agentState === "error" && "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            )}
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-bold text-gradient leading-none">NEXUS3D</h1>
          <p className="text-[9px] text-zinc-500 uppercase tracking-[0.15em]">Research Studio</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <SearchBar />
      </div>

      {/* Spacer for balance on desktop */}
      <div className="hidden lg:block w-20" />
    </header>
  );
}
