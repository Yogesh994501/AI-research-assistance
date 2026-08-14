"use client";

import AgentStateOrb from "@/components/agent/AgentStateOrb";
import AgentWorkflow from "@/components/agent/AgentWorkflow";
import { Presentation, FileDown, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

const GENERATORS = [
  { icon: Presentation, label: "Executive Slide Deck", desc: "Auto-generate presentation", disabled: true },
  { icon: FileDown, label: "Export BibTeX", desc: "Full citation library", disabled: true },
  { icon: Headphones, label: "Audio Podcast", desc: "2-min audio narration", disabled: true },
];

export default function MobileAgent() {
  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3 backdrop-blur-xl">
      {/* 2D State Orb */}
      <AgentStateOrb />

      {/* Horizontal / Vertical Stepper */}
      <div className="mt-2 border-t border-zinc-800/60 pt-3">
        <AgentWorkflow />
      </div>

      {/* Generator Cards */}
      <div className="mt-3 border-t border-zinc-800/60 pt-3">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          Studio Generators
        </p>
        <div className="flex flex-col gap-2">
          {GENERATORS.map((gen) => (
            <div
              key={gen.label}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-2.5",
                "border-zinc-800/50 bg-zinc-900/40",
                gen.disabled ? "opacity-40" : "glass-interactive"
              )}
            >
              <gen.icon className="h-4 w-4 text-zinc-400" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-200">{gen.label}</p>
                <p className="text-[10px] text-zinc-500">{gen.desc}</p>
              </div>
              <span className="text-[9px] uppercase text-zinc-600">Soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
