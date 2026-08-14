import type { Paper } from "@/types";

interface S2Paper {
  paperId?: string;
  title?: string;
  abstract?: string;
  citationCount?: number;
  year?: number;
  authors?: Array<{ name?: string }>;
  externalIds?: { DOI?: string; ArXiv?: string };
  openAccessPdf?: { url?: string };
  url?: string;
}

/** Search Semantic Scholar for papers */
export async function searchSemanticScholar(query: string, maxResults = 10): Promise<Paper[]> {
  const encoded = encodeURIComponent(query);
  const fields = "paperId,title,abstract,citationCount,year,authors,externalIds,openAccessPdf,url";
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encoded}&limit=${maxResults}&fields=${fields}`;

  const res = await fetch(url, {
    signal: AbortSignal.timeout(12000),
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return [];

  const data = await res.json();
  const papers: S2Paper[] = data.data ?? [];

  return papers
    .filter((p) => p.title)
    .map((p): Paper => ({
      id: p.paperId ? `s2-${p.paperId}` : `s2-${Math.random().toString(36).slice(2)}`,
      title: p.title ?? "Untitled",
      doi: p.externalIds?.DOI ?? null,
      citationCount: p.citationCount ?? 0,
      abstract: p.abstract ?? null,
      openAccessPdf: p.openAccessPdf?.url ?? null,
      authors: p.authors?.map((a) => a.name ?? "Unknown").slice(0, 5) ?? [],
      year: p.year ?? null,
      source: "semantic_scholar",
      url: p.url ?? (p.externalIds?.DOI ? `https://doi.org/${p.externalIds.DOI}` : null),
      relevanceScore: 0,
    }));
}
