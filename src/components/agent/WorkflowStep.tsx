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
    pending: <Circle className="h-3.5 w-3.5 text-zinc-600" />,
    active: <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />,
    complete: <Check className="h-3.5 w-3.5 text-emerald-400" />,
    error: <AlertCircle className="h-3.5 w-3.5 text-red-400" />,
  };

  const lineColors = {
    pending: "bg-zinc-800",
    active: "bg-gradient-to-b from-cyan-500/50 to-zinc-800",
    complete: "bg-emerald-500/40",
    error: "bg-red-500/40",
  };

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border",
            step.status === "active" && "border-cyan-500/50 bg-cyan-500/10",
            step.status === "complete" && "border-emerald-500/40 bg-emerald-500/10",
            step.status === "error" && "border-red-500/40 bg-red-500/10",
            step.status === "pending" && "border-zinc-700/60 bg-zinc-900/40"
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
            "text-xs font-medium",
            step.status === "active" && "text-cyan-400",
            step.status === "complete" && "text-zinc-200",
            step.status === "error" && "text-red-400",
            step.status === "pending" && "text-zinc-500"
          )}
        >
          {step.title}
        </p>
        <p className="text-[11px] text-zinc-600 mt-0.5">{step.description}</p>
      </div>
    </div>
  );
}
