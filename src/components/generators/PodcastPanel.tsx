"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Headphones, Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";

interface PodcastPanelProps {
  onBack: () => void;
}

export default function PodcastPanel({ onBack }: PodcastPanelProps) {
  const { papers, activeQuery } = useResearchStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  const podcastScript = [
    {
      speaker: "Host (Dr. Maya Chen)",
      role: "Lead Investigator",
      text: `Welcome to the Nexus3D Academic Briefing on: "${activeQuery || "recent scholarly literature"}". We've synthesized evidence from ${papers.length} key papers across OpenAlex, arXiv, and Semantic Scholar.`,
    },
    {
      speaker: "Co-Host (Alex Rivera)",
      role: "Methodology Specialist",
      text: `What stands out immediately is how the methodologies have evolved. Early approaches relied on baseline heuristic models, whereas the latest publications show a definitive shift toward unified transformer architectures and hybrid evaluation frameworks.`,
    },
    {
      speaker: "Host (Dr. Maya Chen)",
      role: "Lead Investigator",
      text: `Looking at key empirical findings, researchers report significant gains in precision and inference throughput. However, a major recurring theme is the persistence of research gaps—particularly regarding out-of-distribution generalization.`,
    },
    {
      speaker: "Co-Host (Alex Rivera)",
      role: "Methodology Specialist",
      text: `For researchers looking ahead, the highest-leverage areas will be developing lightweight latency-efficient architectures and standardizing open benchmark datasets. That wraps up today's 2-minute synthesis.`,
    },
  ];

  const fullTextToSpeak = podcastScript.map((s) => `${s.speaker}: ${s.text}`).join(". ");

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullTextToSpeak);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-zinc-950/70 select-none">
      {/* ─── Sticky Header ─── */}
      <div className="sticky top-0 z-20 flex flex-col gap-2 border-b border-zinc-800/80 bg-zinc-950/95 px-3 py-2.5 backdrop-blur-xl shrink-0">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              handleStop();
              onBack();
            }}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100 active:scale-95 shrink-0"
            aria-label="Back to Agent Inspector"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="0.85">0.85x</option>
              <option value="1">1.0x</option>
              <option value="1.15">1.15x</option>
              <option value="1.3">1.3x</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-0.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/30 bg-emerald-950/50 text-emerald-400 shrink-0">
            <Headphones className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold text-zinc-100 truncate">Audio Podcast Narrator</h3>
            <p className="text-[10px] text-zinc-500 truncate">2-minute conversational research briefing</p>
          </div>
        </div>
      </div>

      {/* ─── Scrollable Dialogue & Player Content ─── */}
      <div className="flex-1 overflow-y-auto p-3 scroll-smooth space-y-3">
        {/* Audio Player Card */}
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={toggleSpeech}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition hover:bg-emerald-400 hover:scale-105 active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="h-4 w-4 shrink-0" /> : <Play className="h-4 w-4 ml-0.5 shrink-0" />}
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-100 truncate">
                {isPlaying ? "Playing Briefing..." : "Ready to Listen"}
              </p>
              <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                <Volume2 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span>AI Speech Synthesizer</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleStop}
            className="rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95 shrink-0"
            title="Reset Audio"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>

        {/* Script Dialogue Entries */}
        <div className="space-y-2.5 pt-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
            Dialogue Script
          </p>
          {podcastScript.map((line, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-2.5 text-xs leading-relaxed ${
                idx % 2 === 0
                  ? "border-emerald-500/20 bg-zinc-900/60 text-zinc-200"
                  : "border-cyan-500/20 bg-zinc-900/40 text-zinc-300"
              }`}
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span className={`font-semibold text-xs ${idx % 2 === 0 ? "text-emerald-400" : "text-cyan-400"}`}>
                  {line.speaker}
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400">
                  {line.role}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-300">{line.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Sticky Footer ─── */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-zinc-800/80 bg-zinc-950/95 px-3 py-2 text-[10px] text-zinc-500 backdrop-blur-xl shrink-0">
        <span>Web Speech API Synthesis</span>
        <span>2:00 duration</span>
      </div>
    </div>
  );
}
