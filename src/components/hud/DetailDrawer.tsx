'use client';

import { X, ExternalLink, Download, BookOpen, Layers, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useResearchStore } from '@/store/researchStore';

export default function DetailDrawer() {
  const isOpen = useResearchStore((s) => s.detailDrawerOpen);
  const activeNodeId = useResearchStore((s) => s.activeNodeId);
  const nodes = useResearchStore((s) => s.nodes);
  const toggleDetailDrawer = useResearchStore((s) => s.toggleDetailDrawer);
  const selectNode = useResearchStore((s) => s.selectNode);

  const node = nodes.find((n) => n.id === activeNodeId);

  if (!isOpen || !node) return null;

  const handleExport = () => {
    const content = `# ${node.label}\n\n${node.summary || ''}\n\n${node.url ? `Source: ${node.url}` : ''}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${node.label.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute top-24 bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-right-8 duration-300 z-30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3 truncate pr-2">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: node.color }} />
          <h2 className="text-base font-semibold text-gray-100 truncate">{node.label}</h2>
        </div>
        <button 
          onClick={() => { toggleDetailDrawer(); selectNode(null); }}
          className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {node.citationCount !== undefined && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 rounded-md font-mono">
              <Award className="w-3.5 h-3.5" />
              <span>{node.citationCount} Citations</span>
            </div>
          )}

          {node.url && (
            <a 
              href={node.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 rounded-md transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{new URL(node.url).hostname}</span>
            </a>
          )}
        </div>

        {/* Node Summary */}
        {node.summary && (
          <div className="prose prose-invert prose-sm prose-cyan max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {node.summary}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
        <button 
          onClick={handleExport}
          className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium border border-white/5"
        >
          <Download className="w-4 h-4" />
          Export Note
        </button>
      </div>
    </div>
  );
}
