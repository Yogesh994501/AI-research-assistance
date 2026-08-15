"use client";

import { useState } from "react";
import { useResearchStore } from "@/store/researchStore";
import SynthesisReport from "@/components/research/SynthesisReport";
import AiChatPanel from "@/components/research/AiChatPanel";
import { FileText, Bot, Download, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { generateFullPaperMarkdown } from "@/lib/citations";
import { cn } from "@/lib/utils";

type CenterView = "report" | "chat";

export default function CenterPanel() {
  const { error, resetResearch, synthesisReport, papers, activeQuery, executeSearch, isLoading } = useResearchStore();
  const [activeView, setActiveView] = useState<CenterView>("report");

  const handleExportMarkdown = () => {
    if (!synthesisReport) return;
    const fullPaper = generateFullPaperMarkdown(synthesisReport, papers, activeQuery);
    const blob = new Blob([fullPaper], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Research-Paper-${(activeQuery || "Synthesis").slice(0, 30).replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResynthesize = () => {
    if (activeQuery && !isLoading) {
      executeSearch(activeQuery);
    }
  };

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden">
      {/* Center Panel Header with Mode Tabs & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-white/[0.10] bg-white/[0.03] backdrop-blur-xl shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-white/[0.04] p-0.5 border border-white/[0.10]">
          <button
            onClick={() => setActiveView("report")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
              activeView === "report"
                ? "tab-active"
                : "tab-inactive"
            )}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span>Grounded Synthesis</span>
          </button>
          <button
            onClick={() => setActiveView("chat")}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
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

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {synthesisReport && (
            <button
              onClick={handleExportMarkdown}
              className="btn-secondary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium"
              title="Download full research paper with references as Markdown"
            >
              <Download className="h-3 w-3 shrink-0" />
              <span>Download Paper (.md)</span>
            </button>
          )}

          {activeQuery && (
            <button
              onClick={handleResynthesize}
              disabled={isLoading}
              className="btn-primary flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium disabled:opacity-30"
              title="Re-run search & synthesis"
            >
              <RotateCcw className={cn("h-3 w-3 shrink-0", isLoading && "animate-spin")} />
              <span>Re-Synthesize</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center py-16 gap-3 px-6 text-center">
            <AlertCircle className="h-8 w-8 text-rose-400/80" />
            <p className="text-sm text-rose-300 max-w-md">{error}</p>
            <button
              onClick={resetResearch}
              className="btn-secondary flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Again</span>
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
