'use client';

import { History, Trash2 } from 'lucide-react';
import { useResearchStore } from '@/store/researchStore';

export default function HistoryPanel() {
  const isOpen = useResearchStore((s) => s.historyPanelOpen);
  const toggleHistory = useResearchStore((s) => s.toggleHistoryPanel);
  const sessions = useResearchStore((s) => s.sessions);
  const currentSessionId = useResearchStore((s) => s.currentSessionId);
  const clearGraph = useResearchStore((s) => s.clearGraph);

  if (!isOpen) return null;

  return (
    <div className="absolute top-24 bottom-6 left-6 w-80 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-left-8 duration-300 z-10">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-gray-100 font-semibold">
          <History className="w-5 h-5 text-violet-400" />
          Research History
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-2">
        {sessions.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-10">
            No research history yet.
          </div>
        ) : (
          sessions.map((session) => (
            <button
              key={session.id}
              className={`w-full text-left p-3 rounded-xl transition-colors border ${
                currentSessionId === session.id
                  ? 'bg-violet-500/20 border-violet-500/30'
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              <div className="text-sm font-medium text-gray-200 truncate">{session.query}</div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{new Date(session.timestamp).toLocaleDateString()}</span>
                <span>{session.nodeCount} nodes</span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-white/5">
        <button 
          onClick={clearGraph}
          className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
