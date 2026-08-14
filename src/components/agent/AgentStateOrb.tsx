"use client";

import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";
import type { AgentState } from "@/types";

const STATE_CONFIG: Record<AgentState, { label: string; sub: string; color: string; bgColor: string; borderColor: string; ringColor: string }> = {
  idle: {
    label: "READY",
    sub: "Waiting for query",
    color: "text-cyan-300",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    ringColor: "border-cyan-400/20",
  },
  searching: {
    label: "SEARCHING",
    sub: "Querying repositories",
    color: "text-cyan-300",
    bgColor: "bg-cyan-400/15",
    borderColor: "border-cyan-400/50",
    ringColor: "border-cyan-400/40",
  },
  synthesizing: {
    label: "SYNTHESIZING",
    sub: "Grounded reasoning",
    color: "text-purple-300",
    bgColor: "bg-purple-400/15",
    borderColor: "border-purple-400/50",
    ringColor: "border-purple-400/40",
  },
  complete: {
    label: "COMPLETE",
    sub: "Report synthesized",
    color: "text-emerald-300",
    bgColor: "bg-emerald-400/15",
    borderColor: "border-emerald-400/50",
    ringColor: "border-emerald-400/40",
  },
  error: {
    label: "ERROR",
    sub: "Execution halted",
    color: "text-rose-300",
    bgColor: "bg-rose-400/15",
    borderColor: "border-rose-400/50",
    ringColor: "border-rose-400/40",
  },
};

export default function AgentStateOrb() {
  const { agentState } = useResearchStore();
  const config = STATE_CONFIG[agentState] || STATE_CONFIG.idle;

  return (
    <div className="flex flex-col items-center gap-3 py-4 select-none">
      {/* ─── Concentric Rings AI Agent Visual ─── */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring 3 with Orbital Dots */}
        <div
          className={cn(
            "h-24 w-24 rounded-full border border-dashed transition-all duration-700 flex items-center justify-center",
            config.ringColor,
            agentState === "searching" && "animate-spin-slow",
            agentState === "synthesizing" && "animate-spin"
          )}
        >
          {/* Orbital North dot */}
          <span className="absolute -top-1 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
          {/* Orbital South dot */}
          <span className="absolute -bottom-1 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_8px_#C084FC]" />
          {/* Orbital East dot */}
          <span className="absolute -right-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
          {/* Orbital West dot */}
          <span className="absolute -left-1 h-1.5 w-1.5 rounded-full bg-cyan-300" />
        </div>

        {/* Middle Ring 2 */}
        <div
          className={cn(
            "absolute h-16 w-16 rounded-full border transition-all duration-500",
            config.borderColor,
            config.bgColor,
            agentState === "searching" && "animate-pulse"
          )}
        />

        {/* Center Core Dot */}
        <div
          className={cn(
            "absolute h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl",
            agentState === "idle" && "bg-cyan-500/30 border border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.4)]",
            agentState === "searching" && "bg-cyan-400 shadow-[0_0_20px_#22D3EE] animate-ping",
            agentState === "synthesizing" && "bg-purple-400 shadow-[0_0_20px_#C084FC]",
            agentState === "complete" && "bg-emerald-400 shadow-[0_0_20px_#34D399]",
            agentState === "error" && "bg-rose-400 shadow-[0_0_20px_#FB7185]"
          )}
        >
          <div className="h-3 w-3 rounded-full bg-white shadow-inner" />
        </div>
      </div>

      {/* ─── State Label & Active Engine Badge ─── */}
      <div className="text-center">
        <p className={cn("text-xs font-mono font-bold tracking-widest uppercase", config.color)}>
          {config.label}
        </p>
        <p className="text-[10px] text-[#94A3B8] font-medium mt-0.5">AGENT PIPELINE STATE</p>

        {/* Engine Status Tag */}
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-[#CBD5E1]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active: <strong className="text-white">Nexus Agent</strong></span>
        </div>
      </div>
    </div>
  );
}
