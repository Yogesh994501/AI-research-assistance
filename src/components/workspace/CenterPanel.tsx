'use client';

import { useState } from 'react';
import { Sparkles, Download, RefreshCw, FileText, ChevronRight, Check, BookOpen, Layers } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useResearchStore } from '@/store/researchStore';
import PdfViewerDrawer from './PdfViewerDrawer';

export default function CenterPanel() {
  const nodes = useResearchStore((s) => s.nodes);
  const queryNode = nodes.find((n) => n.type === 'query');
  const isResearching = useResearchStore((s) => s.isResearching);
  const setResearching = useResearchStore((s) => s.setResearching);
  const setAgentState = useResearchStore((s) => s.setAgentState);
  const addResearchResult = useResearchStore((s) => s.addResearchResult);
  const researchMode = useResearchStore((s) => s.researchMode);

  const handleReSynthesize = async () => {
    if (!queryNode || isResearching) return;
    setResearching(true);
    setAgentState('searching');
    try {
      setTimeout(() => setAgentState('synthesizing'), 1200);
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryNode.summary ? queryNode.label : 'Quantum Computing', mode: researchMode }),
      });
      const data = await res.json();
      addResearchResult(queryNode.label, data);
    } catch (err) {
      console.error('Re-synthesis failed', err);
      setAgentState('idle');
    } finally {
      setResearching(false);
    }
  };

  const handleExportMarkdown = () => {
    const text = queryNode?.summary || '# Grounded Synthesis Report\n\nNo report generated yet.';
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grounded_synthesis_report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex-1 h-full bg-slate-950 flex flex-col min-w-0 overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="h-16 px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Workspace</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium truncate max-w-xs">{queryNode?.label || 'AI Research Studio'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cyan-400 font-semibold">Grounded Synthesis Report</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportMarkdown}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Markdown
          </button>

          <button
            onClick={handleReSynthesize}
            disabled={isResearching}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Re-Synthesize Report
          </button>
        </div>
      </header>

      {/* Main Document Canvas */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6 max-w-4xl mx-auto w-full">
        {/* Key Insight Callout Box */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border-l-4 border-l-cyan-500 border-y border-r border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" /> Key Methodological Insight
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Multi-engine scholarly search across <strong>OpenAlex (250M+ papers)</strong>, <strong>Semantic Scholar</strong>, and <strong>arXiv</strong> identified key paper clusters. All findings are strictly grounded and mapped with inline citations.
          </p>
        </div>

        {/* Formatted Markdown Synthesis Report */}
        {queryNode?.summary ? (
          <article className="prose prose-invert prose-cyan max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="text-sm text-slate-300 leading-relaxed my-4">{children}</p>,
                h1: ({ children }) => <h1 className="text-xl font-bold text-slate-100 border-b border-slate-800 pb-3 mt-6 mb-4">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-semibold text-cyan-300 mt-6 mb-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-semibold text-slate-200 mt-5 mb-2">{children}</h3>,
                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto rounded-xl border border-slate-800">
                    <table className="w-full text-xs text-left text-slate-300">{children}</table>
                  </div>
                ),
                thead: ({ children }) => <thead className="bg-slate-900 text-cyan-300 font-semibold border-b border-slate-800">{children}</thead>,
                th: ({ children }) => <th className="p-3">{children}</th>,
                td: ({ children }) => <td className="p-3 border-t border-slate-800/60">{children}</td>,
              }}
            >
              {queryNode.summary}
            </ReactMarkdown>
          </article>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">No Grounded Synthesis Generated</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Type a topic in the Left Panel search bar to query OpenAlex & arXiv and generate an exhaustive 4-part scientific synthesis.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Collapsible PDF Viewer Drawer */}
      <PdfViewerDrawer />
    </main>
  );
}
