"use client";

import { useState } from "react";
import { List, GitFork, Maximize2, X, Compass, Hand } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import PaperList from "@/components/research/PaperList";
import SourceInspector from "@/components/research/SourceInspector";
import BottomSheet from "./BottomSheet";
import ResearchCanvas from "@/components/three/ResearchCanvas";
import { cn } from "@/lib/utils";

export default function MobileSources() {
  const { papers, selectedPaper, setSelectedPaper, leftPanelView, setLeftPanelView } = useResearchStore();
  const [is3DFullscreen, setIs3DFullscreen] = useState(false);

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between border-b border-white/[0.10] p-3 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <Compass className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white truncate">
            Sources ({papers.length})
          </h2>
        </div>

        <div className="flex rounded-lg border border-white/[0.10] bg-white/[0.04] p-0.5 shrink-0">
          <button
            onClick={() => setLeftPanelView("papers")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
              leftPanelView === "papers" ? "tab-active" : "tab-inactive"
            )}
          >
            <List className="h-3.5 w-3.5 shrink-0" />
            <span>List</span>
          </button>
          <button
            onClick={() => setLeftPanelView("graph")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
              leftPanelView === "graph" ? "tab-active" : "tab-inactive"
            )}
          >
            <GitFork className="h-3.5 w-3.5 shrink-0" />
            <span>3D Graph</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative flex-1 overflow-hidden">
        {leftPanelView === "graph" ? (
          <div className="relative h-full w-full bg-[#071014]/80">
            {/* Embedded 3D Canvas */}
            <div className="absolute inset-0">
              <ResearchCanvas />
            </div>

            {/* Gesture Hint Pill */}
            <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-white/[0.15] bg-white/[0.08] px-3 py-1 text-[11px] text-[#CBD5E1] backdrop-blur-xl shadow-lg">
              <Hand className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>Touch & drag to explore</span>
            </div>

            {/* Maximize to Full 3D Button */}
            <button
              onClick={() => setIs3DFullscreen(true)}
              className="btn-primary absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md active:scale-95"
            >
              <Maximize2 className="h-3.5 w-3.5 shrink-0" />
              <span>Full 3D</span>
            </button>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <PaperList papers={papers} />
          </div>
        )}
      </div>

      {/* Selected Paper Details in Mobile BottomSheet */}
      <BottomSheet
        isOpen={Boolean(selectedPaper) && !is3DFullscreen}
        onClose={() => setSelectedPaper(null)}
        title="Paper Details"
      >
        {selectedPaper && (
          <SourceInspector
            paper={selectedPaper}
            onClose={() => setSelectedPaper(null)}
          />
        )}
      </BottomSheet>

      {/* Fullscreen 3D Modal for Mobile */}
      {is3DFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#071014]">
          {/* Top Bar with Safe Area */}
          <div className="safe-top flex items-center justify-between border-b border-white/[0.12] bg-white/[0.06] px-4 py-3 backdrop-blur-2xl z-20">
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-bold text-white">3D Constellation</span>
              <span className="rounded-md bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-400/30">
                {papers.length} nodes
              </span>
            </div>
            <button
              onClick={() => setIs3DFullscreen(false)}
              className="btn-secondary flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium active:scale-95"
            >
              <X className="h-4 w-4 shrink-0" />
              <span>Close</span>
            </button>
          </div>

          {/* 3D Canvas Area */}
          <div className="relative flex-1">
            <ResearchCanvas />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.08] px-3.5 py-1.5 text-[11px] text-[#CBD5E1] backdrop-blur-2xl shadow-2xl">
              <span>1 finger rotates · 2 fingers zoom</span>
            </div>
          </div>

          {/* Paper preview in fullscreen 3D if tapped */}
          {selectedPaper && (
            <div className="safe-bottom border-t border-white/[0.12] bg-white/[0.08] p-3.5 backdrop-blur-2xl z-20">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{selectedPaper.title}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                    {selectedPaper.authors.slice(0, 2).join(", ")} ({selectedPaper.year || "n.d."}) • {selectedPaper.citationCount} citations
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="p-1 rounded text-[#94A3B8] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
