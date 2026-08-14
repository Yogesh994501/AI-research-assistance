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
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-zinc-800/40 border border-zinc-800/50 p-3">
            <div className="h-2.5 w-16 rounded bg-zinc-700/50 mb-2" />
            <div className="h-3.5 w-full rounded bg-zinc-700/40 mb-1.5" />
            <div className="h-3.5 w-3/4 rounded bg-zinc-700/30 mb-2" />
            <div className="flex gap-3">
              <div className="h-2 w-10 rounded bg-zinc-700/30" />
              <div className="h-2 w-12 rounded bg-zinc-700/30" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Inbox className="h-10 w-10 text-zinc-600 mb-3" />
        <p className="text-sm text-zinc-500">No papers loaded yet</p>
        <p className="text-xs text-zinc-600 mt-1">
          Search a research topic to populate results
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto">
      <div className="flex items-center gap-2 px-1 pb-1">
        <FileSearch className="h-3.5 w-3.5 text-zinc-500" />
        <span className="text-xs text-zinc-500">
          {papers.length} paper{papers.length !== 1 ? "s" : ""} found
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
