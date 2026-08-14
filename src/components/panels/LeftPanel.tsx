"use client";

import { List, GitFork, Hand } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import PaperList from "@/components/research/PaperList";
import SourceInspector from "@/components/research/SourceInspector";
import ResearchCanvas from "@/components/three/ResearchCanvas";
import { cn } from "@/lib/utils";

export default function LeftPanel() {
  const { papers, selectedPaper, setSelectedPaper, leftPanelView, setLeftPanelView } = useResearchStore();

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Persistent Header with View Toggle Controls */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-white/[0.10] bg-white/[0.03] backdrop-blur-xl shrink-0">
        <h2 className="text-xs font-bold text-white tracking-wider uppercase">Literature Index</h2>
        <div className="flex rounded-lg bg-white/[0.06] border border-white/[0.12] p-0.5 shrink-0">
          <button
            onClick={() => setLeftPanelView("papers")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all duration-150",
              leftPanelView === "papers"
                ? "tab-active"
                : "tab-inactive"
            )}
            aria-label="Paper list view"
          >
            <List className="h-3 w-3 shrink-0" />
            <span>Papers</span>
          </button>
          <button
            onClick={() => setLeftPanelView("graph")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all duration-150",
              leftPanelView === "graph"
                ? "tab-active"
                : "tab-inactive"
            )}
            aria-label="3D graph view"
          >
            <GitFork className="h-3 w-3 shrink-0" />
            <span>3D Graph</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 overflow-hidden">
        {leftPanelView === "graph" ? (
          <div className="relative h-full w-full bg-[#071014]/60">
            {/* Embedded 3D Canvas */}
            <div className="absolute inset-0">
              <ResearchCanvas />
            </div>

            {/* Gesture Hint Pill */}
            <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/[0.15] bg-white/[0.08] px-3 py-1 text-[10px] text-[#CBD5E1] backdrop-blur-xl shadow-lg">
              <Hand className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>Rotate · Dolly · Pan</span>
            </div>
          </div>
        ) : selectedPaper ? (
          <div className="h-full overflow-y-auto p-3">
            <SourceInspector paper={selectedPaper} onClose={() => setSelectedPaper(null)} />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <PaperList papers={papers} />
          </div>
        )}
      </div>
    </div>
  );
}
