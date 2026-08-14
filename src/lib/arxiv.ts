import { XMLParser } from "fast-xml-parser";
import type { Paper } from "@/types";

interface ArxivEntry {
  id?: string;
  title?: string;
  summary?: string;
  author?: Array<{ name?: string }> | { name?: string };
  published?: string;
  "arxiv:doi"?: string;
  link?: Array<{ "@_href"?: string; "@_title"?: string }> | { "@_href"?: string; "@_title"?: string };
}

/** Search arXiv for papers */
export async function searchArxiv(query: string, maxResults = 10): Promise<Paper[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://export.arxiv.org/api/query?search_query=all:${encoded}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) return [];

  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    isArray: (name) => name === "entry" || name === "author" || name === "link",
  });

  const parsed = parser.parse(xml);
  const entries: ArxivEntry[] = parsed?.feed?.entry ?? [];

  if (!Array.isArray(entries)) return [];

  return entries
    .filter((e) => e.title)
    .map((e): Paper => {
      const rawId = typeof e.id === "string" ? e.id : "";
      const arxivId = rawId.replace("http://arxiv.org/abs/", "").replace(/v\d+$/, "");

      const authors: string[] = [];
      if (Array.isArray(e.author)) {
        for (const a of e.author.slice(0, 5)) {
          if (a.name) authors.push(a.name);
        }
      } else if (e.author?.name) {
        authors.push(e.author.name);
      }

      let pdfUrl: string | null = null;
      const links = Array.isArray(e.link) ? e.link : e.link ? [e.link] : [];
      for (const l of links) {
        if (l["@_title"] === "pdf" || l["@_href"]?.includes("/pdf/")) {
          pdfUrl = l["@_href"] ?? null;
          break;
        }
      }

      const year = e.published ? new Date(e.published).getFullYear() : null;

      return {
        id: `arxiv-${arxivId}`,
        title: typeof e.title === "string" ? e.title.replace(/\s+/g, " ").trim() : "Untitled",
        doi: typeof e["arxiv:doi"] === "string" ? e["arxiv:doi"] : null,
        citationCount: 0,
        abstract: typeof e.summary === "string" ? e.summary.replace(/\s+/g, " ").trim() : null,
        openAccessPdf: pdfUrl,
        authors,
        year,
        source: "arxiv",
        url: rawId || `https://arxiv.org/abs/${arxivId}`,
        relevanceScore: 0,
      };
    });
}
