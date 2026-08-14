"use client";

import { useState } from "react";
import { useResearchStore } from "@/store/researchStore";
import SynthesisReport from "@/components/research/SynthesisReport";
import AiChatPanel from "@/components/research/AiChatPanel";
import BottomSheet from "./BottomSheet";
import SourceInspector from "@/components/research/SourceInspector";
import { FileText, Bot, Download, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type StudioView = "report" | "chat";

export default function MobileStudio() {
  const { selectedPaper, setSelectedPaper, synthesisReport, activeQuery, executeSearch, isLoading } = useResearchStore();
  const [activeView, setActiveView] = useState<StudioView>("report");

  const handleExportMarkdown = () => {
    if (!synthesisReport) return;
    const blob = new Blob([synthesisReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Synthesis-${(activeQuery || "Research").slice(0, 30)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Top Bar with View Tabs and Action Controls */}
      <div className="flex items-center justify-between border-b border-white/[0.10] px-3 py-2.5 bg-white/[0.03] backdrop-blur-xl shrink-0">
        <div className="flex rounded-lg bg-white/[0.04] border border-white/[0.10] p-0.5 shrink-0">
          <button
            onClick={() => setActiveView("report")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
              activeView === "report" ? "tab-active" : "tab-inactive"
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>Report</span>
          </button>
          <button
            onClick={() => setActiveView("chat")}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition",
              activeView === "chat"
                ? "tab-active"
                : "tab-inactive"
            )}
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>AI Assistant</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {synthesisReport && (
            <button
              onClick={handleExportMarkdown}
              className="btn-secondary flex items-center justify-center rounded-lg p-1.5 active:scale-95"
              title="Download Markdown"
            >
              <Download className="h-3.5 w-3.5 shrink-0" />
            </button>
          )}
          {activeQuery && (
            <button
              onClick={() => executeSearch(activeQuery)}
              disabled={isLoading}
              className="btn-primary flex items-center justify-center rounded-lg p-1.5 disabled:opacity-30 active:scale-95"
              title="Re-synthesize"
            >
              <RotateCcw className={cn("h-3.5 w-3.5 shrink-0", isLoading && "animate-spin")} />
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-hidden">
        {activeView === "chat" ? (
          <AiChatPanel />
        ) : (
          <div className="h-full overflow-y-auto">
            <SynthesisReport />
          </div>
        )}
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
