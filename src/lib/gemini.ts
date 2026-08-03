import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
const model = process.env.LLM_MODEL || 'gemini-2.5-flash';

let genai: GoogleGenAI | null = null;
if (apiKey) {
  genai = new GoogleGenAI({ apiKey });
}

/**
 * Synthesize a research answer from sources.
 */
export async function synthesize(
  query: string,
  sources: { title: string; url: string; snippet: string; id: string }[],
  mode: 'quick' | 'deep'
): Promise<{ answer: string; concepts: string[]; followUps: string[] }> {
  if (!genai) {
    return getMockSynthesis(query);
  }

  const sourceContext = sources
    .map((s, i) => `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.snippet}`)
    .join('\n\n');

  const prompt = `You are an expert research assistant. Synthesize these sources to answer the question.

QUESTION: ${query}
MODE: ${mode === 'deep' ? 'Comprehensive analysis' : 'Concise answer'}

SOURCES:
${sourceContext}

Respond with VALID JSON ONLY:
{
  "answer": "Markdown answer with [1][2] citation markers",
  "concepts": ["Key Concept 1", "Key Concept 2", "Key Concept 3", "Key Concept 4", "Key Concept 5"],
  "followUps": ["Follow-up question 1", "Follow-up question 2", "Follow-up question 3"]
}`;

  try {
    const response = await genai.models.generateContent({
      model,
      contents: prompt,
      config: { maxOutputTokens: mode === 'deep' ? 4096 : 2048, temperature: 0.7, responseMimeType: 'application/json' },
    });

    const raw = response.text || '';
    const cleaned = raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Gemini synthesis error:', err);
    return getMockSynthesis(query);
  }
}

/**
 * Extract key concepts from text using Gemini.
 */
export async function extractConcepts(text: string): Promise<string[]> {
  if (!genai) {
    return ['Core Principle', 'Methodology', 'Application', 'Future Direction'];
  }

  try {
    const response = await genai.models.generateContent({
      model,
      contents: `Extract 4-6 key concepts/topics from this text. Return ONLY a JSON array of strings:\n\n${text.slice(0, 3000)}`,
      config: { maxOutputTokens: 256, temperature: 0.3, responseMimeType: 'application/json' },
    });
    const raw = response.text || '[]';
    return JSON.parse(raw.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim());
  } catch {
    return ['Core Principle', 'Methodology', 'Application', 'Future Direction'];
  }
}

function getMockSynthesis(query: string) {
  const topic = query.replace(/^(what is|how does|explain|analyze|tell me about|what are)\s+/i, '');
  return {
    answer: `## Research Summary: ${topic}\n\nRecent advances in **${topic}** show significant progress across multiple domains [1]. Key research demonstrates scalable architectures and optimized performance [2].\n\n### Key Findings\n- Enhanced efficiency through streamlined methodologies [3]\n- Robust reliability under high-demand conditions [4]\n- Strong integration potential with existing frameworks [5]\n\n### Future Outlook\nOngoing research focuses on scalability and real-world deployment of ${topic} technologies [4][5].`,
    concepts: [`${topic} Fundamentals`, 'Scalability', 'Performance Optimization', 'Integration', 'Future Applications'],
    followUps: [
      `What are the main challenges in ${topic}?`,
      `How does ${topic} compare to alternatives?`,
      `What are future trends in ${topic}?`,
    ],
  };
}
