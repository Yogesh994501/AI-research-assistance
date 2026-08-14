import type { Paper } from "@/types";

interface OpenAlexWork {
  id?: string;
  title?: string;
  doi?: string;
  cited_by_count?: number;
  abstract_inverted_index?: Record<string, number[]>;
  authorships?: Array<{ author?: { display_name?: string } }>;
  publication_year?: number;
  open_access?: { oa_url?: string };
  primary_location?: { landing_page_url?: string };
}

/** Reconstruct abstract from OpenAlex inverted index */
function decodeAbstract(inverted: Record<string, number[]> | undefined): string | null {
  if (!inverted) return null;
  const words: [string, number][] = [];
  for (const [word, positions] of Object.entries(inverted)) {
    for (const pos of positions) {
      words.push([word, pos]);
    }
  }
  words.sort((a, b) => a[1] - b[1]);
  const text = words.map(([w]) => w).join(" ");
  return text.length > 0 ? text : null;
}

/** Search OpenAlex for papers */
export async function searchOpenAlex(query: string, maxResults = 15): Promise<Paper[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://api.openalex.org/works?search=${encoded}&per_page=${maxResults}&sort=relevance_score:desc&mailto=nexus3d@research.app`;

  const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) return [];

  const data = await res.json();
  const results: OpenAlexWork[] = data.results ?? [];

  return results
    .filter((w) => w.title)
    .map((w): Paper => ({
      id: w.id?.replace("https://openalex.org/", "") ?? `oa-${Math.random().toString(36).slice(2)}`,
      title: w.title ?? "Untitled",
      doi: w.doi?.replace("https://doi.org/", "") ?? null,
      citationCount: w.cited_by_count ?? 0,
      abstract: decodeAbstract(w.abstract_inverted_index),
      openAccessPdf: w.open_access?.oa_url ?? null,
      authors: w.authorships?.map((a) => a.author?.display_name ?? "Unknown").filter(Boolean).slice(0, 5) ?? [],
      year: w.publication_year ?? null,
      source: "openalex",
      url: w.primary_location?.landing_page_url ?? (w.doi ? `https://doi.org/${w.doi.replace("https://doi.org/", "")}` : null),
      relevanceScore: 0,
    }));
}
