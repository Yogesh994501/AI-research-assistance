"use client";

import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";
import type { AgentState } from "@/types";

const STATE_CONFIG: Record<AgentState, { label: string; color: string; bgColor: string; borderColor: string }> = {
  idle: { label: "Ready", color: "text-zinc-400", bgColor: "bg-zinc-500/10", borderColor: "border-zinc-600/40" },
  searching: { label: "Searching", color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/40" },
  synthesizing: { label: "Synthesizing", color: "text-violet-400", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/40" },
  complete: { label: "Complete", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/40" },
  error: { label: "Error", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/40" },
};

export default function AgentStateOrb() {
  const { agentState } = useResearchStore();
  const config = STATE_CONFIG[agentState];

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      {/* Orb */}
      <div className="relative">
        <div
          className={cn(
            "h-16 w-16 rounded-full border-2 transition-all duration-500",
            config.bgColor,
            config.borderColor,
            agentState === "searching" && "animate-pulse-slow",
            agentState === "synthesizing" && "animate-spin-slow"
          )}
        >
          <div
            className={cn(
              "absolute inset-2 rounded-full",
              config.bgColor,
              "transition-all duration-500"
            )}
          />
          {/* Center dot */}
          <div
            className={cn(
              "absolute inset-[30%] rounded-full transition-all duration-300",
              agentState === "idle" && "bg-zinc-600",
              agentState === "searching" && "bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]",
              agentState === "synthesizing" && "bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.5)]",
              agentState === "complete" && "bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]",
              agentState === "error" && "bg-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
            )}
          />
        </div>
        {/* Glow ring */}
        {agentState !== "idle" && (
          <div
            className={cn(
              "absolute -inset-2 rounded-full opacity-20 blur-md transition-all duration-500",
              agentState === "searching" && "bg-cyan-400",
              agentState === "synthesizing" && "bg-violet-400",
              agentState === "complete" && "bg-emerald-400",
              agentState === "error" && "bg-red-400"
            )}
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={cn("text-xs font-medium", config.color)}>{config.label}</p>
        <p className="text-[10px] text-zinc-600 mt-0.5">Agent Workflow State</p>
      </div>
    </div>
  );
}
