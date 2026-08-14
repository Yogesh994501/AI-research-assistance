"use client";

import { useState } from "react";
import { useResearchStore } from "@/store/researchStore";
import SynthesisReport from "@/components/research/SynthesisReport";
import AiChatPanel from "@/components/research/AiChatPanel";
import { FileText, Bot, Download, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type CenterView = "report" | "chat";

export default function CenterPanel() {
  const { error, resetResearch, synthesisReport, activeQuery, executeSearch, isLoading } = useResearchStore();
  const [activeView, setActiveView] = useState<CenterView>("report");

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

  const handleResynthesize = () => {
    if (activeQuery && !isLoading) {
      executeSearch(activeQuery);
    }
  };

  return (
    <div className="flex h-full flex-col glass rounded-xl overflow-hidden">
      {/* Center Panel Header with Mode Tabs & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-zinc-800/60 bg-zinc-950/40">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-900/80 p-0.5 border border-zinc-800/80">
          <button
            onClick={() => setActiveView("report")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
              activeView === "report"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <FileText className="h-3.5 w-3.5" />
            Grounded Synthesis
          </button>
          <button
            onClick={() => setActiveView("chat")}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition",
              activeView === "chat"
                ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            AI Assistant
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {synthesisReport && (
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1 rounded-lg border border-zinc-700/60 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
              title="Download report as Markdown"
            >
              <Download className="h-3 w-3" />
              Export .md
            </button>
          )}

          {activeQuery && (
            <button
              onClick={handleResynthesize}
              disabled={isLoading}
              className="flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-xs text-cyan-300 transition hover:bg-cyan-900/40 disabled:opacity-30"
              title="Re-run search & synthesis"
            >
              <RotateCcw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              Re-Synthesize
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center py-16 gap-3 px-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-400/60" />
            <p className="text-sm text-red-400 max-w-md">{error}</p>
            <button
              onClick={resetResearch}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium bg-zinc-800/60 text-zinc-300 border border-zinc-700/60 hover:bg-zinc-700/60 transition"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </button>
          </div>
        ) : activeView === "chat" ? (
          <AiChatPanel />
        ) : (
          <div className="h-full overflow-y-auto">
            <SynthesisReport />
          </div>
        )}
      </div>
    </div>
  );
}
