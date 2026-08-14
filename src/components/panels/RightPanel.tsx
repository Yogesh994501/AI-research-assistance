"use client";

import { useState } from "react";
import { Presentation, FileDown, Headphones, ArrowUpRight } from "lucide-react";
import AgentStateOrb from "@/components/agent/AgentStateOrb";
import AgentWorkflow from "@/components/agent/AgentWorkflow";
import SlideDeckPanel from "@/components/generators/SlideDeckPanel";
import BibtexPanel from "@/components/generators/BibtexPanel";
import PodcastPanel from "@/components/generators/PodcastPanel";
import { cn } from "@/lib/utils";

type RightPanelView = "agent" | "slides" | "bibtex" | "podcast";

export default function RightPanel() {
  const [activeView, setActiveView] = useState<RightPanelView>("agent");

  const GENERATORS = [
    {
      id: "slides" as const,
      icon: Presentation,
      label: "Executive Slide Deck",
      desc: "Auto-generate 5-slide presentation",
      color: "text-cyan-400 border-cyan-500/30",
    },
    {
      id: "bibtex" as const,
      icon: FileDown,
      label: "Export BibTeX",
      desc: "Full formatted .bib citation library",
      color: "text-purple-400 border-purple-500/30",
    },
    {
      id: "podcast" as const,
      icon: Headphones,
      label: "Audio Podcast",
      desc: "Listen to 2-min audio narration",
      color: "text-emerald-400 border-emerald-500/30",
    },
  ];

  // Render Slide Deck Panel with Back Navigation & Independent Scrolling
  if (activeView === "slides") {
    return (
      <div className="flex h-full w-full flex-col glass rounded-xl overflow-hidden shadow-2xl animate-fade-in">
        <SlideDeckPanel onBack={() => setActiveView("agent")} />
      </div>
    );
  }

  // Render BibTeX Library Panel
  if (activeView === "bibtex") {
    return (
      <div className="flex h-full w-full flex-col glass rounded-xl overflow-hidden shadow-2xl animate-fade-in">
        <BibtexPanel onBack={() => setActiveView("agent")} />
      </div>
    );
  }

  // Render Podcast Audio Panel
  if (activeView === "podcast") {
    return (
      <div className="flex h-full w-full flex-col glass rounded-xl overflow-hidden shadow-2xl animate-fade-in">
        <PodcastPanel onBack={() => setActiveView("agent")} />
      </div>
    );
  }

  // Default: Agent Inspector & Workflow
  return (
    <div className="flex h-full flex-col glass rounded-xl overflow-hidden animate-fade-in">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shrink-0">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Agent Inspector</h2>
        <span className="text-[10px] text-cyan-400 font-mono">Workflow Engine</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Agent State Orb */}
        <AgentStateOrb />

        {/* Workflow Pipeline */}
        <div className="border-t border-zinc-800/50">
          <AgentWorkflow />
        </div>

        {/* Studio Generators */}
        <div className="border-t border-zinc-800/50 px-3 py-3">
          <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider mb-2.5 px-1">
            Studio Generators
          </p>
          <div className="flex flex-col gap-2">
            {GENERATORS.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setActiveView(gen.id)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl p-3 border text-left transition-all duration-200",
                  "bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:scale-[1.01] active:scale-[0.99]"
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border bg-zinc-950/60 shrink-0", gen.color)}>
                  <gen.icon className="h-4 w-4 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-zinc-200 font-medium group-hover:text-cyan-300 transition truncate">{gen.label}</p>
                    <ArrowUpRight className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate">{gen.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
