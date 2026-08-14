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
      color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
    },
    {
      id: "bibtex" as const,
      icon: FileDown,
      label: "Export BibTeX",
      desc: "Full formatted .bib citation library",
      color: "text-purple-400 border-purple-400/30 bg-purple-400/10",
    },
    {
      id: "podcast" as const,
      icon: Headphones,
      label: "Audio Podcast",
      desc: "Listen to 2-min audio narration",
      color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    },
  ];

  if (activeView === "slides") {
    return (
      <div className="glass-panel flex h-full w-full flex-col overflow-hidden shadow-2xl animate-fade-in">
        <SlideDeckPanel onBack={() => setActiveView("agent")} />
      </div>
    );
  }

  if (activeView === "bibtex") {
    return (
      <div className="glass-panel flex h-full w-full flex-col overflow-hidden shadow-2xl animate-fade-in">
        <BibtexPanel onBack={() => setActiveView("agent")} />
      </div>
    );
  }

  if (activeView === "podcast") {
    return (
      <div className="glass-panel flex h-full w-full flex-col overflow-hidden shadow-2xl animate-fade-in">
        <PodcastPanel onBack={() => setActiveView("agent")} />
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden animate-fade-in">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-white/[0.10] bg-white/[0.03] backdrop-blur-xl shrink-0">
        <h2 className="text-xs font-semibold text-white uppercase tracking-wider">Agent Inspector</h2>
        <span className="text-[10px] text-cyan-400 font-mono font-medium">Workflow Engine</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Agent State Orb */}
        <AgentStateOrb />

        {/* Workflow Pipeline */}
        <div className="border-t border-white/[0.08]">
          <AgentWorkflow />
        </div>

        {/* Studio Generators */}
        <div className="border-t border-white/[0.08] px-3 py-3.5">
          <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-wider mb-2.5 px-1">
            Studio Generators
          </p>
          <div className="flex flex-col gap-2">
            {GENERATORS.map((gen) => (
              <button
                key={gen.id}
                onClick={() => setActiveView(gen.id)}
                className={cn(
                  "paper-card group flex items-center gap-3 p-3 text-left transition-all duration-200"
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border shrink-0", gen.color)}>
                  <gen.icon className="h-4 w-4 shrink-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-[#F8FAFC] font-semibold group-hover:text-cyan-300 transition truncate">{gen.label}</p>
                    <ArrowUpRight className="h-3 w-3 text-[#64748B] opacity-0 group-hover:opacity-100 transition shrink-0" />
                  </div>
                  <p className="text-[10px] text-[#94A3B8] truncate">{gen.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
