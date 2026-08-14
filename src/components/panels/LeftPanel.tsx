"use client";

import { List, GitFork } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import PaperList from "@/components/research/PaperList";
import SourceInspector from "@/components/research/SourceInspector";
import { cn } from "@/lib/utils";

export default function LeftPanel() {
  const { papers, selectedPaper, setSelectedPaper, leftPanelView, setLeftPanelView } = useResearchStore();

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.10] bg-white/[0.03] backdrop-blur-xl shrink-0">
        <h2 className="text-xs font-semibold text-[#F8FAFC] tracking-wider uppercase">Literature Index</h2>
        <div className="flex rounded-lg bg-white/[0.04] border border-white/[0.10] p-0.5 shrink-0">
          <button
            onClick={() => setLeftPanelView("papers")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
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
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-150",
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
