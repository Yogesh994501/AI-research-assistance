"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Sparkles, Bot } from "lucide-react";
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
          "search-glass relative flex items-center gap-2.5 rounded-xl px-1",
          "transition-all duration-300 shadow-lg"
        )}
      >
        {/* Left Search Icon with AI Tag */}
        <div className="pl-3.5 text-[#94A3B8] flex items-center gap-2 shrink-0">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400 shrink-0" />
          ) : (
            <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          )}
          <span className="hidden md:inline-flex items-center gap-1 rounded bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono text-cyan-300 border border-white/[0.08]">
            <Bot className="h-3 w-3" />
            AI RAG
          </span>
        </div>

        {/* Input Text Box */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a research question (e.g. 'Transformer scaling laws in vision')..."
          disabled={isLoading}
          className={cn(
            "flex-1 min-w-0 bg-transparent py-2.5 sm:py-3 text-xs sm:text-sm text-[#F8FAFC]",
            "placeholder:text-[#94A3B8]/60 placeholder:text-xs sm:placeholder:text-sm focus:outline-none",
            "disabled:opacity-50"
          )}
          aria-label="Research query input"
        />

        {/* Search Submit Action Button */}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className={cn(
            "btn-primary mr-1 flex items-center justify-center gap-1.5 rounded-lg px-3.5 sm:px-5 py-1.5 text-xs font-semibold shrink-0 shadow-md",
            "active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
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
