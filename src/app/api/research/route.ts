import { NextRequest, NextResponse } from "next/server";
import { searchAcademicSources, selectEvidence } from "@/lib/search";
import { synthesizeWithGemini } from "@/lib/gemini";
import { validateCitations } from "@/lib/citations";

export async function POST(request: NextRequest) {
  try {
    /* 1. Query Validation */
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required." }, { status: 400 });
    }
    if (query.length > 500) {
      return NextResponse.json(
        { error: "Query is too long. Please limit your research question to 500 characters." },
        { status: 400 }
      );
    }

    /* 2 & 3 & 4. Parallel Providers -> Normalize -> Deduplicate -> Relevance Ranking */
    console.log(`[API] Executing multi-engine search for: "${query}"`);
    const allRankedPapers = await searchAcademicSources(query);

    if (allRankedPapers.length === 0) {
      return NextResponse.json({
        papers: [],
        report: `## No Scholarly Sources Found\n\nNo relevant academic papers were returned from OpenAlex, arXiv, or Semantic Scholar for: "${query}".\n\n**Suggestions:**\n- Check for typos in scientific terms\n- Try broader academic keywords\n- Use standard disciplinary terminology`,
      });
    }

    /* 5. Evidence Selection (Top 15 strongest candidates with substantial evidence) */
    const evidencePapers = selectEvidence(allRankedPapers, 15);
    console.log(
      `[API] Selected ${evidencePapers.length} evidence papers out of ${allRankedPapers.length} total ranked sources.`
    );

    /* 6. Gemini Synthesis (Strict Grounding, No Mock Fallback) */
    let rawReport: string;
    try {
      rawReport = await synthesizeWithGemini(query, evidencePapers);
    } catch (geminiError) {
      const errorMessage =
        geminiError instanceof Error ? geminiError.message : "Gemini synthesis encountered an unexpected error.";
      console.error("[API] Gemini synthesis failure:", errorMessage);

      // Return the retrieved and ranked papers alongside the explicit configuration/runtime error
      return NextResponse.json(
        {
          papers: evidencePapers,
          report: `### Synthesis Unavailable\n\n> ⚠️ **Configuration or API Notice:** ${errorMessage}\n\nRetrieved and ranked **${evidencePapers.length} academic sources** matching your query. Explore the literature index or 3D citation constellation below.`,
          error: errorMessage,
        },
        { status: 200 }
      );
    }

    /* 7. Citation Validation */
    const { validText: validatedReport, invalidCitations } = validateCitations(rawReport, evidencePapers);

    if (invalidCitations.length > 0) {
      console.warn(`[API] Stripped nonexistent citation references: ${invalidCitations.join(", ")}`);
    }

    /* 8. Return Response */
    return NextResponse.json({
      papers: evidencePapers,
      report: validatedReport,
    });
  } catch (error) {
    console.error("[API] Unhandled error in research route:", error);
    const message = error instanceof Error ? error.message : "An internal server error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
