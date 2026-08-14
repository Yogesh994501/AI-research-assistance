"use client";

import { useResearchStore } from "@/store/researchStore";
import WorkflowStepComponent from "./WorkflowStep";

export default function AgentWorkflow() {
  const { workflowSteps } = useResearchStore();

  return (
    <div className="px-3 py-2">
      <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mb-3 px-1">
        Execution Pipeline
      </p>
      <div>
        {workflowSteps.map((step, i) => (
          <WorkflowStepComponent
            key={step.id}
            step={step}
            isLast={i === workflowSteps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
