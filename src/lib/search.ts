import type { Paper } from "@/types";
import { normalizeTitle } from "./utils";
import { searchOpenAlex } from "./openalex";
import { searchArxiv } from "./arxiv";
import { searchSemanticScholar } from "./semanticScholar";

/* ─── Deduplication ─── */

export function deduplicatePapers(papers: Paper[]): Paper[] {
  const seenByDoi = new Map<string, Paper>();
  const seenByTitle = new Map<string, Paper>();

  for (const paper of papers) {
    /* 1. Deduplicate by DOI */
    if (paper.doi) {
      const doiKey = paper.doi.toLowerCase().trim();
      if (seenByDoi.has(doiKey)) {
        const existing = seenByDoi.get(doiKey)!;
        // Keep the record with richer abstract or higher citations
        if (
          (paper.abstract?.length ?? 0) > (existing.abstract?.length ?? 0) ||
          paper.citationCount > existing.citationCount
        ) {
          seenByDoi.set(doiKey, paper);
        }
        continue;
      }
      seenByDoi.set(doiKey, paper);
      continue;
    }

    /* 2. Deduplicate by normalized title */
    const normTitle = normalizeTitle(paper.title);
    if (normTitle.length >= 10) {
      if (seenByTitle.has(normTitle)) {
        const existing = seenByTitle.get(normTitle)!;
        if (
          (paper.abstract?.length ?? 0) > (existing.abstract?.length ?? 0) ||
          paper.citationCount > existing.citationCount
        ) {
          seenByTitle.set(normTitle, paper);
          seenByDoi.delete(existing.id);
          seenByDoi.set(paper.id, paper);
        }
        continue;
      }
      seenByTitle.set(normTitle, paper);
    }

    seenByDoi.set(paper.id, paper);
  }

  return Array.from(seenByDoi.values());
}

/* ─── Relevance Scoring ─── */

export function scorePapers(papers: Paper[], query: string): Paper[] {
  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const currentYear = new Date().getFullYear();

  return papers.map((paper) => {
    let score = 0;

    /* 1. Title match (0–30) */
    const titleLower = paper.title.toLowerCase();
    const titleMatches = queryTerms.filter((t) => titleLower.includes(t)).length;
    score += Math.min(30, (titleMatches / Math.max(queryTerms.length, 1)) * 30);

    /* 2. Abstract match (0–25) */
    if (paper.abstract) {
      const absLower = paper.abstract.toLowerCase();
      const absMatches = queryTerms.filter((t) => absLower.includes(t)).length;
      score += Math.min(25, (absMatches / Math.max(queryTerms.length, 1)) * 25);
    }

    /* 3. Recency bonus (0–15) */
    if (paper.year) {
      const age = currentYear - paper.year;
      score += Math.max(0, 15 - age * 1.5);
    }

    /* 4. Citation impact (0–15) */
    if (paper.citationCount > 0) {
      score += Math.min(15, Math.log10(paper.citationCount + 1) * 5);
    }

    /* 5. Substantial Abstract bonus (0–10) */
    if (paper.abstract && paper.abstract.length > 60) {
      score += 10;
    }

    /* 6. Open Access bonus (0–5) */
    if (paper.openAccessPdf) {
      score += 5;
    }

    return { ...paper, relevanceScore: Math.round(Math.min(100, Math.max(0, score))) };
  });
}

/* ─── Evidence Selection ─── */

/**
 * Selects the strongest candidate papers for synthesis based on:
 * 1. Has usable abstract or substantial text
 * 2. High relevance score
 * 3. Citation impact
 */
export function selectEvidence(papers: Paper[], maxCandidates = 15): Paper[] {
  // Sort candidates: papers with abstracts and high scores first
  const sorted = [...papers].sort((a, b) => {
    const aHasAbs = a.abstract && a.abstract.length > 40 ? 1 : 0;
    const bHasAbs = b.abstract && b.abstract.length > 40 ? 1 : 0;
    if (aHasAbs !== bHasAbs) return bHasAbs - aHasAbs;
    return b.relevanceScore - a.relevanceScore;
  });

  return sorted.slice(0, maxCandidates);
}

/* ─── Parallel Multi-Engine Search Pipeline ─── */

export async function searchAcademicSources(query: string): Promise<Paper[]> {
  /* Query OpenAlex, arXiv, and Semantic Scholar concurrently with Promise.allSettled */
  const results = await Promise.allSettled([
    searchOpenAlex(query, 15),
    searchArxiv(query, 10),
    searchSemanticScholar(query, 10),
  ]);

  const rawPapers: Paper[] = [];
  const providers = ["OpenAlex", "arXiv", "Semantic Scholar"];

  results.forEach((res, i) => {
    if (res.status === "fulfilled") {
      rawPapers.push(...res.value);
    } else {
      console.warn(`[Search] ${providers[i]} unavailable:`, res.reason);
    }
  });

  if (rawPapers.length === 0) return [];

  /* Deduplicate & Score */
  const deduplicated = deduplicatePapers(rawPapers);
  const scored = scorePapers(deduplicated, query);
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scored;
}
