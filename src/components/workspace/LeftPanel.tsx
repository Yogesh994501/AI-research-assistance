'use client';

import { useState, useMemo } from 'react';
import { Search, BookOpen, Layers, CheckSquare, Square, Zap, ChevronRight } from 'lucide-react';
import { useResearchStore } from '@/store/researchStore';
import dynamic from 'next/dynamic';

const ResearchCanvas = dynamic(() => import('@/components/three/ResearchCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950 text-cyan-400 text-xs font-mono">
      Loading 3D Canvas...
    </div>
  ),
});

export default function LeftPanel() {
  const [activeTab, setActiveTab] = useState<'list' | 'graph'>('list');
  const [queryInput, setQueryInput] = useState('');

  const nodes = useResearchStore((s) => s.nodes);
  const sources = useMemo(
    () => nodes.filter((n) => n.type === 'source' || n.type === 'document'),
    [nodes]
  );

  const isResearching = useResearchStore((s) => s.isResearching);
  const setResearching = useResearchStore((s) => s.setResearching);
  const setAgentState = useResearchStore((s) => s.setAgentState);
  const addResearchResult = useResearchStore((s) => s.addResearchResult);
  const researchMode = useResearchStore((s) => s.researchMode);
  const setResearchMode = useResearchStore((s) => s.setResearchMode);
  const selectNode = useResearchStore((s) => s.selectNode);
  const activeNodeId = useResearchStore((s) => s.activeNodeId);

  const [selectedSources, setSelectedSources] = useState<Record<string, boolean>>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim() || isResearching) return;

    setResearching(true);
    setAgentState('searching');
    try {
      setTimeout(() => setAgentState('synthesizing'), 1200);
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryInput, mode: researchMode }),
      });
      const data = await res.json();
      addResearchResult(queryInput, data);
      setQueryInput('');
    } catch (err) {
      console.error('Search failed', err);
      setAgentState('idle');
    } finally {
      setResearching(false);
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSources((prev) => ({ ...prev, [id]: !(prev[id] ?? true) }));
  };

  return (
    <aside className="w-80 h-full bg-slate-900/80 backdrop-blur-md border-r border-slate-800 flex flex-col shrink-0 select-none z-20">
      {/* Top Search Bar & API Badge */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">Literature Index</span>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
            OpenAlex + S2
          </span>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search OpenAlex & arXiv..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            disabled={isResearching}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <button
            type="button"
            onClick={() => setResearchMode(researchMode === 'quick' ? 'deep' : 'quick')}
            className="absolute right-2 top-2 text-xs text-slate-400 hover:text-cyan-400"
            title="Toggle Quick/Deep Mode"
          >
            <Zap className={`w-3.5 h-3.5 ${researchMode === 'deep' ? 'text-violet-400' : 'text-slate-500'}`} />
          </button>
        </form>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'list' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Paper List ({sources.length})
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'graph' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3D Graph
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'list' ? (
          <div className="h-full overflow-y-auto p-3 custom-scrollbar space-y-2.5">
            {sources.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-500 text-xs">
                No papers loaded yet. Search OpenAlex or arXiv above to populate candidate literature.
              </div>
            ) : (
              sources.map((paper) => {
                const isActive = activeNodeId === paper.id;
                const isChecked = selectedSources[paper.id] ?? true;
                const matchScore = Math.round((paper.relevanceScore || 0.95) * 100);

                return (
                  <div
                    key={paper.id}
                    onClick={() => selectNode(paper.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${
                      isActive
                        ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSource(paper.id);
                        }}
                        className="text-slate-500 hover:text-cyan-400 mt-0.5 transition-colors"
                      >
                        {isChecked ? <CheckSquare className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {paper.label}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                          <span className="font-mono text-cyan-400/90">{matchScore}% Match</span>
                          {paper.citationCount !== undefined && (
                            <span className="text-slate-500">· {paper.citationCount} Citations</span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-0.5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="w-full h-full relative">
            <ResearchCanvas />
          </div>
        )}
      </div>
    </aside>
  );
}
