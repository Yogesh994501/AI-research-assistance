"use client";

import { useResearchStore } from "@/store/researchStore";
import SynthesisReport from "@/components/research/SynthesisReport";
import AgentStateOrb from "@/components/agent/AgentStateOrb";
import BottomSheet from "./BottomSheet";
import SourceInspector from "@/components/research/SourceInspector";

export default function MobileStudio() {
  const { selectedPaper, setSelectedPaper } = useResearchStore();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl">
      {/* Top Bar with Agent State indicator */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Studio Canvas
        </h2>
        <span className="text-[10px] text-zinc-500">Grounded Synthesis</span>
      </div>

      {/* Synthesis Content */}
      <div className="flex-1 overflow-y-auto">
        <SynthesisReport />
      </div>

      {/* BottomSheet for Citation Inspector */}
      <BottomSheet
        isOpen={Boolean(selectedPaper)}
        onClose={() => setSelectedPaper(null)}
        title="Cited Source"
      >
        {selectedPaper && (
          <SourceInspector
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
          />
        )}
      </BottomSheet>
    </div>
  );
}
