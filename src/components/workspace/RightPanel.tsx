'use client';

import { Activity, CheckCircle2, Circle, Clock, Presentation, FileCode, Radio, ArrowUpRight } from 'lucide-react';
import { useResearchStore } from '@/store/researchStore';

export default function RightPanel() {
  const agentState = useResearchStore((s) => s.agentState);
  const isResearching = useResearchStore((s) => s.isResearching);
  const setActivePreview = useResearchStore((s) => s.setActivePreview);

  const getTraceSteps = () => {
    switch (agentState) {
      case 'searching':
        return [
          { label: 'OpenAlex & arXiv API Fetch', status: 'active' },
          { label: 'BM25 + Vector Hybrid RRF', status: 'pending' },
          { label: 'Academic Critic Review', status: 'pending' },
          { label: 'Structured Report Synthesis', status: 'pending' },
        ];
      case 'synthesizing':
        return [
          { label: 'OpenAlex & arXiv API Fetch', status: 'completed' },
          { label: 'BM25 + Vector Hybrid RRF', status: 'completed' },
          { label: 'Academic Critic Review', status: 'active' },
          { label: 'Structured Report Synthesis', status: 'active' },
        ];
      case 'complete':
        return [
          { label: 'OpenAlex & arXiv API Fetch', status: 'completed' },
          { label: 'BM25 + Vector Hybrid RRF', status: 'completed' },
          { label: 'Academic Critic Review', status: 'completed' },
          { label: 'Structured Report Synthesis', status: 'completed' },
        ];
      default:
        return [
          { label: 'OpenAlex & arXiv API Fetch', status: 'idle' },
          { label: 'BM25 + Vector Hybrid RRF', status: 'idle' },
          { label: 'Academic Critic Review', status: 'idle' },
          { label: 'Structured Report Synthesis', status: 'idle' },
        ];
    }
  };

  const steps = getTraceSteps();

  return (
    <aside className="w-80 h-full bg-slate-900/80 backdrop-blur-md border-l border-slate-800 flex flex-col shrink-0 select-none z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold tracking-wider text-slate-200 uppercase">Agent Workflow State</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {isResearching ? 'Running' : 'Ready'}
        </div>
      </div>

      {/* Live Agent State Trace Card */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">LangGraph Execution Pipeline</h4>
        <div className="space-y-2.5 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs">
              {step.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : step.status === 'active' ? (
                <Clock className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600 shrink-0" />
              )}
              <span className={step.status === 'completed' ? 'text-slate-300' : step.status === 'active' ? 'text-cyan-300 font-medium' : 'text-slate-500'}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions / Studio Generators */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
        <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Studio Generators</h4>

        <div className="space-y-2.5">
          {/* Executive Slide Deck Button */}
          <button
            onClick={() => setActivePreview('slides')}
            className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Presentation className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">Executive Slide Deck</div>
                <div className="text-[10px] text-slate-500">Auto-generate 5-slide presentation</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
          </button>

          {/* BibTeX Citation Exporter Button */}
          <button
            onClick={() => setActivePreview('bibtex')}
            className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-violet-300">Export BibTeX</div>
                <div className="text-[10px] text-slate-500">Full formatted .bib citation library</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />
          </button>

          {/* Audio Podcast Player Button */}
          <button
            onClick={() => setActivePreview('podcast')}
            className="w-full p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left group flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">Audio Podcast</div>
                <div className="text-[10px] text-slate-500">Listen to 2-min audio narration</div>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
}
