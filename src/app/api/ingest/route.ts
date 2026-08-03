import { NextResponse } from 'next/server';
import { extractConcepts } from '@/lib/gemini';
import { addChunks } from '@/lib/vectorStore';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let text: string;

    if (file.type === 'application/pdf') {
      // Dynamic import pdf-parse for server-side only
      const pdfModule: any = await import('pdf-parse');
      const pdfParse = pdfModule.default || pdfModule;
      const buffer = Buffer.from(await file.arrayBuffer());
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;
    } else {
      // Plain text / markdown
      text = await file.text();
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 });
    }

    // Chunk the text (simple 500-char chunks with overlap)
    const chunkSize = 500;
    const overlap = 100;
    const chunks: { id: string; text: string; metadata: Record<string, string> }[] = [];

    for (let i = 0; i < text.length; i += chunkSize - overlap) {
      const chunkText = text.slice(i, i + chunkSize).trim();
      if (chunkText.length > 50) {
        chunks.push({
          id: nanoid(),
          text: chunkText,
          metadata: { source: file.name, chunkIndex: String(chunks.length) },
        });
      }
    }

    // Store in vector store
    addChunks(chunks);

    // Extract concepts
    const fullText = text.slice(0, 5000); // First 5k chars for concept extraction
    const concepts = await extractConcepts(fullText);

    const title = file.name.replace(/\.(pdf|txt|md)$/i, '');

    return NextResponse.json({
      documentId: nanoid(),
      title,
      chunks: chunks.length,
      concepts,
    });
  } catch (err) {
    console.error('Ingest API error:', err);
    return NextResponse.json({ error: 'Ingestion failed' }, { status: 500 });
  }
}
