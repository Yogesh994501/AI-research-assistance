"use client";

import { FileSearch, Inbox } from "lucide-react";
import type { Paper } from "@/types";
import { useResearchStore } from "@/store/researchStore";
import PaperCard from "./PaperCard";

interface PaperListProps {
  papers: Paper[];
}

export default function PaperList({ papers }: PaperListProps) {
  const { selectedPaper, setSelectedPaper, isLoading } = useResearchStore();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl bg-white/[0.04] border border-white/[0.08] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 w-12 rounded bg-white/[0.10]" />
              <div className="h-3 w-16 rounded bg-white/[0.08]" />
            </div>
            <div className="h-3.5 w-full rounded bg-white/[0.12] mb-1.5" />
            <div className="h-3.5 w-3/4 rounded bg-white/[0.08] mb-3" />
            <div className="flex gap-3">
              <div className="h-2.5 w-12 rounded bg-white/[0.06]" />
              <div className="h-2.5 w-16 rounded bg-white/[0.06]" />
              <div className="h-2.5 w-10 rounded bg-white/[0.06]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Inbox className="h-10 w-10 text-[#64748B] mb-3" />
        <p className="text-sm font-semibold text-[#CBD5E1]">No papers loaded yet</p>
        <p className="text-xs text-[#94A3B8] mt-1 max-w-xs leading-relaxed">
          Search a research topic above to populate peer-reviewed papers
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 p-3 overflow-y-auto">
      <div className="flex items-center gap-2 px-1 pb-1">
        <FileSearch className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-xs font-semibold text-[#94A3B8]">
          {papers.length} paper{papers.length !== 1 ? "s" : ""} retrieved & ranked
        </span>
      </div>
      {papers.map((paper, index) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          index={index}
          isSelected={selectedPaper?.id === paper.id}
          onSelect={setSelectedPaper}
        />
      ))}
    </div>
  );
}
