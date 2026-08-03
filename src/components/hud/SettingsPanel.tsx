'use client';

import { Settings, Sliders, Database } from 'lucide-react';
import { useResearchStore } from '@/store/researchStore';

export default function SettingsPanel() {
  const isOpen = useResearchStore((s) => s.settingsPanelOpen);
  const researchMode = useResearchStore((s) => s.researchMode);
  const setResearchMode = useResearchStore((s) => s.setResearchMode);

  if (!isOpen) return null;

  return (
    <div className="absolute top-24 right-6 w-80 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
      <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5 text-gray-100 font-semibold">
        <Settings className="w-5 h-5 text-cyan-400" />
        Preferences
      </div>

      <div className="p-5 space-y-6">
        {/* Research Mode */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Sliders className="w-4 h-4" />
            Research Depth
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setResearchMode('quick')}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                researchMode === 'quick' 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' 
                  : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
              }`}
            >
              Quick Answer
            </button>
            <button
              onClick={() => setResearchMode('deep')}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                researchMode === 'deep' 
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' 
                  : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10'
              }`}
            >
              Deep Research
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {researchMode === 'quick' ? 'Searches fewer sources, provides concise summaries.' : 'Analyzes more sources in depth with comprehensive synthesis.'}
          </p>
        </div>

        {/* Local Vector DB Status */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <label className="flex items-center justify-between text-sm font-medium text-gray-300">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Vector Store
            </div>
            <span className="text-emerald-400 text-xs bg-emerald-400/10 px-2 py-0.5 rounded">Active</span>
          </label>
          <p className="text-xs text-gray-500">In-memory semantic search engine is running for uploaded documents.</p>
        </div>
      </div>
    </div>
  );
}
