'use client';

import { useState } from 'react';
import { Search, Sparkles, Upload, Loader2, Zap } from 'lucide-react';
import { useResearchStore } from '@/store/researchStore';
import axios from 'axios';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  
  const isResearching = useResearchStore((s) => s.isResearching);
  const setResearching = useResearchStore((s) => s.setResearching);
  const addResearchResult = useResearchStore((s) => s.addResearchResult);
  const researchMode = useResearchStore((s) => s.researchMode);
  const setResearchMode = useResearchStore((s) => s.setResearchMode);
  const addDocument = useResearchStore((s) => s.addDocument);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isResearching) return;

    setResearching(true);
    try {
      const res = await axios.post('/api/research', { query, mode: researchMode });
      addResearchResult(query, res.data);
      setQuery('');
    } catch (err) {
      console.error('Research failed', err);
    } finally {
      setResearching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResearching(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post('/api/ingest', formData);
      addDocument(res.data);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setResearching(false);
    }
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-2xl z-20 pointer-events-auto">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
        
        <div className="relative flex items-center bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
          <div className="pl-3 pr-2 text-cyan-400">
            {isResearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything or explore a topic..."
            className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder:text-gray-500 py-3 text-lg"
            disabled={isResearching}
          />
          
          <div className="flex items-center gap-2 pr-2 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => setResearchMode(researchMode === 'quick' ? 'deep' : 'quick')}
              className={`p-2 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium ${
                researchMode === 'deep' 
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' 
                  : 'bg-white/5 text-gray-400 hover:text-gray-200'
              }`}
              title={researchMode === 'deep' ? 'Deep Research' : 'Quick Answer'}
            >
              <Zap className="w-3.5 h-3.5" />
              {researchMode === 'deep' ? 'Deep' : 'Quick'}
            </button>

            <label className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 rounded-xl cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              <input type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileUpload} />
            </label>
            
            <button
              type="submit"
              disabled={!query.trim() || isResearching}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
