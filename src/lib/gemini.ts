import { GoogleGenAI } from "@google/genai";
import type { Paper } from "@/types";

/** Build structured evidence context from selected papers for Gemini */
function buildPaperContext(papers: Paper[]): string {
  return papers
    .map((p, i) => {
      const meta = [
        p.authors.length > 0 ? `Authors: ${p.authors.join(", ")}` : null,
        p.year ? `Year: ${p.year}` : null,
        p.doi ? `DOI: ${p.doi}` : null,
        `Citations: ${p.citationCount}`,
        p.source ? `Source: ${p.source}` : null,
        `Relevance Score: ${p.relevanceScore}%`,
      ]
        .filter(Boolean)
        .join(" | ");

      const abstract = p.abstract ? `\nAbstract: ${p.abstract}` : "\n[No abstract available - title and metadata only]";

      return `[${i + 1}] "${p.title}"\n${meta}${abstract}`;
    })
    .join("\n\n---\n\n");
}

/** Strict system prompt enforcing factual grounding */
const SYSTEM_PROMPT = `You are Nexus3D, an advanced academic research synthesizer. You produce rigorous, GROUNDED research reports based SOLELY on the provided academic evidence.

## CORE PRINCIPLES
1. ONLY make assertions directly supported by the supplied papers.
2. ONLY cite papers provided in the evidence context using inline citations like [1], [2], [1][3].
3. NEVER invent DOIs, author names, publication dates, benchmark figures, datasets, or results.
4. NEVER cite an index that does not exist in the supplied evidence.
5. If the evidence is insufficient or contradictory, state: "The retrieved literature does not establish..."
6. When comparing methods, datasets, or findings across papers, use clean Markdown tables.
7. Every substantive claim MUST have at least one valid inline citation.

## REQUIRED STRUCTURE
Structure your synthesis using these sections:

### Executive Summary
A 2-3 sentence overview answering the research question.

### Key Findings
Synthesize primary findings from the literature with citations.

### Methodology Comparison
If multiple methodologies or approaches are referenced, compare them in a Markdown table.

### Research Gaps
Explicitly identify what questions or dimensions remain unaddressed in the provided sources.

### Limitations
Document limitations of the analyzed studies.

### Future Directions
Evidence-based next steps suggested by the literature.

### References
List all cited papers matching their respective [1], [2] indices.`;

/** Candidate models cascade in order of preference if primary experiences high demand / 503 */
const MODEL_CASCADE = [
  process.env.LLM_MODEL || "gemini-3.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.7-flash",
  "gemini-pro-latest",
];

/** Synthesize a grounded research report with automatic multi-model overload failover */
export async function synthesizeWithGemini(query: string, papers: Paper[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "GEMINI_API_KEY is not configured in the environment. Please set your GEMINI_API_KEY in .env.local to enable grounded AI synthesis."
    );
  }

  if (papers.length === 0) {
    throw new Error("No academic evidence provided for synthesis.");
  }

  const context = buildPaperContext(papers);
  const userPrompt = `Research Question: "${query}"

Below are ${papers.length} peer-reviewed or preprint academic papers retrieved from scholarly repositories. Synthesize a comprehensive, strictly grounded research report addressing the research question based ONLY on this evidence.

${context}`;

  const ai = new GoogleGenAI({ apiKey });
  let lastError: Error | null = null;

  // Deduplicate cascade list
  const modelsToTry = Array.from(new Set(MODEL_CASCADE));

  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini] Attempting synthesis with model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      });

      const text = response.text;
      if (text && text.trim().length > 0) {
        console.log(`[Gemini] Synthesis successful using: ${model}`);
        return text;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini] Model ${model} unavailable (${msg}). Cascading to next candidate...`);
      lastError = err instanceof Error ? err : new Error(msg);
      // Brief pause before trying next candidate
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  throw lastError || new Error("All Gemini model endpoints are currently experiencing high demand. Please try again in a few moments.");
}
