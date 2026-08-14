"use client";

import { useState, useEffect } from "react";
import { X, Headphones, Play, Pause, RotateCcw, Volume2 } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";

interface PodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PodcastModal({ isOpen, onClose }: PodcastModalProps) {
  const { papers, activeQuery } = useResearchStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);

  const podcastScript = [
    {
      speaker: "Host (Dr. Maya Chen)",
      role: "Lead Investigator",
      text: `Welcome to the Nexus3D Academic Briefing. Today, we're dissecting the research landscape surrounding: "${activeQuery || "recent scholarly developments"}". We've synthesized evidence from ${papers.length} key papers across OpenAlex, arXiv, and Semantic Scholar.`,
    },
    {
      speaker: "Co-Host (Alex Rivera)",
      role: "Methodology Specialist",
      text: `That's right, Maya. What stands out immediately in the literature is how the primary methodologies have evolved. Early approaches prioritized baseline heuristic models, but the latest publications show a definitive shift toward unified transformer architectures and hybrid evaluation frameworks.`,
    },
    {
      speaker: "Host (Dr. Maya Chen)",
      role: "Lead Investigator",
      text: `Looking at the key empirical findings, researchers report significant gains in precision and inference throughput. However, a major recurring theme is the persistence of research gaps—particularly regarding out-of-distribution generalization and edge deployment scalability.`,
    },
    {
      speaker: "Co-Host (Alex Rivera)",
      role: "Methodology Specialist",
      text: `Exactly. For researchers looking ahead, the highest-leverage areas will be developing lightweight latency-efficient architectures and standardizing open benchmark datasets. That wraps up today's 2-minute synthesis.`,
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2.5 sm:p-4 backdrop-blur-md">
      <div className="flex h-[88vh] sm:h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-700/80 bg-zinc-950 p-4 sm:p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 sm:pb-4 shrink-0">
          <div className="flex items-center gap-2 text-cyan-400 min-w-0">
            <Headphones className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-zinc-100 truncate">Audio Podcast Generator</h2>
              <p className="text-[10px] sm:text-xs text-zinc-400 truncate">2-Min audio briefing</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95 shrink-0"
          >
            <X className="h-5 w-5 shrink-0" />
          </button>
        </div>

        {/* Audio Player Controls */}
        <div className="my-3 sm:my-4 flex items-center justify-between gap-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 sm:p-4 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={toggleSpeech}
              className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cyan-500 text-zinc-950 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:bg-cyan-400 hover:scale-105 active:scale-95 shrink-0"
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 shrink-0" />}
            </button>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-zinc-100 truncate">
                {isPlaying ? "Playing Briefing..." : "Ready to Listen"}
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                <Volume2 className="h-3 w-3 text-cyan-400 shrink-0" />
                <span>AI Narrator ({speechRate}x)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleStop}
              className="rounded-lg border border-zinc-700 bg-zinc-900 p-1.5 sm:p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95"
              title="Reset Audio"
            >
              <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            </button>
            <select
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 focus:outline-none"
            >
              <option value="0.85">0.85x</option>
              <option value="1">1.0x</option>
              <option value="1.15">1.15x</option>
              <option value="1.3">1.3x</option>
            </select>
          </div>
        </div>

        {/* Script Dialogue Content */}
        <div className="flex-1 space-y-2.5 sm:space-y-3 overflow-y-auto pr-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Dialogue Script
          </p>
          {podcastScript.map((line, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 text-xs leading-relaxed ${
                idx % 2 === 0
                  ? "border-cyan-500/20 bg-zinc-900/60 text-zinc-200"
                  : "border-purple-500/20 bg-zinc-900/40 text-zinc-300"
              }`}
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span className={`font-semibold text-xs ${idx % 2 === 0 ? "text-cyan-400" : "text-purple-400"}`}>
                  {line.speaker}
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400">
                  {line.role}
                </span>
              </div>
              <p>{line.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
