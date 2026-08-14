import type { Paper } from "@/types";
import { normalizeTitle } from "./utils";
import { searchOpenAlex } from "./openalex";
import { searchArxiv } from "./arxiv";
import { searchSemanticScholar } from "./semanticScholar";

/* ─── Deduplication ─── */

function deduplicatePapers(papers: Paper[]): Paper[] {
  const seen = new Map<string, Paper>();
  const titleMap = new Map<string, Paper>();

  for (const paper of papers) {
    /* 1. DOI match */
    if (paper.doi) {
      const doiKey = paper.doi.toLowerCase();
      if (seen.has(doiKey)) {
        const existing = seen.get(doiKey)!;
        /* Keep the one with more data */
        if ((paper.abstract?.length ?? 0) > (existing.abstract?.length ?? 0) || paper.citationCount > existing.citationCount) {
          seen.set(doiKey, paper);
        }
        continue;
      }
      seen.set(doiKey, paper);
      continue;
    }

    /* 2. Normalized title match */
    const normTitle = normalizeTitle(paper.title);
    if (normTitle.length < 10) {
      /* Too short to reliably deduplicate by title */
      seen.set(paper.id, paper);
      continue;
    }

    if (titleMap.has(normTitle)) {
      const existing = titleMap.get(normTitle)!;
      if ((paper.abstract?.length ?? 0) > (existing.abstract?.length ?? 0) || paper.citationCount > existing.citationCount) {
        titleMap.set(normTitle, paper);
        /* Remove old from seen and add new */
        seen.delete(existing.id);
        seen.set(paper.id, paper);
      }
      continue;
    }

    titleMap.set(normTitle, paper);
    seen.set(paper.id, paper);
  }

  return Array.from(seen.values());
}

/* ─── Relevance Scoring ─── */

function scorePapers(papers: Paper[], query: string): Paper[] {
  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const currentYear = new Date().getFullYear();

  return papers.map((paper) => {
    let score = 0;

    /* Title relevance (0-30) */
    const titleLower = paper.title.toLowerCase();
    const titleMatches = queryTerms.filter((t) => titleLower.includes(t)).length;
    score += Math.min(30, (titleMatches / Math.max(queryTerms.length, 1)) * 30);

    /* Abstract relevance (0-25) */
    if (paper.abstract) {
      const absLower = paper.abstract.toLowerCase();
      const absMatches = queryTerms.filter((t) => absLower.includes(t)).length;
      score += Math.min(25, (absMatches / Math.max(queryTerms.length, 1)) * 25);
    }

    /* Recency (0-15) */
    if (paper.year) {
      const age = currentYear - paper.year;
      score += Math.max(0, 15 - age * 1.5);
    }

    /* Citation impact (0-15) */
    if (paper.citationCount > 0) {
      score += Math.min(15, Math.log10(paper.citationCount + 1) * 5);
    }

    /* Has abstract bonus (0-10) */
    if (paper.abstract && paper.abstract.length > 50) {
      score += 10;
    }

    /* Open access bonus (0-5) */
    if (paper.openAccessPdf) {
      score += 5;
    }

    return { ...paper, relevanceScore: Math.round(Math.min(100, score)) };
  });
}

/* ─── Main Search Pipeline ─── */

export async function searchAcademicSources(query: string): Promise<Paper[]> {
  /* Parallel search across all providers — never let one break the pipeline */
  const results = await Promise.allSettled([
    searchOpenAlex(query, 15),
    searchArxiv(query, 10),
    searchSemanticScholar(query, 10),
  ]);

  const allPapers: Paper[] = [];
  const providerStatus: string[] = [];

  for (const [i, result] of results.entries()) {
    const name = ["OpenAlex", "arXiv", "Semantic Scholar"][i];
    if (result.status === "fulfilled") {
      allPapers.push(...result.value);
      providerStatus.push(`${name}: ${result.value.length} papers`);
    } else {
      providerStatus.push(`${name}: unavailable`);
    }
  }

  console.log(`[Search] ${providerStatus.join(" | ")}`);

  if (allPapers.length === 0) return [];

  /* Deduplicate → Score → Sort → Top 20 */
  const unique = deduplicatePapers(allPapers);
  const scored = scorePapers(unique, query);
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scored.slice(0, 20);
}
