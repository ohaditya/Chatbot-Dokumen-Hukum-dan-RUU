import express from 'express';
import dotenv from 'dotenv';
import {
  documentsStore,
  chunksStore,
  preRetrievalOptimization,
  hybridRetrieval,
  crossEncoderRerank,
  generateGroundedLegalAnswer,
  ingestCustomDocument,
} from '../server/ragEngine.ts';
import { RagInspection } from '../src/types.ts';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    totalDocuments: documentsStore.length,
    totalChunks: chunksStore.length,
    timestamp: new Date().toISOString(),
  });
});

// Get all indexed documents
app.get('/api/documents', (req, res) => {
  res.json({
    documents: documentsStore,
    totalChunks: chunksStore.length,
  });
});

// Get chunks for a specific document
app.get('/api/documents/:id/chunks', (req, res) => {
  const docId = req.params.id;
  const doc = documentsStore.find((d) => d.id === docId);
  if (!doc) {
    return res.status(404).json({ error: 'Dokumen tidak ditemukan' });
  }
  const chunks = chunksStore.filter((c) => c.docId === docId);
  res.json({
    document: doc,
    chunks,
  });
});

// Ingest new custom document
app.post('/api/documents/ingest', async (req, res) => {
  try {
    const { title, shortTitle, type, category, description, rawText } = req.body;
    if (!title || !rawText) {
      return res.status(400).json({ error: 'Judul dan isi teks regulasi wajib diisi' });
    }

    const result = await ingestCustomDocument({
      title,
      shortTitle,
      type,
      category,
      description,
      rawText,
    });

    res.json({
      success: true,
      document: result.doc,
      chunksCreated: result.chunksCount,
    });
  } catch (error: any) {
    console.error('Ingest error:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses dokumen' });
  }
});

// Advanced RAG Chat endpoint
app.post('/api/rag/chat', async (req, res) => {
  const overallStartTime = Date.now();
  try {
    const { query, filterDocId } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong' });
    }

    const cleanQuery = query.trim();

    // STEP 1: Pre-Retrieval Optimization
    const expansionStart = Date.now();
    const expansion = await preRetrievalOptimization(cleanQuery, filterDocId);
    const expansionTime = Date.now() - expansionStart;

    // STEP 2: Hybrid Retrieval
    const effectiveFilter = filterDocId && filterDocId !== 'all' ? filterDocId : undefined;
    const { hybridCandidates, timings: hybridTimings } = await hybridRetrieval(expansion, effectiveFilter);

    // STEP 3: Post-Retrieval Cross-Encoder Re-Ranking
    const { reranked, timing: rerankTiming } = await crossEncoderRerank(cleanQuery, hybridCandidates, 4);
    const selectedCandidates = reranked.filter((c) => c.selected);

    // STEP 4: Grounded Legal Answer Generation
    const { answer, citations, timing: genTiming } = await generateGroundedLegalAnswer(
      cleanQuery,
      selectedCandidates,
      expansion
    );

    const totalTime = Date.now() - overallStartTime;

    const ragInspection: RagInspection = {
      queryExpansion: expansion,
      hybridCandidates: hybridCandidates.slice(0, 8),
      selectedCandidates,
      executionTimeMs: {
        queryExpansion: expansionTime,
        denseRetrieval: hybridTimings.dense,
        sparseRetrieval: hybridTimings.sparse,
        fusion: hybridTimings.fusion,
        reranking: rerankTiming,
        generation: genTiming,
        total: totalTime,
      },
    };

    res.json({
      answer,
      citations,
      ragInspection,
    });
  } catch (error: any) {
    console.error('Advanced RAG chat error:', error);
    res.status(500).json({
      error: error.message || 'Terjadi kesalahan pada sistem Advanced RAG',
    });
  }
});

export default app;
