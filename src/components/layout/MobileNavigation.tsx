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
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {TABS.map((tab) => {
          const isActive = activeMobilePanel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMobilePanel(tab.id)}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all duration-200",
                isActive
                  ? "text-cyan-400 font-semibold"
                  : "text-zinc-500 hover:text-zinc-300"
              )}
              aria-label={`Switch to ${tab.label} panel`}
              aria-current={isActive ? "page" : undefined}
            >
              <tab.icon className={cn("h-5 w-5 shrink-0 transition-transform", isActive && "scale-110")} />
              <span className="text-[11px] leading-none">{tab.label}</span>
              {isActive ? (
                <div className="h-1 w-5 rounded-full bg-cyan-400 mt-0.5 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              ) : (
                <div className="h-1 w-5 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
