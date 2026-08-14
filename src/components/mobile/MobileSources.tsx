"use client";

import { useState } from "react";
import { List, GitFork, Maximize2, X, RotateCcw, Compass, Hand } from "lucide-react";
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
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 p-2.5 sm:p-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <Compass className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 truncate">
            Sources ({papers.length})
          </h2>
        </div>

        <div className="flex rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-0.5 shrink-0">
          <button
            onClick={() => setLeftPanelView("papers")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
              leftPanelView === "papers" ? "bg-zinc-800 text-zinc-100 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <List className="h-3.5 w-3.5 shrink-0" />
            <span>List</span>
          </button>
          <button
            onClick={() => setLeftPanelView("graph")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
              leftPanelView === "graph" ? "bg-zinc-800 text-cyan-300 shadow-sm" : "text-zinc-400 hover:text-zinc-200"
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
          <div className="relative h-full w-full bg-zinc-950/80">
            {/* Embedded 3D Canvas */}
            <div className="absolute inset-0">
              <ResearchCanvas />
            </div>

            {/* Gesture Hint Pill */}
            <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-2.5 py-1 text-[10px] text-zinc-300 backdrop-blur-md">
              <Hand className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>Touch & drag to explore</span>
            </div>

            {/* Maximize to Full 3D Button */}
            <button
              onClick={() => setIs3DFullscreen(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-zinc-900/90 px-3 py-1.5 text-xs font-medium text-cyan-300 shadow-lg backdrop-blur-md transition hover:bg-cyan-950/50 active:scale-95"
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

      {/* Fullscreen 3D Modal for Mobile with Floating Controls */}
      {is3DFullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
          {/* Top Bar with Safe Area */}
          <div className="safe-top flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/90 px-4 py-3 backdrop-blur-xl z-20">
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="text-xs font-semibold text-zinc-100">3D Constellation</span>
              <span className="rounded bg-cyan-950/60 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                {papers.length} nodes
              </span>
            </div>
            <button
              onClick={() => setIs3DFullscreen(false)}
              className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700 active:scale-95 transition"
            >
              <X className="h-4 w-4 shrink-0" />
              <span>Close</span>
            </button>
          </div>

          {/* 3D Canvas Area */}
          <div className="relative flex-1">
            <ResearchCanvas />

            {/* Gesture Hint Pill */}
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/80 px-3 py-1.5 text-[11px] text-zinc-300 backdrop-blur-md shadow-xl">
              <span>1 finger rotates · 2 fingers zoom</span>
            </div>
          </div>

          {/* Paper preview in fullscreen 3D if tapped */}
          {selectedPaper && (
            <div className="safe-bottom border-t border-zinc-800 bg-zinc-950/95 p-3 backdrop-blur-xl z-20">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-100 truncate">{selectedPaper.title}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    {selectedPaper.authors.slice(0, 2).join(", ")} ({selectedPaper.year || "n.d."}) • {selectedPaper.citationCount} citations
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-200"
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
