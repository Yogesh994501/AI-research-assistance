import { NextRequest, NextResponse } from "next/server";
import { searchAcademicSources } from "@/lib/search";
import { synthesizeWithGemini } from "@/lib/gemini";
import { validateCitations } from "@/lib/citations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";

    /* ── Validation ── */
    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    if (query.length > 500) {
      return NextResponse.json({ error: "Query is too long (max 500 characters)" }, { status: 400 });
    }

    /* ── Search ── */
    console.log(`[API] Searching for: "${query}"`);
    const papers = await searchAcademicSources(query);

    if (papers.length === 0) {
      return NextResponse.json({
        papers: [],
        report: `## No Relevant Sources Found\n\nNo sufficiently relevant academic papers were found for: "${query}".\n\nTry:\n- Using more specific terminology\n- Including key academic terms\n- Broadening your topic slightly`,
      });
    }

    /* ── Synthesize ── */
    console.log(`[API] Synthesizing report from ${papers.length} papers`);
    const rawReport = await synthesizeWithGemini(query, papers);

    /* ── Validate Citations ── */
    const { validText: report, invalidCitations } = validateCitations(rawReport, papers);

    if (invalidCitations.length > 0) {
      console.warn(`[API] Removed invalid citations: ${invalidCitations.join(", ")}`);
    }

    return NextResponse.json({ papers, report });
  } catch (error) {
    console.error("[API] Research error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
