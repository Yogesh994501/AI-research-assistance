"use client";

import { List, GitFork } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import PaperList from "@/components/research/PaperList";
import SourceInspector from "@/components/research/SourceInspector";
import { cn } from "@/lib/utils";

export default function LeftPanel() {
  const { papers, selectedPaper, setSelectedPaper, leftPanelView, setLeftPanelView } = useResearchStore();

  return (
    <div className="flex h-full flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Literature Index</h2>
        <div className="flex rounded-lg bg-zinc-900/60 border border-zinc-800/50 p-0.5">
          <button
            onClick={() => setLeftPanelView("papers")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition",
              leftPanelView === "papers"
                ? "bg-zinc-800 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300"
            )}
            aria-label="Paper list view"
          >
            <List className="h-3 w-3" />
            Papers
          </button>
          <button
            onClick={() => setLeftPanelView("graph")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition",
              leftPanelView === "graph"
                ? "bg-zinc-800 text-zinc-200"
                : "text-zinc-500 hover:text-zinc-300"
            )}
            aria-label="3D graph view"
          >
            <GitFork className="h-3 w-3" />
            3D Graph
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedPaper ? (
          <div className="p-3">
            <SourceInspector paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
          </div>
        ) : (
          <PaperList papers={papers} />
        )}
      </div>
    </div>
  );
}
