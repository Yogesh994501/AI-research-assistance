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

/** Format references into standard academic Markdown bibliography */
export function formatBibliographyMarkdown(papers: Paper[]): string {
  if (!papers || papers.length === 0) return "";

  const lines = [
    "## References & Sources",
    "",
  ];

  papers.forEach((p, i) => {
    const idx = i + 1;
    const authors = p.authors.length > 0
      ? p.authors.length > 3
        ? `${p.authors.slice(0, 3).join(", ")}, et al.`
        : p.authors.join(", ")
      : "Anonymous";
    const year = p.year ? ` (${p.year})` : "";
    const source = p.source === "arxiv" ? "arXiv preprint" : p.source === "openalex" ? "OpenAlex Index" : "Semantic Scholar";
    const doi = p.doi ? ` DOI: [${p.doi}](https://doi.org/${p.doi}).` : "";
    const url = p.url ? ` Available: [${p.url}](${p.url}).` : "";

    lines.push(`[${idx}] **${authors}**${year}. *${p.title}*. ${source}.${doi}${url}`);
    lines.push("");
  });

  return lines.join("\n");
}

/** Generate a full academic research paper with embedded Bibliography at the bottom */
export function generateFullPaperMarkdown(
  synthesisReport: string,
  papers: Paper[],
  query?: string
): string {
  const title = query ? `# Research Synthesis: ${query}\n\n` : "";
  const bibliography = formatBibliographyMarkdown(papers);

  if (synthesisReport.includes("## References") || synthesisReport.includes("### References")) {
    return `${title}${synthesisReport}`;
  }

  return `${title}${synthesisReport}\n\n---\n\n${bibliography}`;
}
