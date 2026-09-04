import { GoogleGenAI, Type } from '@google/genai';
import { LegalDocument, LegalChunk, QueryExpansion, CandidateScore, RagInspection, LegalCitation } from '../src/types.ts';
import { INITIAL_DOCUMENTS, INITIAL_LEGAL_CHUNKS } from './legalData.ts';

// Shared server-side Gemini client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Resilient Gemini Content Generator with automatic model fallback
 * (Tries gemini-3.8-flash first, falls back to gemini-3.1-flash-lite on 503/high load)
 */
async function callGeminiGenerateContent(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    primaryModel?: string;
  }
) {
  const models = [
    params.primaryModel || 'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError: any = null;
  for (const model of models) {
    try {
      return await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini call with model ${model} encountered error, trying fallback if available:`, err?.message || err);
    }
  }
  throw lastError;
}

// In-Memory Database for Documents and Chunks
export const documentsStore: LegalDocument[] = [...INITIAL_DOCUMENTS];
export const chunksStore: LegalChunk[] = [...INITIAL_LEGAL_CHUNKS];

// Embedding cache: chunkId -> number[]
const embeddingCache = new Map<string, number[]>();

/**
 * Cosine similarity between two numerical vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generate embedding for text using gemini-embedding-2-preview
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const ai = getAiClient();
  if (!ai) {
    return generateFallbackEmbedding(text);
  }

  try {
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: text.slice(0, 2000),
    });

    // The SDK returns embeddings in result.embeddings
    const values = result.embeddings?.[0]?.values || (result as any).embedding?.values;
    if (Array.isArray(values) && values.length > 0) {
      return values;
    }
  } catch (error) {
    console.warn('Embedding API call error, falling back to semantic vector hash:', error);
  }

  return generateFallbackEmbedding(text);
}

/**
 * Deterministic semantic representation fallback if offline/no key
 */
function generateFallbackEmbedding(text: string): number[] {
  const dim = 64;
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    let hash = 0;
    for (let c = 0; c < w.length; c++) {
      hash = (hash << 5) - hash + w.charCodeAt(c);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    vec[idx] += 1 / (1 + Math.log(1 + words.length));
  }

  // Normalize
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += vec[i] * vec[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dim; i++) vec[i] /= norm;
  }
  return vec;
}

/**
 * Precompute initial chunk embeddings in background
 */
export async function warmUpEmbeddings(): Promise<void> {
  for (const chunk of chunksStore) {
    if (!embeddingCache.has(chunk.id)) {
      const textToEmbed = `${chunk.docTitle} ${chunk.bab || ''} ${chunk.pasal} ${chunk.ayat || ''} ${chunk.content}`;
      const emb = await getEmbedding(textToEmbed);
      embeddingCache.set(chunk.id, emb);
    }
  }
}

/**
 * ADVANCED RAG STEP 1: Pre-Retrieval Optimization
 * Query Expansion, Legal Term Mapping, Intent Classification, and HyDE
 */
export async function preRetrievalOptimization(
  userQuery: string,
  filterDocId?: string
): Promise<QueryExpansion> {
  const ai = getAiClient();

  const legalDictionary: Record<string, string[]> = {
    'pecat': ['Pemutusan Hubungan Kerja', 'PHK', 'Pasal 156', 'Uang Pesangon', 'UPMK', 'UU Cipta Kerja'],
    'pesangon': ['Uang Pesangon', 'UPMK', 'Uang Penggantian Hak', 'Pasal 156 UU Cipta Kerja'],
    'bocor': ['kegagalan pelindungan data pribadi', 'notifikasi 3 x 24 jam', 'Pasal 46 UU PDP', 'sanksi denda 2%'],
    'data pribadi': ['Subjek Data', 'Pengendali Data', 'UU No 27 Tahun 2022', 'Pasal 4', 'Pasal 65'],
    'pencemaran': ['menyerang kehormatan nama baik', 'Pasal 27A UU ITE 2024', 'delik aduan', 'Pasal 45 ayat 4'],
    'nama baik': ['Pasal 27A UU ITE', 'Pasal 45 ayat 4 UU ITE 2024', 'kepentingan umum'],
    'hoaks': ['pemberitahuan bohong', 'kerusuhan masyarakat', 'Pasal 28 ayat 3 UU ITE', 'Pasal 45A ayat 3'],
    'aset': ['Perampasan Aset in rem', 'Aset Tindak Pidana', 'non-conviction based', 'RUU Perampasan Aset', 'unexplained wealth', 'Pasal 5'],
    'koruptor': ['Perampasan Aset', 'aset tindak pidana korupsi', 'Pasal 6 RUU Perampasan Aset'],
    'kontrak': ['Perjanjian Kerja Waktu Tertentu', 'PKWT', 'uang kompensasi', 'Pasal 61A UU Ketenagakerjaan'],
    'hukum mati': ['pidana mati', 'masa percobaan 10 tahun', 'Pasal 100 KUHP Baru'],
    'living law': ['hukum yang hidup dalam masyarakat', 'Pasal 2 KUHP Baru', 'hukum adat'],
  };

  // Find heuristic terms
  const lowerQuery = userQuery.toLowerCase();
  const detectedLegalTerms: string[] = [];
  for (const [key, terms] of Object.entries(legalDictionary)) {
    if (lowerQuery.includes(key)) {
      detectedLegalTerms.push(...terms);
    }
  }

  // LLM Query Expansion if available
  if (ai) {
    try {
      const prompt = `Anda adalah Spesialis Information Retrieval Sistem Hukum Indonesia (Advanced RAG).
Tugas Anda melakukan Query Rewriting & Expansion untuk kueri tanya jawab hukum/RUU.
Kueri Pengguna: "${userQuery}"

Lakukan tugas berikut:
1. Identifikasi intent: KONSULTASI_HUKUM, SANKSI_PIDANA, ANALISIS_RUU, PERBANDINGAN_PASAL, atau UMUM.
2. Identifikasi terminologi hukum baku Indonesia yang relevan (misal: "PHK", "Pasal 156", "In Rem", "Denda Administratif", "Delik Aduan").
3. Buat 3 variasi kueri pencarian (expanded queries):
   - Satu kueri formal berfokus pada pasal/regulasi
   - Satu kueri berfokus pada rumusan delik atau hak/kewajiban
   - Satu kueri berupa ringkasan normatif (HyDE - Hypothetical Document Excerpt 1-2 kalimat)
4. Deteksi apakah ada filter dokumen spesifik yang dimaksud (e.g. "ruu-perampasan-aset", "uu-pdp-2022", "uu-ite-2024", "uu-kuhp-2023", "uu-cipta-kerja-ketenagakerjaan").`;

      const response = await callGeminiGenerateContent(ai, {
        primaryModel: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intent: {
                type: Type.STRING,
                description: 'KONSULTASI_HUKUM | SANKSI_PIDANA | ANALISIS_RUU | PERBANDINGAN_PASAL | UMUM',
              },
              legalTerms: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              expandedQueries: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              hydeHypothesis: {
                type: Type.STRING,
                description: 'Hypothetical legal formulation in Indonesian statutory style',
              },
              detectedDocFilter: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['intent', 'legalTerms', 'expandedQueries'],
          },
        },
      });

      const parsed = JSON.parse(response.text.trim());
      return {
        originalQuery: userQuery,
        legalTerms: Array.from(new Set([...detectedLegalTerms, ...(parsed.legalTerms || [])])),
        expandedQueries: parsed.expandedQueries || [userQuery],
        intent: parsed.intent || 'KONSULTASI_HUKUM',
        detectedDocFilter: filterDocId ? [filterDocId] : parsed.detectedDocFilter,
        hydeHypothesis: parsed.hydeHypothesis,
      };
    } catch (err) {
      console.warn('LLM query expansion failed, using rule-based expansion:', err);
    }
  }

  // Fallback rule-based expansion
  const expanded = [
    userQuery,
    `${userQuery} ${detectedLegalTerms.slice(0, 3).join(' ')}`,
    detectedLegalTerms.join(' '),
  ].filter(Boolean);

  return {
    originalQuery: userQuery,
    legalTerms: detectedLegalTerms.length > 0 ? detectedLegalTerms : ['ketentuan hukum', 'pasal', 'peraturan perundang-undangan'],
    expandedQueries: expanded,
    intent: lowerQuery.includes('sanksi') || lowerQuery.includes('hukuman') || lowerQuery.includes('denda') ? 'SANKSI_PIDANA' : 'KONSULTASI_HUKUM',
    detectedDocFilter: filterDocId ? [filterDocId] : undefined,
    hydeHypothesis: detectedLegalTerms.length > 0 ? `Berdasarkan ketentuan perundang-undangan, ${detectedLegalTerms.join(', ')} mengatur mengenai hak dan kewajiban serta sanksi terkait.` : undefined,
  };
}

/**
 * ADVANCED RAG STEP 2: Sparse BM25 / Lexical Search
 */
function computeSparseScores(query: string, legalTerms: string[], targetChunks: LegalChunk[]): Map<string, number> {
  const queryTokens = (query + ' ' + legalTerms.join(' '))
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scores = new Map<string, number>();

  // Term frequencies & inverted index match
  for (const chunk of targetChunks) {
    const chunkText = `${chunk.docTitle} ${chunk.bab || ''} ${chunk.pasal} ${chunk.ayat || ''} ${chunk.content} ${chunk.explanation || ''}`.toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      // Exact Pasal match bonus
      if (chunk.pasal.toLowerCase().includes(token)) {
        score += 10.0;
      }
      // Exact Ayat or Bab match
      if (chunk.ayat && chunk.ayat.toLowerCase().includes(token)) {
        score += 4.0;
      }
      if (chunk.bab && chunk.bab.toLowerCase().includes(token)) {
        score += 3.0;
      }
      // Word occurrence count
      const occurrences = (chunkText.match(new RegExp(`\\b${token}\\b`, 'g')) || []).length;
      if (occurrences > 0) {
        score += 1.5 * Math.log(1 + occurrences);
      } else if (chunkText.includes(token)) {
        score += 0.5;
      }
    }

    scores.set(chunk.id, score);
  }

  return scores;
}

/**
 * ADVANCED RAG STEP 3: Hybrid Retrieval with Reciprocal Rank Fusion (RRF)
 */
export async function hybridRetrieval(
  expansion: QueryExpansion,
  filterDocId?: string
): Promise<{ hybridCandidates: CandidateScore[]; timings: { dense: number; sparse: number; fusion: number } }> {
  const startTime = Date.now();

  // Filter chunks if specific document is requested
  let targetChunks = chunksStore;
  if (filterDocId && filterDocId !== 'all') {
    targetChunks = chunksStore.filter((c) => c.docId === filterDocId);
  }

  // 1. Dense retrieval
  const denseStart = Date.now();
  const queryEmbeddingText = `${expansion.originalQuery} ${expansion.legalTerms.join(' ')} ${expansion.hydeHypothesis || ''}`;
  const queryEmbedding = await getEmbedding(queryEmbeddingText);

  const denseScoresList: { chunkId: string; score: number }[] = [];
  for (const chunk of targetChunks) {
    let chunkEmb = embeddingCache.get(chunk.id);
    if (!chunkEmb) {
      const textToEmbed = `${chunk.docTitle} ${chunk.bab || ''} ${chunk.pasal} ${chunk.ayat || ''} ${chunk.content}`;
      chunkEmb = await getEmbedding(textToEmbed);
      embeddingCache.set(chunk.id, chunkEmb);
    }
    const score = cosineSimilarity(queryEmbedding, chunkEmb);
    denseScoresList.push({ chunkId: chunk.id, score });
  }

  // Sort descending by dense score
  denseScoresList.sort((a, b) => b.score - a.score);
  const denseRanks = new Map<string, { rank: number; score: number }>();
  denseScoresList.forEach((item, index) => {
    denseRanks.set(item.chunkId, { rank: index + 1, score: item.score });
  });
  const denseTime = Date.now() - denseStart;

  // 2. Sparse retrieval
  const sparseStart = Date.now();
  const sparseScoresMap = computeSparseScores(expansion.originalQuery, expansion.legalTerms, targetChunks);
  const sparseScoresList = Array.from(sparseScoresMap.entries()).map(([chunkId, score]) => ({ chunkId, score }));
  sparseScoresList.sort((a, b) => b.score - a.score);
  const sparseRanks = new Map<string, { rank: number; score: number }>();
  sparseScoresList.forEach((item, index) => {
    sparseRanks.set(item.chunkId, { rank: index + 1, score: item.score });
  });
  const sparseTime = Date.now() - sparseStart;

  // 3. Reciprocal Rank Fusion (RRF)
  const fusionStart = Date.now();
  const k = 60; // Standard RRF smoothing constant
  const denseWeight = 0.55;
  const sparseWeight = 0.45;

  const candidateScores: CandidateScore[] = [];

  for (const chunk of targetChunks) {
    const denseInfo = denseRanks.get(chunk.id) || { rank: 999, score: 0 };
    const sparseInfo = sparseRanks.get(chunk.id) || { rank: 999, score: 0 };

    // RRF Score formula
    const denseRrf = denseWeight * (1 / (k + denseInfo.rank));
    const sparseRrf = sparseWeight * (1 / (k + sparseInfo.rank));
    const totalRrf = denseRrf + sparseRrf;

    candidateScores.push({
      chunkId: chunk.id,
      docId: chunk.docId,
      docTitle: chunk.docTitle,
      docType: chunk.docType,
      pasal: chunk.pasal,
      ayat: chunk.ayat,
      bab: chunk.bab,
      content: chunk.content,
      denseRank: denseInfo.rank,
      denseScore: Number(denseInfo.score.toFixed(4)),
      sparseRank: sparseInfo.rank,
      sparseScore: Number(sparseInfo.score.toFixed(2)),
      rrfScore: Number(totalRrf.toFixed(5)),
      selected: false,
    });
  }

  // Sort by RRF score descending
  candidateScores.sort((a, b) => b.rrfScore - a.rrfScore);
  const fusionTime = Date.now() - fusionStart;

  return {
    hybridCandidates: candidateScores,
    timings: {
      dense: denseTime,
      sparse: sparseTime,
      fusion: fusionTime,
    },
  };
}

/**
 * ADVANCED RAG STEP 4: Cross-Encoder / LLM Re-Ranking & Context Filtering
 */
export async function crossEncoderRerank(
  query: string,
  candidates: CandidateScore[],
  topK: number = 4
): Promise<{ reranked: CandidateScore[]; timing: number }> {
  const rerankStart = Date.now();
  const pool = candidates.slice(0, 10); // Evaluate top-10 hybrid candidates

  const ai = getAiClient();
  if (ai && pool.length > 0) {
    try {
      const candidateSnippets = pool
        .map(
          (c, idx) =>
            `[ID: ${c.chunkId}] (Index ${idx}) Dokumen: ${c.docTitle} - ${c.pasal}: ${c.content.slice(0, 300)}...`
        )
        .join('\n\n');

      const rerankPrompt = `Anda adalah Re-ranker Hukum AI untuk sistem Advanced RAG.
Kueri Pengguna: "${query}"

Kandidat Pasal/Dokumen Hukum:
${candidateSnippets}

Tugas:
Nilai relevansi hukum setiap kandidat terhadap kueri pengguna dengan skor 0.0 hingga 1.0 (di mana 1.0 adalah pasal yang menjawab langsung, 0.0 sama sekali tidak relevan).
Urutkan kembali kandidat berdasarkan skor tertinggi.`;

      const response = await callGeminiGenerateContent(ai, {
        primaryModel: 'gemini-3.8-flash',
        contents: rerankPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                chunkId: { type: Type.STRING },
                relevanceScore: { type: Type.NUMBER },
                rationale: { type: Type.STRING },
              },
              required: ['chunkId', 'relevanceScore'],
            },
          },
        },
      });

      const scoresArray: { chunkId: string; relevanceScore: number }[] = JSON.parse(response.text.trim());
      const scoreMap = new Map<string, number>();
      scoresArray.forEach((s) => scoreMap.set(s.chunkId, s.relevanceScore));

      pool.forEach((c) => {
        c.rerankScore = scoreMap.has(c.chunkId) ? scoreMap.get(c.chunkId) : c.rrfScore * 10;
      });

      pool.sort((a, b) => (b.rerankScore || 0) - (a.rerankScore || 0));
    } catch (err) {
      console.warn('Cross-encoder reranking failed, defaulting to RRF scores:', err);
      pool.forEach((c) => {
        c.rerankScore = c.rrfScore;
      });
    }
  } else {
    pool.forEach((c) => {
      c.rerankScore = c.rrfScore;
    });
  }

  // Mark topK as selected
  pool.slice(0, topK).forEach((c) => {
    c.selected = true;
  });

  return {
    reranked: pool,
    timing: Date.now() - rerankStart,
  };
}

/**
 * ADVANCED RAG STEP 5: Grounded Legal Generation with Citations & RUU Status Distinctions
 */
export async function generateGroundedLegalAnswer(
  userQuery: string,
  selectedChunks: CandidateScore[],
  expansion: QueryExpansion
): Promise<{ answer: string; citations: LegalCitation[]; timing: number }> {
  const genStart = Date.now();
  const ai = getAiClient();

  // Create citations list
  const citations: LegalCitation[] = selectedChunks.map((c) => ({
    id: c.chunkId,
    docId: c.docId,
    docTitle: c.docTitle,
    docType: c.docType,
    pasal: c.pasal,
    ayat: c.ayat,
    bab: c.bab,
    content: c.content,
    relevanceScore: c.rerankScore || c.rrfScore,
  }));

  // Build Context with clear RUU vs UU distinctions
  const contextText = selectedChunks
    .map((c, i) => {
      const doc = documentsStore.find((d) => d.id === c.docId);
      const isRuu = c.docType === 'RUU' || (doc && doc.status.includes('RUU'));
      const statusBadge = isRuu ? '[STATUS: RANCANGAN UNDANG-UNDANG (RUU) - BELUM DISAHKAN]' : '[STATUS: HUKUM POSITIF BERLAKU]';

      return `--- DOKUMEN [${i + 1}]: ${c.docTitle} ${statusBadge} ---
Bab/Bagian: ${c.bab || '-'}
Pasal: ${c.pasal} ${c.ayat ? `(${c.ayat})` : ''}
Isi Ketentuan:
${c.content}
`;
    })
    .join('\n\n');

  if (!ai) {
    // Return grounded fallback if no API key
    const fallbackAnswer = `### Analisis Hukum Berdasarkan Dokumen Terkait

Berdasarkan penelusuran dokumen hukum dan RUU yang tersedia, berikut ringkasan ketentuan terkait:

${selectedChunks
  .map(
    (c) => `* **${c.docTitle} - ${c.pasal}**:
${c.content.slice(0, 200)}...`
  )
  .join('\n\n')}

*Catatan: Konfigurasi GEMINI_API_KEY aktif diperlukan untuk penalaran hukum penuh dan penulisan pertimbangan hukum komprehensif.*`;

    return {
      answer: fallbackAnswer,
      citations,
      timing: Date.now() - genStart,
    };
  }

  const systemInstruction = `Anda adalah Asisten Pakar Hukum Indonesia & Analis Regulasi (Advanced Legal AI).
Anda bertugas menjawab pertanyaan tanya jawab dokumen hukum dan RUU secara objektif, presisi, mendalam, dan berbasis rujukan normatif (grounded citation).

PEDOMAN PENTING & PRINSIP HUKUM:
1. Grounding Ketat: Gunakan HANYA ketentuan dari Konteks Dokumen Hukum yang disediakan. Jangan mengarang pasal atau nomor undang-undang di luar teks.
2. Pembedaan RUU vs UU Berlaku:
   - Jika dokumen berstatus "RUU" (Rancangan Undang-Undang seperti RUU Perampasan Aset), Anda WAJIB memberikan penegasan bahwa ketentuan tersebut masih berupa rancangan/draf di parlemen dan belum berlaku sebagai hukum positif.
   - Jika dokumen berstatus UU Berlaku (UU PDP, UU ITE 2024, KUHP Baru, UU Cipta Kerja), jelaskan sebagai hukum positif yang berlaku atau sertakan masa transisi jika ada (misal KUHP Baru berlaku 2026).
3. Format Sitasi & Kutipan:
   - Setiap rujukan wajib menyebutkan nama dokumen serta Pasal dan Ayat yang spesifik, contoh: "[UU PDP, Pasal 46 ayat (1)]" atau "[RUU Perampasan Aset, Pasal 6 ayat (1)]".
4. Sistematika Jawaban:
   - **Ringkasan Inti**: Jawaban langsung yang padat terhadap pertanyaan pengguna.
   - **Dasar Hukum & Ketentuan Pasal**: Uraian pasal per pasal dengan kutipan inti bunyinya.
   - **Analisis & Implikasi Hukum**: Penjelasan implikasi praktis (misal sanksi, prosedur penegakan, atau perlindungan pihak ketiga).
   - **Catatan Status Regulasi**: Penegasan status pemberlakuan dokumen.
5. Bahasa: Gunakan bahasa Indonesia baku, formal, jernih, dan berwibawa khas terminologi hukum nasional.`;

  const userPrompt = `Pertanyaan Pengguna:
${userQuery}

Terminologi Hukum Terkait: ${expansion.legalTerms.join(', ')}

Konteks Dokumen & Pasal Hasil Seleksi Advanced RAG:
${contextText}

Berikan jawaban hukum yang komprehensif dan tersitasi dengan baik sesuai pedoman di atas.`;

  try {
    const response = await callGeminiGenerateContent(ai, {
      primaryModel: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual precision
      },
    });

    const answer = response.text || 'Maaf, tidak dapat menghasilkan jawaban hukum.';

    return {
      answer,
      citations,
      timing: Date.now() - genStart,
    };
  } catch (error: any) {
    console.error('Generation error:', error);
    return {
      answer: `Terjadi kendala saat menyusun jawaban hukum: ${error.message || 'Kesalahan API'}. Silakan periksa kredensial API Key pada menu Settings > Secrets.`,
      citations,
      timing: Date.now() - genStart,
    };
  }
}

/**
 * Ingest new custom legal document and chunk into the RAG knowledge base
 */
export async function ingestCustomDocument(params: {
  title: string;
  shortTitle: string;
  type: 'RUU' | 'UU' | 'PERPRES' | 'PP' | 'CUSTOM';
  category: string;
  description: string;
  rawText: string;
}): Promise<{ doc: LegalDocument; chunksCount: number }> {
  const docId = `custom-${Date.now()}`;
  const doc: LegalDocument = {
    id: docId,
    title: params.title,
    shortTitle: params.shortTitle || params.title.slice(0, 25),
    nomor: `Kustom-${new Date().getFullYear()}`,
    tahun: new Date().getFullYear(),
    type: params.type || 'CUSTOM',
    status: params.type === 'RUU' ? 'Rancangan (RUU)' : 'Kustom',
    statusDescription: 'Dokumen yang diunggah oleh pengguna ke basis data RAG.',
    category: params.category || 'Dokumen Hukum Kustom',
    description: params.description || 'Dokumen hukum kustom yang diunggah pengguna.',
    totalArticles: 0,
    totalChapters: 0,
  };

  // Legal Chunker: Splits by "BAB", "Pasal", etc.
  const raw = params.rawText;
  const lines = raw.split('\n');
  const generatedChunks: LegalChunk[] = [];

  let currentBab = 'KETENTUAN UMUM';
  let currentPasal = 'Pasal 1';
  let currentContent: string[] = [];
  let articleCount = 0;
  let chapterCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Detect BAB
    if (/^BAB\s+[IVXLCDM0-9]+/i.test(line)) {
      chapterCount++;
      currentBab = line;
      continue;
    }

    // Detect Pasal
    const pasalMatch = line.match(/^Pasal\s+(\d+[A-Za-z]?)/i);
    if (pasalMatch) {
      if (currentContent.length > 0) {
        generatedChunks.push({
          id: `${docId}-chunk-${generatedChunks.length + 1}`,
          docId,
          docTitle: doc.title,
          docType: doc.type,
          bab: currentBab,
          pasal: currentPasal,
          content: currentContent.join('\n'),
        });
        currentContent = [];
      }
      currentPasal = `Pasal ${pasalMatch[1]}`;
      articleCount++;
      currentContent.push(line);
    } else {
      currentContent.push(line);
    }
  }

  // Final chunk
  if (currentContent.length > 0) {
    generatedChunks.push({
      id: `${docId}-chunk-${generatedChunks.length + 1}`,
      docId,
      docTitle: doc.title,
      docType: doc.type,
      bab: currentBab,
      pasal: currentPasal,
      content: currentContent.join('\n'),
    });
  }

  // If no "Pasal" was found, chunk into paragraph segments
  if (generatedChunks.length === 0 && raw.trim().length > 0) {
    const paragraphs = raw.split(/\n\s*\n/);
    paragraphs.forEach((p, idx) => {
      if (p.trim()) {
        generatedChunks.push({
          id: `${docId}-chunk-${idx + 1}`,
          docId,
          docTitle: doc.title,
          docType: doc.type,
          bab: 'BAGIAN ' + (idx + 1),
          pasal: `Bagian/Paragraf ${idx + 1}`,
          content: p.trim(),
        });
      }
    });
    articleCount = generatedChunks.length;
  }

  doc.totalArticles = articleCount || 1;
  doc.totalChapters = chapterCount || 1;

  // Add to stores
  documentsStore.unshift(doc);
  chunksStore.push(...generatedChunks);

  // Compute embeddings in background
  for (const chunk of generatedChunks) {
    const textToEmbed = `${chunk.docTitle} ${chunk.bab || ''} ${chunk.pasal} ${chunk.content}`;
    getEmbedding(textToEmbed).then((emb) => {
      embeddingCache.set(chunk.id, emb);
    });
  }

  return {
    doc,
    chunksCount: generatedChunks.length,
  };
}
