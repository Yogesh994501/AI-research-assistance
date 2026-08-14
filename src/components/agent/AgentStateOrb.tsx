"use client";

import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";
import type { AgentState } from "@/types";

const STATE_CONFIG: Record<AgentState, { label: string; color: string; bgColor: string; borderColor: string }> = {
  idle: { label: "Ready", color: "text-[#94A3B8]", bgColor: "bg-white/[0.04]", borderColor: "border-white/[0.12]" },
  searching: { label: "Searching", color: "text-cyan-300", bgColor: "bg-cyan-400/10", borderColor: "border-cyan-400/40" },
  synthesizing: { label: "Synthesizing", color: "text-purple-300", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/40" },
  complete: { label: "Complete", color: "text-emerald-300", bgColor: "bg-emerald-400/10", borderColor: "border-emerald-400/40" },
  error: { label: "Error", color: "text-rose-300", bgColor: "bg-rose-400/10", borderColor: "border-rose-400/40" },
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
              agentState === "idle" && "bg-slate-400",
              agentState === "searching" && "bg-cyan-400 shadow-[0_0_14px_#22D3EE]",
              agentState === "synthesizing" && "bg-purple-400 shadow-[0_0_14px_#C084FC]",
              agentState === "complete" && "bg-emerald-400 shadow-[0_0_14px_#34D399]",
              agentState === "error" && "bg-rose-400 shadow-[0_0_14px_#FB7185]"
            )}
          />
        </div>
        {/* Glow ring */}
        {agentState !== "idle" && (
          <div
            className={cn(
              "absolute -inset-2 rounded-full opacity-25 blur-md transition-all duration-500",
              agentState === "searching" && "bg-cyan-400",
              agentState === "synthesizing" && "bg-purple-400",
              agentState === "complete" && "bg-emerald-400",
              agentState === "error" && "bg-rose-400"
            )}
          />
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={cn("text-xs font-bold", config.color)}>{config.label}</p>
        <p className="text-[10px] text-[#94A3B8] mt-0.5 font-medium">Agent Pipeline State</p>
      </div>
    </div>
  );
}
