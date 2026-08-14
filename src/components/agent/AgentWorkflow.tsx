"use client";

import { useResearchStore } from "@/store/researchStore";
import WorkflowStepComponent from "./WorkflowStep";

export default function AgentWorkflow() {
  const { workflowSteps } = useResearchStore();

  return (
    <div className="px-3.5 py-3">
      <div className="flex items-center justify-between mb-3 px-1">
        <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider">
          Execution Pipeline
        </p>
        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded border border-cyan-400/20">
          6 Stages
        </span>
      </div>
      <div>
        {workflowSteps.map((step, i) => (
          <WorkflowStepComponent
            key={step.id}
            step={step}
            index={i}
            isLast={i === workflowSteps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
