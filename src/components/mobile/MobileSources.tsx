"use client";

import { useState } from "react";
import { List, GitFork, Maximize2 } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-zinc-800/60 p-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Sources ({papers.length})
        </h2>
        <div className="flex rounded-lg border border-zinc-800/60 bg-zinc-900/60 p-0.5">
          <button
            onClick={() => setLeftPanelView("papers")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
              leftPanelView === "papers" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
            )}
          >
            <List className="h-3.5 w-3.5" />
            List
          </button>
          <button
            onClick={() => setLeftPanelView("graph")}
            className={cn(
              "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition",
              leftPanelView === "graph" ? "bg-zinc-800 text-zinc-100" : "text-zinc-500"
            )}
          >
            <GitFork className="h-3.5 w-3.5" />
            3D Graph
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="relative flex-1 overflow-y-auto">
        {leftPanelView === "graph" ? (
          <div className="relative h-full w-full">
            <ResearchCanvas />
            <button
              onClick={() => setIs3DFullscreen(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-zinc-900/80 px-2.5 py-1.5 text-xs text-cyan-400 backdrop-blur-md"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              Full 3D
            </button>
          </div>
        ) : (
          <PaperList papers={papers} />
        )}
      </div>

      {/* Selected Paper Details in Mobile BottomSheet */}
      <BottomSheet
        isOpen={Boolean(selectedPaper)}
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
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950">
          <div className="flex items-center justify-between border-b border-zinc-800 p-3">
            <span className="text-xs font-semibold text-zinc-200">3D Citation Constellation</span>
            <button
              onClick={() => setIs3DFullscreen(false)}
              className="rounded-lg bg-zinc-800 px-3 py-1 text-xs text-zinc-200"
            >
              Close
            </button>
          </div>
          <div className="flex-1">
            <ResearchCanvas />
          </div>
        </div>
      )}
    </div>
  );
}
