'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MessageSquare, Send, X, Trash2, Sparkles, Bot, User, Loader2, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { nanoid } from 'nanoid';
import { useResearchStore } from '@/store/researchStore';
import type { ChatMessage } from '@/types';

export default function AiChatPanel() {
  const isChatOpen = useResearchStore((s) => s.isChatOpen);
  const chatMessages = useResearchStore((s) => s.chatMessages);
  const isChatStreaming = useResearchStore((s) => s.isChatStreaming);
  const addChatMessage = useResearchStore((s) => s.addChatMessage);
  const updateLastAssistantMessage = useResearchStore((s) => s.updateLastAssistantMessage);
  const setChatStreaming = useResearchStore((s) => s.setChatStreaming);
  const toggleChat = useResearchStore((s) => s.toggleChat);
  const clearChat = useResearchStore((s) => s.clearChat);
  const nodes = useResearchStore((s) => s.nodes);

  const sources = useMemo(
    () => nodes.filter((n) => n.type === 'source' || n.type === 'document'),
    [nodes]
  );

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isChatOpen]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isChatStreaming) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };
    addChatMessage(userMsg);
    setInputValue('');

    // Add placeholder assistant message
    const assistantMsg: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    addChatMessage(assistantMsg);
    setChatStreaming(true);

    try {
      // Build conversation history for context
      const allMessages = [...chatMessages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Build paper contexts from retrieved sources
      const contexts = sources.map((s) => ({
        title: s.label,
        snippet: s.summary || '',
        url: s.url || '',
        citationCount: s.citationCount,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, contexts }),
      });

      const data = await res.json();

      if (data.error) {
        updateLastAssistantMessage('Sorry, I encountered an error. Please try again.', []);
      } else {
        updateLastAssistantMessage(data.content || 'I apologize, I could not generate a response.', data.followUps || []);
      }
    } catch (err) {
      console.error('Chat error:', err);
      updateLastAssistantMessage('Connection error. Please check your network and try again.', []);
    } finally {
      setChatStreaming(false);
    }
  }, [isChatStreaming, chatMessages, sources, addChatMessage, setChatStreaming, updateLastAssistantMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl shadow-black/50 animate-in slide-in-from-bottom duration-300" style={{ height: '420px' }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">AI Research Assistant</h3>
            <p className="text-[10px] text-slate-500">
              Grounded in {sources.length > 0 ? `${sources.length} retrieved papers` : 'general knowledge'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {chatMessages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={toggleChat}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/15 text-cyan-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-200">Ask me anything about your research</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                I can summarize papers, compare methodologies, explain findings, and suggest research directions — all grounded in retrieved literature.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-1">
              {[
                'Summarize the key findings',
                'Compare the methodologies',
                'What are the research gaps?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 self-start shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/15 border border-cyan-500/20 text-slate-100 rounded-br-md'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300 rounded-bl-md'
                  }`}
                >
                  {msg.content ? (
                    msg.role === 'assistant' ? (
                      <div className="prose prose-invert prose-cyan prose-xs max-w-none prose-p:my-1.5 prose-headings:text-sm prose-headings:font-bold prose-li:my-0.5 prose-table:text-xs">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-[11px]">Analyzing retrieved literature...</span>
                    </div>
                  )}
                </div>

                {/* Follow-up suggestion chips */}
                {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && msg.content && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.followUps.map((fu, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(fu)}
                        disabled={isChatStreaming}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 text-[10px] text-slate-400 hover:text-cyan-300 transition-all disabled:opacity-40 cursor-pointer"
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 self-start shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="px-5 py-3 border-t border-slate-800 bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isChatStreaming ? 'Waiting for response...' : 'Ask about your research papers...'}
            disabled={isChatStreaming}
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isChatStreaming}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 transition-all shadow-lg shadow-cyan-500/20 disabled:shadow-none cursor-pointer"
          >
            {isChatStreaming ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
