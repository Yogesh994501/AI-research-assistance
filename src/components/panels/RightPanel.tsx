"use client";

import { Presentation, FileDown, Headphones } from "lucide-react";
import AgentStateOrb from "@/components/agent/AgentStateOrb";
import AgentWorkflow from "@/components/agent/AgentWorkflow";
import { cn } from "@/lib/utils";

const GENERATORS = [
  { icon: Presentation, label: "Executive Slide Deck", desc: "Auto-generate presentation", disabled: true },
  { icon: FileDown, label: "Export BibTeX", desc: "Full citation library", disabled: true },
  { icon: Headphones, label: "Audio Podcast", desc: "2-min audio narration", disabled: true },
];

export default function RightPanel() {
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

        {/* Generators */}
        <div className="border-t border-zinc-800/50 px-3 py-3">
          <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider mb-2 px-1">
            Studio Generators
          </p>
          <div className="flex flex-col gap-2">
            {GENERATORS.map((gen) => (
              <div
                key={gen.label}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2.5 border",
                  "bg-zinc-900/30 border-zinc-800/50",
                  gen.disabled ? "opacity-40 cursor-not-allowed" : "glass-interactive cursor-pointer"
                )}
              >
                <gen.icon className="h-4 w-4 text-zinc-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-300 font-medium">{gen.label}</p>
                  <p className="text-[10px] text-zinc-600">{gen.desc}</p>
                </div>
                {gen.disabled && (
                  <span className="ml-auto text-[9px] text-zinc-600 font-medium uppercase">Soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
