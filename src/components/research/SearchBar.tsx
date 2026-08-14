"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const [input, setInput] = useState("");
  const { executeSearch, isLoading } = useResearchStore();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        executeSearch(input.trim());
      }
    },
    [input, isLoading, executeSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={cn(
          "relative flex items-center gap-2 rounded-xl",
          "glass transition-all duration-300",
          "focus-within:border-cyan-500/50 focus-within:glow-accent"
        )}
      >
        <div className="pl-4 text-zinc-500">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a research question…"
          disabled={isLoading}
          className={cn(
            "flex-1 bg-transparent py-3 text-sm text-zinc-100",
            "placeholder:text-zinc-500 focus:outline-none",
            "disabled:opacity-50"
          )}
          aria-label="Research query input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            "mr-2 flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-medium",
            "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
            "transition-all duration-200",
            "hover:bg-cyan-500/25 hover:border-cyan-500/50",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          )}
          aria-label="Execute research search"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Search
        </button>
      </div>
    </form>
  );
}
