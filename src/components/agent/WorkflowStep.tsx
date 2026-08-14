"use client";

import { Check, Loader2, Circle, AlertCircle } from "lucide-react";
import type { WorkflowStep as WorkflowStepType } from "@/types";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  step: WorkflowStepType;
  index: number;
  isLast: boolean;
}

export default function WorkflowStep({ step, index, isLast }: WorkflowStepProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  const icons = {
    pending: <span className="text-[10px] font-mono text-[#64748B] font-bold">{stepNumber}</span>,
    active: <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />,
    complete: <Check className="h-3.5 w-3.5 text-emerald-400" />,
    error: <AlertCircle className="h-3.5 w-3.5 text-rose-400" />,
  };

  const lineColors = {
    pending: "bg-white/[0.08]",
    active: "bg-gradient-to-b from-cyan-400/60 to-white/[0.08]",
    complete: "bg-emerald-400/50",
    error: "bg-rose-400/50",
  };

  return (
    <div className="flex gap-3">
      {/* Timeline with Step Number & Dot */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300 shrink-0",
            step.status === "active" && "border-cyan-400/60 bg-cyan-400/15 shadow-[0_0_12px_rgba(34,211,238,0.30)]",
            step.status === "complete" && "border-emerald-400/50 bg-emerald-400/15",
            step.status === "error" && "border-rose-400/50 bg-rose-400/15",
            step.status === "pending" && "border-white/[0.12] bg-white/[0.04]"
          )}
        >
          {icons[step.status]}
        </div>
        {!isLast && <div className={cn("w-px flex-1 min-h-[18px]", lineColors[step.status])} />}
      </div>

      {/* Content Body */}
      <div className="pb-3.5">
        <div className="flex items-center gap-1.5">
          <p
            className={cn(
              "text-xs font-bold",
              step.status === "active" && "text-cyan-300",
              step.status === "complete" && "text-white",
              step.status === "error" && "text-rose-300",
              step.status === "pending" && "text-[#94A3B8]"
            )}
          >
            {step.title}
          </p>
          {step.status === "active" && (
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </div>
        <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">{step.description}</p>
      </div>
    </div>
  );
}
