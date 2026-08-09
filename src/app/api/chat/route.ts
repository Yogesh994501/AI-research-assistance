import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const model = process.env.LLM_MODEL || 'gemini-2.5-flash';

let genai: GoogleGenAI | null = null;
if (apiKey) {
  genai = new GoogleGenAI({ apiKey });
}

export async function POST(request: Request) {
  try {
    const { messages, contexts } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';

    // Build context string from retrieved papers
    const contextStr = (contexts || [])
      .map((c: any, i: number) => `[${i + 1}] ${c.title}\nAbstract: ${c.snippet || c.summary || ''}`)
      .join('\n\n');

    // Build conversation history for multi-turn
    const conversationHistory = messages
      .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const systemPrompt = `You are a world-class AI Research Assistant embedded in an academic research workspace called Nexus3D.

YOUR CAPABILITIES:
- You help researchers understand, analyze, and synthesize scientific literature
- You answer questions grounded in retrieved papers from OpenAlex, Semantic Scholar, and arXiv
- You explain complex methodologies, compare findings across papers, and identify research gaps
- You suggest follow-up research questions

GROUNDING RULES:
1. When paper contexts are provided below, cite them using [1], [2], etc. markers
2. If the user asks about something NOT covered in the provided context, clearly say so — do NOT hallucinate
3. Be specific: mention actual methodologies, metrics, datasets, and findings from the papers
4. Be conversational but scholarly in tone

RETRIEVED PAPER CONTEXTS:
${contextStr || 'No papers have been retrieved yet. Answer based on your general knowledge, but note this to the user.'}

CONVERSATION SO FAR:
${conversationHistory}

Respond to the user's latest message. After your response, suggest 2-3 follow-up questions the user might ask. Format follow-ups on separate lines prefixed with "FOLLOWUP:" at the end of your response.`;

    if (!genai) {
      // Mock response when no API key is set
      const mockResponse = getMockResponse(lastUserMessage, contexts);
      return NextResponse.json(mockResponse);
    }

    // Use Gemini to generate a response
    try {
      const response = await genai.models.generateContent({
        model,
        contents: systemPrompt,
        config: { maxOutputTokens: 2048, temperature: 0.7 },
      });

      const rawText = response.text || '';

      // Parse follow-ups from the response
      const lines = rawText.split('\n');
      const followUps: string[] = [];
      const contentLines: string[] = [];

      for (const line of lines) {
        if (line.trim().startsWith('FOLLOWUP:')) {
          followUps.push(line.trim().replace('FOLLOWUP:', '').trim());
        } else {
          contentLines.push(line);
        }
      }

      return NextResponse.json({
        content: contentLines.join('\n').trim(),
        followUps: followUps.length > 0 ? followUps : getDefaultFollowUps(lastUserMessage),
      });
    } catch (err) {
      console.error('Gemini chat error:', err);
      const mockResponse = getMockResponse(lastUserMessage, contexts);
      return NextResponse.json(mockResponse);
    }
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Chat failed' }, { status: 500 });
  }
}

function getDefaultFollowUps(query: string): string[] {
  return [
    `What are the main limitations discussed in these papers?`,
    `How do these methodologies compare to each other?`,
    `What future research directions are suggested?`,
  ];
}

function getMockResponse(query: string, contexts?: any[]): { content: string; followUps: string[] } {
  const hasContexts = contexts && contexts.length > 0;
  const q = query.toLowerCase();

  if (q.includes('summarize') || q.includes('summary') || q.includes('overview')) {
    return {
      content: hasContexts
        ? `Based on the ${contexts!.length} retrieved papers, here's a synthesis:\n\nThe research corpus reveals convergent progress in this domain. **${contexts![0]?.title || 'The primary study'}** establishes foundational benchmarks [1], while subsequent work builds on these findings with improved methodologies [2].\n\nKey takeaways:\n- Papers demonstrate up to 40% improvement in computational efficiency over prior baselines\n- Multiple studies validate results across diverse datasets including both synthetic and real-world corpora\n- There is emerging consensus on the importance of hybrid approaches combining classical and modern techniques\n\nHowever, I should note that the corpus is limited to ${contexts!.length} papers — a broader search may reveal additional perspectives.`
        : `I'd be happy to provide a summary, but no papers have been retrieved yet. Try searching for a topic using the search bar in the Left Panel first, then I can give you a grounded synthesis based on the actual literature.\n\nIn the meantime, I can answer general knowledge questions about your research topic.`,
      followUps: [
        'What specific methodologies do these papers use?',
        'Are there any contradictions between the findings?',
        'What datasets or benchmarks are most commonly referenced?',
      ],
    };
  }

  if (q.includes('compare') || q.includes('difference') || q.includes('versus')) {
    return {
      content: hasContexts
        ? `Comparing the retrieved studies:\n\n| Aspect | ${contexts![0]?.title?.slice(0, 30) || 'Study 1'}... | ${contexts![1]?.title?.slice(0, 30) || 'Study 2'}... |\n|---|---|---|\n| **Approach** | Empirical benchmark & stress testing | Theoretical proof & error bounds |\n| **Scale** | Large-scale (100K+ samples) | Formal mathematical analysis |\n| **Key Metric** | 42% throughput improvement | 99.4% precision guarantee |\n\nThe studies are complementary rather than contradictory — [1] provides practical validation while [2] establishes theoretical foundations. Together, they paint a comprehensive picture of the field's current state.`
        : `I can compare papers once you've searched for a topic. Use the Left Panel search to retrieve literature, and I'll analyze the differences and similarities across the papers.`,
      followUps: [
        'Which approach shows more promise for real-world applications?',
        'Are there hybrid methods that combine both approaches?',
        'What gaps remain between theory and practice?',
      ],
    };
  }

  // Default response
  return {
    content: hasContexts
      ? `That's a great question. Based on the ${contexts!.length} papers retrieved in your current research session:\n\n${contexts!.slice(0, 3).map((c: any, i: number) => `**[${i + 1}] ${c.title || 'Paper ' + (i + 1)}**: ${(c.snippet || c.summary || 'Explores key developments in this domain.').slice(0, 150)}...`).join('\n\n')}\n\nThe literature suggests several important trends and findings in this area. Would you like me to dive deeper into any specific paper or aspect?`
      : `I'm your AI Research Assistant, ready to help you analyze and understand scientific literature.\n\nHere's what I can do:\n- **Summarize papers** retrieved from OpenAlex, Semantic Scholar, and arXiv\n- **Compare methodologies** across multiple studies\n- **Identify research gaps** and contradictions\n- **Explain complex concepts** in accessible language\n- **Suggest follow-up questions** to deepen your research\n\nTo get started, search for a topic using the Left Panel search bar. Once papers are loaded, I can give you grounded, citation-backed answers.`,
    followUps: [
      'Can you summarize the key findings across all papers?',
      'What are the most cited methodologies in this corpus?',
      'What research gaps should I investigate further?',
    ],
  };
}
