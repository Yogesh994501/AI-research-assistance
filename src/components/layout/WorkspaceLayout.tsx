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
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#071014] text-[#F8FAFC]">
      {/* 3D Background Canvas Layer */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 transition-opacity duration-700",
          is3DExpanded ? "pointer-events-auto opacity-100" : "opacity-35"
        )}
      >
        <ResearchCanvas />
      </div>

      {/* Top Header */}
      <Header />

      {/* Main Workspace Area (Desktop 3-Panel Grid) */}
      <main className="relative z-10 hidden flex-1 gap-3.5 overflow-hidden p-3.5 lg:grid lg:grid-cols-12">
        {/* Left Panel: Literature Index (3 cols) */}
        <div className="col-span-3 h-full overflow-hidden">
          {leftPanelView === "graph" ? (
            <div className="glass-panel relative h-full w-full overflow-hidden">
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

        {/* Right Panel: Agent Inspector / Slide Deck (3 cols) */}
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
