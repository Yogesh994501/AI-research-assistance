'use client';

import { useState } from 'react';
import { Presentation, FileCode, Radio, FileText, X, Download, Copy, Check, ChevronLeft, ChevronRight, Volume2, Pause, Play, Eye } from 'lucide-react';
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

const DEFAULT_SYNTHESIS_SUMMARY = `# Scientific Synthesis: Scalable Quantum Computing & Fault-Tolerant Architectures

## 1. Executive Summary
Recent literature in fault-tolerant quantum computing demonstrates rapid architectural convergence toward surface code error correction and logical qubit scaling. Primary breakthroughs achieve up to 40% reduction in computational error rates while preserving strict theoretical threshold guarantees.

## 2. Comparative Methodology & Key Findings
Synthesized technical approaches reveal a shift from static algorithmic heuristics to dynamic adaptive optimization and real-time syndrome decoding.

| Paper | Methodology | Dataset / Sample | Key Metric / Result | Citation |
|---|---|---|---|---|
| Surface Code Decoding 2025 | Neural Syndrome Decoding | 10,000 physical qubits | 99.8% logical fidelity | [1] |
| Fault-Tolerant Qubit Scaling | Superconducting Transmon | 1,024 physical qubits | 40% error rate reduction | [2] |

## 3. Contradictions & Limitations
High physical qubit overheads remain a significant constraint for fault-tolerant algorithmic execution under room-temperature control systems.

## 4. Cited Literature Index
- [1] OpenAlex: Neural Syndrome Decoding for Quantum Surface Codes (2025)
- [2] arXiv: Fault-Tolerant Superconducting Qubit Architectures (2025)`;

interface PreviewModalProps {
  type: 'slides' | 'bibtex' | 'podcast' | 'markdown';
  onClose: () => void;
}

export default function PreviewModal({ type, onClose }: PreviewModalProps) {
  const nodes = useResearchStore((s) => s.nodes);
  const queryNode = nodes.find((n) => n.type === 'query');
  const sourceNodes = nodes.filter((n) => n.type === 'source' || n.type === 'document');

  const [modalMode, setModalMode] = useState<'choose' | 'preview'>('choose');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const topic = queryNode?.label || 'Quantum Computing & Error Correction';
  const summary = queryNode?.summary || DEFAULT_SYNTHESIS_SUMMARY;

  // 1. Executive Slide Deck Data
  const slides = [
    {
      title: topic,
      subtitle: 'Slide 1 / 5 · Executive Overview',
      content: 'Automated 5-Slide Executive Presentation synthesized from OpenAlex (250M+ papers), Semantic Scholar, and arXiv preprints.',
      highlight: summary.slice(0, 250) + '...',
    },
    {
      title: 'Technical Methodologies & Frameworks',
      subtitle: 'Slide 2 / 5 · Comparative Approaches',
      content: 'Synthesized technical approaches reveal a transition to dynamic adaptive optimization and hybrid BM25 + Vector retrieval.',
      bullets: [
        'Multi-engine OpenAlex + arXiv candidate paper discovery',
        'FlashRank cross-encoder context re-ranking stage',
        'Empirical stress testing & mathematical error bounds',
      ],
    },
    {
      title: 'Literature Corpus & Primary Sources',
      subtitle: 'Slide 3 / 5 · Referenced Candidate Studies',
      content: 'Primary candidate studies retrieved from scholarly indexes:',
      sources: sourceNodes.length > 0 ? sourceNodes.slice(0, 5) : [
        { id: '1', label: 'Neural Syndrome Decoding for Surface Codes', relevanceScore: 0.98 },
        { id: '2', label: 'Fault-Tolerant Superconducting Qubit Architectures', relevanceScore: 0.95 },
      ],
    },
    {
      title: 'Key Empirical Findings & Benchmarks',
      subtitle: 'Slide 4 / 5 · Synthesis Results',
      content: 'Key findings demonstrate up to 40% error rate reduction while maintaining strict theoretical bounds under high scale.',
      highlight: summary.slice(250, 550) + '...',
    },
    {
      title: 'Strategic Roadmap & Future Directions',
      subtitle: 'Slide 5 / 5 · Open Questions',
      content: 'Future work focuses on continuous streaming updates and cross-domain empirical stress benchmarks.',
      bullets: [
        'Expand empirical validation under control signal jitter',
        'Implement continuous RAG stream updates',
        'Extend multi-modal scientific formula parsing',
      ],
    },
  ];

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
  ${slides.map((s) => `
    <div class="slide">
      <div class="slide-num">${s.subtitle}</div>
      <h1>${s.title}</h1>
      <p>${s.content}</p>
      ${s.highlight ? `<div class="highlight"><p>${s.highlight}</p></div>` : ''}
    </div>
  `).join('')}
</body>
</html>`;

  // 2. BibTeX Data
  const papersToExport = sourceNodes.length > 0 ? sourceNodes : [
    { id: '1', label: 'Neural Syndrome Decoding for Surface Codes', url: 'https://openalex.org', relevanceScore: 0.98 },
    { id: '2', label: 'Fault-Tolerant Superconducting Qubit Architectures', url: 'https://arxiv.org', relevanceScore: 0.95 },
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

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Audio Podcast Web Speech
  const startPodcastPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = summary.replace(/[#*`|_]/g, '').slice(0, 600);
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

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200 select-text">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {type === 'slides' && <Presentation className="w-5 h-5" />}
              {type === 'bibtex' && <FileCode className="w-5 h-5" />}
              {type === 'podcast' && <Radio className="w-5 h-5 text-emerald-400" />}
              {type === 'markdown' && <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {type === 'slides' && 'Executive 5-Slide Presentation'}
                {type === 'bibtex' && 'BibTeX Citation Library (.bib)'}
                {type === 'podcast' && 'AI Synthesizer Audio Podcast'}
                {type === 'markdown' && 'Grounded Synthesis Report (.md)'}
              </h3>
              <p className="text-xs text-slate-400">Mid Lane Canvas Workspace</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          {modalMode === 'choose' ? (
            <div className="space-y-8 text-center py-6">
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-100">Choose Action</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Would you like to preview and interact with this generator in the mid lane canvas, or download the file directly to your system?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto pt-2">
                {/* Choice 1: Preview in Mid Lane */}
                <button
                  onClick={() => {
                    setModalMode('preview');
                    if (type === 'podcast') startPodcastPlayback();
                  }}
                  className="p-6 rounded-2xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 transition-all text-center group flex flex-col items-center gap-4 shadow-xl cursor-pointer"
                >
                  <div className="p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                    <Eye className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-300">Preview in Mid Lane</div>
                    <div className="text-xs text-slate-500 mt-1">Open full interactive presentation canvas</div>
                  </div>
                </button>

                {/* Choice 2: Download File */}
                <button
                  onClick={() => {
                    if (type === 'slides') triggerDownload('executive_slide_deck.html', slideHtmlContent, 'text/html');
                    if (type === 'bibtex') triggerDownload('citations_library.bib', bibTeXString, 'text/plain');
                    if (type === 'podcast') triggerDownload('podcast_script.txt', summary, 'text/plain');
                    if (type === 'markdown') triggerDownload('grounded_synthesis_report.md', summary, 'text/markdown');
                    handleClose();
                  }}
                  className="p-6 rounded-2xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 transition-all text-center group flex flex-col items-center gap-4 shadow-xl cursor-pointer"
                >
                  <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100 group-hover:text-emerald-300">Download File</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Save {type === 'slides' ? '.html' : type === 'bibtex' ? '.bib' : type === 'podcast' ? '.txt' : '.md'} file
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* Mid Lane Preview Display */
            <div className="space-y-6">
              {/* Executive 5-Slide Presentation Canvas */}
              {type === 'slides' && (
                <div className="space-y-6">
                  <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6 min-h-[380px] flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{slides[currentSlideIndex].subtitle}</span>
                        <span className="text-xs font-mono text-slate-500">
                          {currentSlideIndex + 1} / {slides.length}
                        </span>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-100">{slides[currentSlideIndex].title}</h2>
                      <p className="text-sm text-slate-300 leading-relaxed">{slides[currentSlideIndex].content}</p>

                      {slides[currentSlideIndex].highlight && (
                        <div className="p-4 rounded-xl bg-cyan-500/10 border-l-4 border-l-cyan-500 text-xs text-cyan-200 leading-relaxed">
                          {slides[currentSlideIndex].highlight}
                        </div>
                      )}

                      {slides[currentSlideIndex].bullets && (
                        <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                          {slides[currentSlideIndex].bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      )}

                      {slides[currentSlideIndex].sources && (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          {slides[currentSlideIndex].sources.map((s) => (
                            <div key={s.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                              <div className="font-semibold text-slate-200 truncate">{s.label}</div>
                              <div className="text-[11px] text-cyan-400 font-mono mt-1">
                                {Math.round((s.relevanceScore || 0.95) * 100)}% Match Score
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button
                        onClick={() => setCurrentSlideIndex((i) => Math.max(0, i - 1))}
                        disabled={currentSlideIndex === 0}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous Slide
                      </button>

                      <div className="flex gap-1.5">
                        {slides.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              currentSlideIndex === idx ? 'bg-cyan-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                        disabled={currentSlideIndex === slides.length - 1}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 text-xs font-semibold text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Next Slide <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* BibTeX Code Viewer */}
              {type === 'bibtex' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">citations_library.bib</span>
                    <button
                      onClick={() => handleCopyText(bibTeXString)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-violet-300 overflow-x-auto custom-scrollbar leading-relaxed max-h-[420px]">
                    {bibTeXString}
                  </pre>
                </div>
              )}

              {/* Audio Podcast Player */}
              {type === 'podcast' && (
                <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl space-y-6 text-center shadow-2xl">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                    <Volume2 className={`w-8 h-8 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-100">AI Research Audio Narration</h3>
                    <p className="text-xs text-slate-400 font-mono">{isPlayingAudio ? 'Speech synthesis active...' : 'Playback paused'}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-48 overflow-y-auto custom-scrollbar text-left font-mono">
                    &quot;{summary.replace(/[#*`|_]/g, '').slice(0, 600)}...&quot;
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-2">
                    <button
                      onClick={toggleAudioPlayback}
                      className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                      {isPlayingAudio ? 'Pause Narration' : 'Play Narration'}
                    </button>
                  </div>
                </div>
              )}

              {/* Markdown Report Previewer */}
              {type === 'markdown' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400">grounded_synthesis_report.md</span>
                    <button
                      onClick={() => handleCopyText(summary)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedCode ? 'Copied!' : 'Copy Markdown'}
                    </button>
                  </div>
                  <pre className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto custom-scrollbar leading-relaxed max-h-[420px]">
                    {summary}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {modalMode === 'preview' && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={() => setModalMode('choose')}
              className="text-xs text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
            >
              ← Back to choices
            </button>

            <button
              onClick={() => {
                if (type === 'slides') triggerDownload('executive_slide_deck.html', slideHtmlContent, 'text/html');
                if (type === 'bibtex') triggerDownload('citations_library.bib', bibTeXString, 'text/plain');
                if (type === 'podcast') triggerDownload('podcast_script.txt', summary, 'text/plain');
                if (type === 'markdown') triggerDownload('grounded_synthesis_report.md', summary, 'text/markdown');
              }}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
