import type { Paper } from "@/types";

/** Extract all citation markers [N] from text */
export function extractCitations(text: string): number[] {
  const matches = text.matchAll(/\[(\d+)\]/g);
  const citations = new Set<number>();
  for (const m of matches) {
    citations.add(parseInt(m[1], 10));
  }
  return Array.from(citations).sort((a, b) => a - b);
}

/** Validate that all citation numbers map to actual papers */
export function validateCitations(
  text: string,
  papers: Paper[]
): { validText: string; invalidCitations: number[] } {
  const maxIndex = papers.length;
  const citations = extractCitations(text);
  const invalid = citations.filter((n) => n < 1 || n > maxIndex);

  if (invalid.length === 0) {
    return { validText: text, invalidCitations: [] };
  }

  /* Remove invalid citation markers from text */
  let cleaned = text;
  for (const n of invalid) {
    /* Remove [N] but don't break surrounding text */
    cleaned = cleaned.replace(new RegExp(`\\[${n}\\]`, "g"), "");
  }

  /* Clean up double spaces left by removed citations */
  cleaned = cleaned.replace(/\s{2,}/g, " ").replace(/\s+([.,;])/g, "$1");

  return { validText: cleaned, invalidCitations: invalid };
}

/** Build a citation lookup map: index → paper */
export function buildCitationMap(papers: Paper[]): Map<number, Paper> {
  const map = new Map<number, Paper>();
  papers.forEach((p, i) => map.set(i + 1, p));
  return map;
}

/** Get the paper for a citation index (1-based) */
export function getCitedPaper(citationIndex: number, papers: Paper[]): Paper | null {
  if (citationIndex < 1 || citationIndex > papers.length) return null;
  return papers[citationIndex - 1];
}
