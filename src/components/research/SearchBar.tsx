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
          "search-glass relative flex items-center gap-2 rounded-xl",
          "transition-all duration-300"
        )}
      >
        <div className="pl-3.5 sm:pl-4 text-[#94A3B8] flex items-center justify-center shrink-0">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400 shrink-0" />
          ) : (
            <Search className="h-4 w-4 shrink-0" />
          )}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a research question…"
          disabled={isLoading}
          className={cn(
            "flex-1 min-w-0 bg-transparent py-2.5 sm:py-3 text-xs sm:text-sm text-[#F8FAFC]",
            "placeholder:text-[#94A3B8]/70 placeholder:text-xs sm:placeholder:text-sm focus:outline-none",
            "disabled:opacity-50"
          )}
          aria-label="Research query input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            "btn-primary mr-1.5 sm:mr-2 flex items-center justify-center gap-1.5 rounded-lg px-3 sm:px-4 py-1.5 text-xs font-medium shrink-0",
            "active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-cyan-500/40",
            "focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          )}
          aria-label="Execute research search"
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
          <span className="hidden xs:inline sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
