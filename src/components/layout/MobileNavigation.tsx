"use client";

import { BookOpen, Sparkles, Bot } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import type { MobilePanel } from "@/types";
import { cn } from "@/lib/utils";

const TABS: { id: MobilePanel; icon: typeof BookOpen; label: string }[] = [
  { id: "sources", icon: BookOpen, label: "Sources" },
  { id: "studio", icon: Sparkles, label: "Studio" },
  { id: "agent", icon: Bot, label: "Agent" },
];

export default function MobileNavigation() {
  const { activeMobilePanel, setActiveMobilePanel } = useResearchStore();

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMobilePanel(tab.id)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-4 py-2 rounded-lg transition-all",
              activeMobilePanel === tab.id
                ? "text-cyan-400"
                : "text-zinc-500 hover:text-zinc-300"
            )}
            aria-label={`Switch to ${tab.label} panel`}
            aria-current={activeMobilePanel === tab.id ? "page" : undefined}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
            {activeMobilePanel === tab.id && (
              <div className="h-0.5 w-4 rounded-full bg-cyan-400 mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
