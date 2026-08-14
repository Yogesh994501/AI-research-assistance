"use client";

import { Check, Loader2, Circle, AlertCircle } from "lucide-react";
import type { WorkflowStep as WorkflowStepType } from "@/types";
import { cn } from "@/lib/utils";

interface WorkflowStepProps {
  step: WorkflowStepType;
  isLast: boolean;
}

export default function WorkflowStep({ step, isLast }: WorkflowStepProps) {
  const icons = {
    pending: <Circle className="h-3.5 w-3.5 text-[#64748B]" />,
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
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-all",
            step.status === "active" && "border-cyan-400/60 bg-cyan-400/15 shadow-[0_0_10px_rgba(34,211,238,0.25)]",
            step.status === "complete" && "border-emerald-400/50 bg-emerald-400/15",
            step.status === "error" && "border-rose-400/50 bg-rose-400/15",
            step.status === "pending" && "border-white/[0.12] bg-white/[0.04]"
          )}
        >
          {icons[step.status]}
        </div>
        {!isLast && <div className={cn("w-px flex-1 min-h-[16px]", lineColors[step.status])} />}
      </div>

      {/* Content */}
      <div className="pb-4">
        <p
          className={cn(
            "text-xs font-semibold",
            step.status === "active" && "text-cyan-300",
            step.status === "complete" && "text-[#F8FAFC]",
            step.status === "error" && "text-rose-300",
            step.status === "pending" && "text-[#94A3B8]"
          )}
        >
          {step.title}
        </p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5">{step.description}</p>
      </div>
    </div>
  );
}
