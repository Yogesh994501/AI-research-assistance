import { NextResponse } from 'next/server';
import { webSearch } from '@/lib/search';
import { synthesize } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { query, mode = 'quick' } = await request.json();

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 1. Multi-Engine Scholarly Search (OpenAlex + Semantic Scholar + arXiv + Serper)
    const numResults = mode === 'deep' ? 8 : 5;
    const sources = await webSearch(query, numResults);

    // 2. AI Synthesis & Structured Extractions
    const sourcesForLLM = sources.map((s) => ({
      id: s.id,
      title: s.title,
      url: s.url,
      snippet: s.snippet,
      citationCount: s.citationCount,
      doi: s.doi,
    }));

    const { answer, concepts, followUps, paperComparisons } = await synthesize(query, sourcesForLLM, mode);

    return NextResponse.json({
      answer,
      sources,
      concepts,
      followUps,
      paperComparisons,
    });
  } catch (err) {
    console.error('Research API error:', err);
    return NextResponse.json({ error: 'Research failed' }, { status: 500 });
  }
}
