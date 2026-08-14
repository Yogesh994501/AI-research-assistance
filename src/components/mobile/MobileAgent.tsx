"use client";

import { useState } from "react";
import AgentStateOrb from "@/components/agent/AgentStateOrb";
import AgentWorkflow from "@/components/agent/AgentWorkflow";
import SlideDeckPanel from "@/components/generators/SlideDeckPanel";
import BibtexPanel from "@/components/generators/BibtexPanel";
import PodcastPanel from "@/components/generators/PodcastPanel";
import { Presentation, FileDown, Headphones, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileAgentView = "agent" | "slides" | "bibtex" | "podcast";

export default function MobileAgent() {
  const [activeView, setActiveView] = useState<MobileAgentView>("agent");

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
    <div className="glass-panel flex h-full flex-col overflow-y-auto p-3.5 animate-fade-in">
      {/* 2D State Orb */}
      <AgentStateOrb />

      {/* Stepper Pipeline */}
      <div className="mt-2 border-t border-white/[0.08] pt-3">
        <AgentWorkflow />
      </div>

      {/* Active Generator Cards */}
      <div className="mt-3 border-t border-white/[0.08] pt-3">
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] px-1">
          Studio Generators
        </p>
        <div className="flex flex-col gap-2">
          {GENERATORS.map((gen) => (
            <button
              key={gen.id}
              onClick={() => setActiveView(gen.id)}
              className={cn(
                "paper-card flex items-center gap-3 p-3 text-left transition active:scale-[0.98]"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border shrink-0", gen.color)}>
                <gen.icon className="h-4 w-4 shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#F8FAFC]">{gen.label}</p>
                <p className="text-[10px] text-[#94A3B8]">{gen.desc}</p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
