"use client";

import Header from "./Header";
import MobileNavigation from "./MobileNavigation";
import LeftPanel from "@/components/panels/LeftPanel";
import CenterPanel from "@/components/panels/CenterPanel";
import RightPanel from "@/components/panels/RightPanel";
import MobileSources from "@/components/mobile/MobileSources";
import MobileStudio from "@/components/mobile/MobileStudio";
import MobileAgent from "@/components/mobile/MobileAgent";
import ResearchCanvas from "@/components/three/ResearchCanvas";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";

export default function WorkspaceLayout() {
  const { activeMobilePanel, leftPanelView, is3DExpanded } = useResearchStore();

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-surface-solid text-zinc-100">
      {/* 3D Background Canvas Layer */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 transition-opacity duration-700",
          is3DExpanded ? "pointer-events-auto opacity-100" : "opacity-40"
        )}
      >
        <ResearchCanvas />
      </div>

      {/* Top Header */}
      <Header />

      {/* Main Workspace Area (Desktop 3-Panel) */}
      <main className="relative z-10 hidden flex-1 gap-3 overflow-hidden p-3 lg:grid lg:grid-cols-12">
        {/* Left Panel: Literature Index (3 cols) */}
        <div className="col-span-3 h-full overflow-hidden">
          {leftPanelView === "graph" ? (
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl">
              <div className="absolute inset-0">
                <ResearchCanvas />
              </div>
            </div>
          ) : (
            <LeftPanel />
          )}
        </div>

        {/* Center Panel: Synthesis Canvas (6 cols) */}
        <div className="col-span-6 h-full overflow-hidden">
          <CenterPanel />
        </div>

        {/* Right Panel: Agent Inspector (3 cols) */}
        <div className="col-span-3 h-full overflow-hidden">
          <RightPanel />
        </div>
      </main>

      {/* Main Workspace Area (Mobile Tabs) */}
      <main className="relative z-10 flex-1 overflow-hidden p-2.5 pb-20 lg:hidden">
        {activeMobilePanel === "sources" && <MobileSources />}
        {activeMobilePanel === "studio" && <MobileStudio />}
        {activeMobilePanel === "agent" && <MobileAgent />}
      </main>

      {/* Bottom Navigation for Mobile */}
      <MobileNavigation />
    </div>
  );
}
