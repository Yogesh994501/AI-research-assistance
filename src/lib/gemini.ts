import { GoogleGenAI } from "@google/genai";
import type { Paper } from "@/types";

/** Build the grounded context from papers for Gemini */
function buildPaperContext(papers: Paper[]): string {
  return papers
    .map((p, i) => {
      const meta = [
        p.authors.length > 0 ? `Authors: ${p.authors.join(", ")}` : null,
        p.year ? `Year: ${p.year}` : null,
        p.doi ? `DOI: ${p.doi}` : null,
        `Citations: ${p.citationCount}`,
        p.source ? `Source: ${p.source}` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const abstract = p.abstract ? `\nAbstract: ${p.abstract}` : "";

      return `[${i + 1}] "${p.title}"\n${meta}${abstract}`;
    })
    .join("\n\n---\n\n");
}

/** System prompt enforcing grounded synthesis */
const SYSTEM_PROMPT = `You are Nexus3D, an expert academic research synthesizer. You produce GROUNDED research reports based ONLY on the provided academic papers.

## STRICT RULES
1. ONLY cite papers provided in the context using [1], [2], [3] format
2. NEVER invent DOIs, authors, dates, datasets, or results
3. NEVER cite a paper number that was not provided
4. If evidence is insufficient, explicitly state "The provided literature does not establish..."
5. When comparing methods/datasets/findings, use Markdown tables
6. Every substantive claim MUST have at least one citation

## OUTPUT FORMAT
Structure your response with these sections:

### Executive Summary
A 2-3 sentence overview of the research landscape.

### Key Findings
The most important findings from the literature, each with citations.

### Methodology Comparison
If applicable, compare research approaches in a table.

### Research Gaps
Identify what the literature does NOT cover.

### Limitations
Note limitations of the reviewed studies.

### Future Directions
Suggest evidence-based future research directions.

### References
List all cited papers with their full titles.

Use Markdown formatting. Be precise, scholarly, and concise.`;

/** Synthesize a grounded research report using Gemini */
export async function synthesizeWithGemini(query: string, papers: Paper[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateFallbackReport(query, papers);
  }

  const model = process.env.LLM_MODEL || "gemini-2.5-flash";
  const context = buildPaperContext(papers);

  const userPrompt = `Research Question: "${query}"

The following ${papers.length} academic papers were retrieved from OpenAlex, arXiv, and Semantic Scholar. Synthesize a grounded research report based ONLY on these sources.

${context}

Produce a comprehensive, well-cited synthesis addressing the research question above.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    });

    const text = response.text;
    if (!text || text.trim().length === 0) {
      return generateFallbackReport(query, papers);
    }

    return text;
  } catch (error) {
    console.error("[Gemini] Synthesis error:", error);
    return generateFallbackReport(query, papers);
  }
}

/** Fallback report when Gemini is unavailable */
function generateFallbackReport(query: string, papers: Paper[]): string {
  if (papers.length === 0) {
    return `## No Sources Found\n\nNo relevant academic papers were found for: "${query}". Try refining your search terms.`;
  }

  const topPapers = papers.slice(0, 8);
  const paperSummaries = topPapers
    .map((p, i) => {
      const authors = p.authors.length > 0 ? p.authors.slice(0, 3).join(", ") : "Unknown";
      const year = p.year ?? "n.d.";
      const abstract = p.abstract ? `\n   > ${p.abstract.slice(0, 200)}…` : "";
      return `${i + 1}. **${p.title}** (${authors}, ${year}) — ${p.citationCount} citations [${i + 1}]${abstract}`;
    })
    .join("\n\n");

  return `### Executive Summary

This report synthesizes ${papers.length} academic papers retrieved from OpenAlex, arXiv, and Semantic Scholar addressing: "${query}".

> **Note:** Gemini AI synthesis is unavailable. This is a structured summary of retrieved sources. Set \`GEMINI_API_KEY\` for full AI-powered synthesis.

### Retrieved Literature

${paperSummaries}

### Key Observations

The retrieved literature spans ${new Set(papers.map((p) => p.year).filter(Boolean)).size} publication years with a combined ${papers.reduce((s, p) => s + p.citationCount, 0)} citations across ${papers.length} unique papers.

### References

${topPapers.map((p, i) => `[${i + 1}] ${p.title}${p.doi ? ` — DOI: ${p.doi}` : ""}`).join("\n")}`;
}
