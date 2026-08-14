"use client";

import { useResearchStore } from "@/store/researchStore";
import SynthesisReport from "@/components/research/SynthesisReport";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function CenterPanel() {
  const { error, resetResearch } = useResearchStore();

  return (
    <div className="flex h-full flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
          Synthesis Canvas
        </h2>
        <span className="text-[10px] text-zinc-600">Grounded Report</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 px-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-400/60" />
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={resetResearch}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium bg-zinc-800/60 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700/60 transition"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </button>
          </div>
        ) : (
          <SynthesisReport />
        )}
      </div>
    </div>
  );
}
