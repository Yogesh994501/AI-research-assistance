/**
 * Simple in-memory vector store using cosine similarity.
 * Production usage would swap this for ChromaDB or Pinecone.
 */

interface VectorChunk {
  id: string;
  text: string;
  embedding: number[];
  metadata?: Record<string, string>;
}

const store: VectorChunk[] = [];

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

/** Generate a simple hash-based pseudo-embedding (for demo without API calls). */
function pseudoEmbed(text: string, dim = 128): number[] {
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().split(/\W+/);
  words.forEach((word, wi) => {
    for (let i = 0; i < word.length; i++) {
      const idx = (word.charCodeAt(i) * 31 + wi * 7) % dim;
      vec[idx] += 1.0 / (i + 1);
    }
  });
  // Normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export function addChunks(chunks: { id: string; text: string; metadata?: Record<string, string> }[]) {
  for (const chunk of chunks) {
    store.push({
      id: chunk.id,
      text: chunk.text,
      embedding: pseudoEmbed(chunk.text),
      metadata: chunk.metadata,
    });
  }
}

export function search(query: string, topK = 5): { id: string; text: string; score: number }[] {
  const queryEmb = pseudoEmbed(query);
  const scored = store.map((chunk) => ({
    id: chunk.id,
    text: chunk.text,
    score: cosineSimilarity(queryEmb, chunk.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export function clear() {
  store.length = 0;
}

export function size() {
  return store.length;
}
