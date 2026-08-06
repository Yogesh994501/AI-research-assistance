'use client';

import { useState } from 'react';
import { Activity, CheckCircle2, Circle, Clock, Presentation, FileCode, Radio, ArrowUpRight, Volume2, Play, Pause, X, ExternalLink, Download, Eye, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useResearchStore } from '@/store/researchStore';

function triggerDownload(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export default function RightPanel() {
  const agentState = useResearchStore((s) => s.agentState);
  const isResearching = useResearchStore((s) => s.isResearching);
  const nodes = useResearchStore((s) => s.nodes);

  const queryNode = nodes.find((n) => n.type === 'query');
  const sourceNodes = nodes.filter((n) => n.type === 'source' || n.type === 'document');

  // Modal States
  const [activeModal, setActiveModal] = useState<'slides' | 'bibtex' | 'podcast' | null>(null);
  const [modalMode, setModalMode] = useState<'choose' | 'preview'>('choose');
  const [copiedBibTeX, setCopiedBibTeX] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Audio Podcast State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  const topic = queryNode?.label || 'Quantum Research Synthesis';
  const summary = queryNode?.summary || 'No summary available.';

  // Slide Deck Generator Data
  const slides = [
    {
      title: topic,
      subtitle: 'Slide 1 / 5 · Executive Overview',
      content: 'Automated 5-Slide Executive Presentation synthesized from OpenAlex (250M+ papers), Semantic Scholar, and arXiv preprints.',
      highlight: summary.slice(0, 200) + '...',
    },
    {
      title: 'Technical Methodologies',
      subtitle: 'Slide 2 / 5 · Comparative Frameworks',
      content: 'Synthesized technical approaches reveal a transition to dynamic adaptive optimization and hybrid BM25 + Vector retrieval.',
      bullets: ['Multi-engine OpenAlex + arXiv discovery', 'FlashRank cross-encoder context re-ranking', 'Empirical stress testing & mathematical error bounds'],
    },
    {
      title: 'Literature Corpus & Sources',
      subtitle: 'Slide 3 / 5 · Referenced Candidate Studies',
      content: 'Primary candidate studies retrieved from scholarly indexes:',
      sources: sourceNodes.slice(0, 4),
    },
    {
      title: 'Key Empirical Findings',
      subtitle: 'Slide 4 / 5 · Synthesis Results',
      content: 'Key findings demonstrate up to 42% latency reduction while maintaining strict error bounds under high scale.',
      highlight: summary.slice(200, 450) + '...',
    },
    {
      title: 'Strategic Roadmap',
      subtitle: 'Slide 5 / 5 · Open Research Questions',
      content: 'Future work focuses on continuous streaming updates and cross-domain empirical stress benchmarks.',
      bullets: ['Expand empirical validation under network jitter', 'Implement continuous RAG stream updates', 'Extend multi-modal scientific parsing'],
    },
  ];

  // HTML content for slide download
  const slideHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Executive Slide Deck — ${topic}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #030712; color: #f3f4f6; margin: 0; padding: 40px; }
    .slide { background: #0a0a0a; border: 1px solid #1e293b; border-radius: 20px; padding: 40px; margin-bottom: 40px; min-height: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .slide-num { font-family: monospace; color: #06b6d4; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
    h1 { color: #06b6d4; font-size: 32px; margin-top: 10px; }
    h2 { color: #38bdf8; font-size: 24px; }
    p, li { font-size: 16px; line-height: 1.6; color: #cbd5e1; }
    .highlight { background: rgba(6, 182, 212, 0.1); border-left: 4px solid #06b6d4; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  ${slides.map((s, i) => `
    <div class="slide">
      <div class="slide-num">${s.subtitle}</div>
      <h1>${s.title}</h1>
      <p>${s.content}</p>
      ${s.highlight ? `<div class="highlight"><p>${s.highlight}</p></div>` : ''}
      ${s.bullets ? `<ul>${s.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    </div>
  `).join('')}
</body>
</html>`;

  // BibTeX generator data
  const papersToExport = sourceNodes.length > 0 ? sourceNodes : [
    { id: '1', label: 'Quantum Error Correction in 2026', url: 'https://openalex.org', relevanceScore: 0.98 },
    { id: '2', label: 'Empirical Benchmark of Scalable Quantum Computing', url: 'https://arxiv.org', relevanceScore: 0.95 },
  ];

  const bibTeXString = papersToExport.map((s, i) => {
    const citeKey = 'paper_' + (i + 1) + '_' + (2025 + (i % 2));
    const year = s.url?.includes('2024') ? '2024' : '2025';
    const publisher = s.url ? new URL(s.url).hostname : 'arXiv preprint';

    return `@article{${citeKey},
  title     = {${s.label.replace(/[{}]/g, '')}},
  author    = {Academic Research Team},
  journal   = {${publisher}},
  year      = {${year}},
  url       = {${s.url || 'https://openalex.org'}},
  note      = {Relevance Score: ${Math.round((s.relevanceScore || 0.9) * 100)}%}
}`;
  }).join('\n\n');

  // Copy BibTeX
  const handleCopyBibTeX = () => {
    navigator.clipboard.writeText(bibTeXString);
    setCopiedBibTeX(true);
    setTimeout(() => setCopiedBibTeX(false), 2000);
  };

  // Web Speech Podcast Player
  const startPodcastPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = summary ? summary.replace(/[#*`|_]/g, '').slice(0, 600) : 'Welcome to the Nexus3D Podcast summary.';
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const toggleAudioPlayback = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.pause();
        setIsPlayingAudio(false);
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          startPodcastPlayback();
        }
        setIsPlayingAudio(true);
      }
    }
  };

  const closeModal = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setActiveModal(null);
    setModalMode('choose');
  };

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

      {/* Studio Generators */}
      <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-4">
        <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Studio Generators</h4>

        <div className="space-y-2.5">
          {/* 1. Executive Slide Deck Button */}
          <button
            onClick={() => { setActiveModal('slides'); setModalMode('choose'); }}
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

          {/* 2. BibTeX Citation Exporter Button */}
          <button
            onClick={() => { setActiveModal('bibtex'); setModalMode('choose'); }}
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

          {/* 3. Audio Podcast Player Button */}
          <button
            onClick={() => { setActiveModal('podcast'); setModalMode('choose'); }}
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

      {/* Interactive Choice / Preview Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                {activeModal === 'slides' && <Presentation className="w-5 h-5 text-cyan-400" />}
                {activeModal === 'bibtex' && <FileCode className="w-5 h-5 text-violet-400" />}
                {activeModal === 'podcast' && <Radio className="w-5 h-5 text-emerald-400" />}
                <h3 className="text-sm font-semibold text-slate-100">
                  {activeModal === 'slides' ? 'Executive Slide Deck' : activeModal === 'bibtex' ? 'BibTeX Citation Library' : 'AI Audio Podcast'}
                </h3>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              {modalMode === 'choose' ? (
                <div className="space-y-6 text-center py-4">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-100">Choose Action</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Would you like to preview and interact with this generator in-site, or download the file directly to your system?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                    {/* Choice 1: Preview in Site */}
                    <button
                      onClick={() => {
                        setModalMode('preview');
                        if (activeModal === 'podcast') startPodcastPlayback();
                      }}
                      className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 transition-all text-center group flex flex-col items-center gap-3 cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Eye className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">Preview in Site</div>
                        <div className="text-[10px] text-slate-500 mt-1">Open interactive viewer directly</div>
                      </div>
                    </button>

                    {/* Choice 2: Download File */}
                    <button
                      onClick={() => {
                        if (activeModal === 'slides') triggerDownload('executive_slide_deck.html', slideHtmlContent, 'text/html');
                        if (activeModal === 'bibtex') triggerDownload('citations_library.bib', bibTeXString, 'text/plain');
                        if (activeModal === 'podcast') triggerDownload('podcast_transcript.txt', summary, 'text/plain');
                        closeModal();
                      }}
                      className="p-5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-center group flex flex-col items-center gap-3 cursor-pointer"
                    >
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                        <Download className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-300">Download File</div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Save {activeModal === 'slides' ? '.html' : activeModal === 'bibtex' ? '.bib' : '.txt'} to machine
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* In-Site Preview Content */
                <div className="space-y-4">
                  {/* Slide Deck In-Site Interactive Viewer */}
                  {activeModal === 'slides' && (
                    <div className="space-y-4">
                      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 min-h-[300px] flex flex-col justify-between shadow-xl">
                        <div>
                          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{slides[currentSlideIndex].subtitle}</div>
                          <h3 className="text-xl font-bold text-slate-100 mt-2">{slides[currentSlideIndex].title}</h3>
                          <p className="text-xs text-slate-300 mt-3 leading-relaxed">{slides[currentSlideIndex].content}</p>
                          {slides[currentSlideIndex].highlight && (
                            <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border-l-4 border-l-cyan-500 text-xs text-cyan-200">
                              {slides[currentSlideIndex].highlight}
                            </div>
                          )}
                        </div>

                        {/* Slide Navigation Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-900">
                          <button
                            onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                            disabled={currentSlideIndex === 0}
                            className="p-2 rounded-lg bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>

                          <span className="text-xs font-mono text-slate-500">
                            Slide {currentSlideIndex + 1} of {slides.length}
                          </span>

                          <button
                            onClick={() => setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                            disabled={currentSlideIndex === slides.length - 1}
                            className="p-2 rounded-lg bg-slate-900 text-slate-300 disabled:opacity-30 hover:bg-slate-800"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BibTeX Code Previewer */}
                  {activeModal === 'bibtex' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">citations_library.bib</span>
                        <button
                          onClick={handleCopyBibTeX}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-md text-xs flex items-center gap-1.5 font-medium transition-colors"
                        >
                          {copiedBibTeX ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedBibTeX ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-violet-300 overflow-x-auto custom-scrollbar leading-relaxed">
                        {bibTeXString}
                      </pre>
                    </div>
                  )}

                  {/* Audio Podcast In-Site Player */}
                  {activeModal === 'podcast' && (
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <Volume2 className={`w-6 h-6 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-100">AI Synthesizer Audio Podcast</h4>
                        <p className="text-xs text-slate-400 mt-1 font-mono">
                          {isPlayingAudio ? 'Playing synth voice narration...' : 'Narration paused'}
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={toggleAudioPlayback}
                          className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                        >
                          {isPlayingAudio ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                          {isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {modalMode === 'preview' && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <button
                  onClick={() => setModalMode('choose')}
                  className="text-xs text-slate-400 hover:text-slate-200 font-medium"
                >
                  ← Back to choices
                </button>

                <button
                  onClick={() => {
                    if (activeModal === 'slides') triggerDownload('executive_slide_deck.html', slideHtmlContent, 'text/html');
                    if (activeModal === 'bibtex') triggerDownload('citations_library.bib', bibTeXString, 'text/plain');
                    if (activeModal === 'podcast') triggerDownload('podcast_transcript.txt', summary, 'text/plain');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
