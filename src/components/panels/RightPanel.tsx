"use client";

import { useState } from "react";
import { Presentation, FileDown, Headphones, ArrowUpRight } from "lucide-react";
import AgentStateOrb from "@/components/agent/AgentStateOrb";
import AgentWorkflow from "@/components/agent/AgentWorkflow";
import SlideDeckModal from "@/components/generators/SlideDeckModal";
import BibtexModal from "@/components/generators/BibtexModal";
import PodcastModal from "@/components/generators/PodcastModal";
import { cn } from "@/lib/utils";

export default function RightPanel() {
  const [activeModal, setActiveModal] = useState<"slides" | "bibtex" | "podcast" | null>(null);

  const GENERATORS = [
    {
      id: "slides" as const,
      icon: Presentation,
      label: "Executive Slide Deck",
      desc: "Auto-generate 5-slide presentation",
      badge: "Active",
      color: "text-cyan-400 border-cyan-500/30",
    },
    {
      id: "bibtex" as const,
      icon: FileDown,
      label: "Export BibTeX",
      desc: "Full formatted .bib citation library",
      badge: "Active",
      color: "text-purple-400 border-purple-500/30",
    },
    {
      id: "podcast" as const,
      icon: Headphones,
      label: "Audio Podcast",
      desc: "Listen to 2-min audio narration",
      badge: "Active",
      color: "text-emerald-400 border-emerald-500/30",
    },
  ];

  return (
    <div className="flex h-full flex-col glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
        <h2 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Agent Inspector</h2>
        <span className="text-[10px] text-zinc-600">Workflow</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Agent State Orb */}
        <AgentStateOrb />

        {/* Workflow */}
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
                onClick={() => setActiveModal(gen.id)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl p-3 border text-left transition-all duration-200",
                  "bg-zinc-900/40 border-zinc-800/60 hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:scale-[1.01]"
                )}
              >
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border bg-zinc-950/60", gen.color)}>
                  <gen.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs text-zinc-200 font-medium group-hover:text-cyan-300 transition">{gen.label}</p>
                    <ArrowUpRight className="h-3 w-3 text-zinc-500 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <p className="text-[10px] text-zinc-500">{gen.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generator Modals */}
      <SlideDeckModal isOpen={activeModal === "slides"} onClose={() => setActiveModal(null)} />
      <BibtexModal isOpen={activeModal === "bibtex"} onClose={() => setActiveModal(null)} />
      <PodcastModal isOpen={activeModal === "podcast"} onClose={() => setActiveModal(null)} />
    </div>
  );
}
