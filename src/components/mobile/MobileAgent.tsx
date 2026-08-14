"use client";

import { useState } from "react";
import AgentStateOrb from "@/components/agent/AgentStateOrb";
import AgentWorkflow from "@/components/agent/AgentWorkflow";
import SlideDeckModal from "@/components/generators/SlideDeckModal";
import BibtexModal from "@/components/generators/BibtexModal";
import PodcastModal from "@/components/generators/PodcastModal";
import { Presentation, FileDown, Headphones, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileAgent() {
  const [activeModal, setActiveModal] = useState<"slides" | "bibtex" | "podcast" | null>(null);

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

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 backdrop-blur-xl">
      {/* 2D State Orb */}
      <AgentStateOrb />

      {/* Stepper Pipeline */}
      <div className="mt-2 border-t border-zinc-800/60 pt-3">
        <AgentWorkflow />
      </div>

      {/* Active Generator Cards */}
      <div className="mt-3 border-t border-zinc-800/60 pt-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          Studio Generators
        </p>
        <div className="flex flex-col gap-2">
          {GENERATORS.map((gen) => (
            <button
              key={gen.id}
              onClick={() => setActiveModal(gen.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-2.5 text-left transition",
                "border-zinc-800/60 bg-zinc-900/60 active:scale-[0.98]"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg border bg-zinc-950/60", gen.color)}>
                <gen.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-200">{gen.label}</p>
                <p className="text-[10px] text-zinc-500">{gen.desc}</p>
              </div>
              <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Generator Modals */}
      <SlideDeckModal isOpen={activeModal === "slides"} onClose={() => setActiveModal(null)} />
      <BibtexModal isOpen={activeModal === "bibtex"} onClose={() => setActiveModal(null)} />
      <PodcastModal isOpen={activeModal === "podcast"} onClose={() => setActiveModal(null)} />
    </div>
  );
}
