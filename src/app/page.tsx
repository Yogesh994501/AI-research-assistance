'use client';

import dynamic from 'next/dynamic';
import { History, Settings, Layers } from 'lucide-react';
import SearchPanel from '@/components/hud/SearchPanel';
import DetailDrawer from '@/components/hud/DetailDrawer';
import HistoryPanel from '@/components/hud/HistoryPanel';
import SettingsPanel from '@/components/hud/SettingsPanel';
import { useResearchStore } from '@/store/researchStore';

// Dynamically import 3D canvas (SSR disabled for WebGL/Three.js)
const ResearchCanvas = dynamic(() => import('@/components/three/ResearchCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030712] text-cyan-500 font-medium">
      Initializing 3D Spatial Canvas...
    </div>
  ),
});

export default function Home() {
  const toggleHistory = useResearchStore((s) => s.toggleHistoryPanel);
  const toggleSettings = useResearchStore((s) => s.toggleSettingsPanel);
  const historyOpen = useResearchStore((s) => s.historyPanelOpen);
  const settingsOpen = useResearchStore((s) => s.settingsPanelOpen);
  const nodes = useResearchStore((s) => s.nodes);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030712]">
      {/* 3D Canvas Background */}
      <ResearchCanvas />

      {/* Top Header & Branding */}
      <header className="absolute top-6 left-6 z-20 flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold text-gray-100 tracking-wider text-sm">NEXUS<span className="text-cyan-400">3D</span></span>
          <span className="text-[10px] uppercase tracking-widest text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 font-mono">AI Spatial Studio</span>
        </div>
      </header>

      {/* HUD Top-Right Action Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={toggleHistory}
          className={`p-3 rounded-2xl backdrop-blur-xl border transition-all shadow-xl ${
            historyOpen
              ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
              : 'bg-[#0a0a0a]/80 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
          }`}
          title="Toggle History"
        >
          <History className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSettings}
          className={`p-3 rounded-2xl backdrop-blur-xl border transition-all shadow-xl ${
            settingsOpen
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-[#0a0a0a]/80 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
          }`}
          title="Toggle Preferences"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Node Counter HUD Bottom Left */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
        <div className="flex items-center gap-2 px-3.5 py-2 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-xl text-xs text-gray-400 font-mono">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Nodes: <strong className="text-gray-200">{nodes.length}</strong></span>
        </div>
      </div>

      {/* Overlaid Glassmorphism Panels */}
      <SearchPanel />
      <DetailDrawer />
      <HistoryPanel />
      <SettingsPanel />
    </main>
  );
}
