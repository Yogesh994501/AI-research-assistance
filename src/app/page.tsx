'use client';

import LeftPanel from '@/components/workspace/LeftPanel';
import CenterPanel from '@/components/workspace/CenterPanel';
import RightPanel from '@/components/workspace/RightPanel';
import HistoryPanel from '@/components/hud/HistoryPanel';
import SettingsPanel from '@/components/hud/SettingsPanel';
import DetailDrawer from '@/components/hud/DetailDrawer';

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-950 flex flex-col font-sans select-none antialiased">
      {/* 3-Panel Workspace Layout */}
      <div className="flex-1 flex w-full h-full overflow-hidden relative">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />

        {/* Modal Overlays (History, Settings, Detail Drawer) */}
        <HistoryPanel />
        <SettingsPanel />
        <DetailDrawer />
      </div>
    </main>
  );
}
