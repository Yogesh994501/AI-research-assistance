"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { useResearchStore } from "@/store/researchStore";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Summarize key findings",
  "Compare methodologies",
  "What are the research gaps?",
  "Suggest future directions",
];

export default function AiChatPanel() {
  const { papers, activeQuery } = useResearchStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          papers,
          history: newMessages.slice(-6),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Unable to generate a response at this time." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Failed to connect to the AI Research Assistant. Please try again." },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-zinc-950/60 backdrop-blur-xl">
      {/* Header Info */}
      <div className="flex items-center gap-2 border-b border-zinc-800/60 px-3 sm:px-4 py-2 bg-zinc-900/40 shrink-0">
        <Bot className="h-4 w-4 text-cyan-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-200 truncate">AI Research Assistant</p>
          <p className="text-[10px] text-zinc-500 truncate">
            {papers.length > 0
              ? `Grounded in ${papers.length} retrieved papers`
              : "Ready to assist with scholarly insights"}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-10 text-center px-2">
            <div className="mb-2.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] shrink-0">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-zinc-200">Ask about your research</h3>
            <p className="mt-1 max-w-xs sm:max-w-sm text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
              I can summarize papers, compare methodologies, and identify research gaps based on retrieved sources.
            </p>

            {/* Suggestion Chips */}
            <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-md">
              {SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleSendMessage(sug)}
                  className="rounded-full border border-zinc-700/60 bg-zinc-900/70 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs text-zinc-300 transition hover:border-cyan-500/50 hover:bg-cyan-950/30 hover:text-cyan-300 active:scale-95"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2 sm:gap-3 text-xs leading-relaxed",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] sm:max-w-[80%] rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5",
                  msg.role === "user"
                    ? "bg-cyan-600/20 border border-cyan-500/40 text-zinc-100"
                    : "bg-zinc-900/80 border border-zinc-800 text-zinc-200"
                )}
              >
                <ReactMarkdown className="prose-xs prose-invert leading-relaxed">
                  {msg.content}
                </ReactMarkdown>
              </div>

              {msg.role === "user" && (
                <div className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                </div>
              )}
            </div>
          ))
        )}

        {isSending && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 py-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
            <span>AI Assistant is analyzing papers…</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="border-t border-zinc-800/60 p-2.5 sm:p-3 bg-zinc-900/20 shrink-0"
      >
        <div className="relative flex items-center rounded-xl border border-zinc-700/60 bg-zinc-900/80 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeQuery
                ? `Ask about "${activeQuery.slice(0, 25)}..."`
                : "Ask about your research papers…"
            }
            disabled={isSending}
            className="flex-1 min-w-0 bg-transparent px-3 py-2 sm:py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="mr-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 transition hover:bg-cyan-500/30 disabled:opacity-30 active:scale-95 shrink-0"
          >
            <Send className="h-3.5 w-3.5 shrink-0" />
          </button>
        </div>
      </form>
    </div>
  );
}
