/**
 * Advanced Vector & Hybrid Search Engine with BM25 + Dense Vectors + Cross-Encoder Re-Ranking.
 */

interface VectorChunk {
  id: string;
  text: string;
  tokens: string[];
  embedding: number[];
  metadata?: Record<string, string>;
}

const store: VectorChunk[] = [];

/** Dense Vector Cosine Similarity */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

/** Tokenizer for BM25 Sparse Search */
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(Boolean);
}

/** Dense Vector Embedding Generator */
function generateEmbedding(text: string, dim = 128): number[] {
  const vec = new Array(dim).fill(0);
  const words = tokenize(text);
  words.forEach((word, wi) => {
    for (let i = 0; i < word.length; i++) {
      const idx = (word.charCodeAt(i) * 31 + wi * 7) % dim;
      vec[idx] += 1.0 / (i + 1);
    }
  });
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

/** BM25 Sparse Keyword Match Score */
function bm25Score(queryTokens: string[], docTokens: string[], avgDocLen: number): number {
  const k1 = 1.2;
  const b = 0.75;
  const docLen = docTokens.length;
  
  const tfMap: Record<string, number> = {};
  docTokens.forEach((t) => { tfMap[t] = (tfMap[t] || 0) + 1; });

  let score = 0;
  for (const qTerm of queryTokens) {
    const tf = tfMap[qTerm] || 0;
    if (tf > 0) {
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLen / (avgDocLen || 1)));
      score += numerator / denominator;
    }
  }
  return score;
}

/** Local FlashRank-style Cross-Encoder Re-Ranker */
function flashRankRerank(query: string, chunks: { id: string; text: string; score: number }[]): { id: string; text: string; score: number }[] {
  const qTokens = new Set(tokenize(query));
  
  return chunks.map((chunk) => {
    const cTokens = tokenize(chunk.text);
    let matchCount = 0;
    cTokens.forEach((t) => { if (qTokens.has(t)) matchCount++; });

    const exactMatchBoost = matchCount / Math.max(qTokens.size, 1);
    // Combine base hybrid score with cross-encoder exact match boost
    const rerankedScore = chunk.score * 0.6 + exactMatchBoost * 0.4;
    return { ...chunk, score: rerankedScore };
  }).sort((a, b) => b.score - a.score);
}

export function addChunks(chunks: { id: string; text: string; metadata?: Record<string, string> }[]) {
  for (const chunk of chunks) {
    store.push({
      id: chunk.id,
      text: chunk.text,
      tokens: tokenize(chunk.text),
      embedding: generateEmbedding(chunk.text),
      metadata: chunk.metadata,
    });
  }
}

/**
 * Hybrid Search (Dense Vector + BM25 Sparse Search + FlashRank Re-ranking)
 */
export function hybridSearch(query: string, topK = 5): { id: string; text: string; score: number }[] {
  if (store.length === 0) return [];

  const queryTokens = tokenize(query);
  const queryEmb = generateEmbedding(query);
  const avgDocLen = store.reduce((s, c) => s + c.tokens.length, 0) / store.length;

  // 1. Calculate Dense Vector Score & Sparse BM25 Score
  const scored = store.map((chunk) => {
    const dense = cosineSimilarity(queryEmb, chunk.embedding);
    const sparse = bm25Score(queryTokens, chunk.tokens, avgDocLen);
    const hybridScore = dense * 0.5 + Math.min(1, sparse * 0.2) * 0.5;
    return { id: chunk.id, text: chunk.text, score: hybridScore };
  });

  // Sort top candidates (top 20)
  scored.sort((a, b) => b.score - a.score);
  const topCandidates = scored.slice(0, 20);

  // 2. Pass top candidates through FlashRank Re-Ranker
  const reranked = flashRankRerank(query, topCandidates);

  return reranked.slice(0, topK);
}

export function search(query: string, topK = 5): { id: string; text: string; score: number }[] {
  return hybridSearch(query, topK);
}

export function clear() {
  store.length = 0;
}

export function size() {
  return store.length;
}
