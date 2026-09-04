export type DocumentType = 'RUU' | 'UU' | 'PERPRES' | 'PP' | 'CUSTOM';

export interface LegalDocument {
  id: string;
  title: string;
  shortTitle: string;
  nomor: string;
  tahun: number;
  type: DocumentType;
  status: 'Rancangan (RUU)' | 'Berlaku' | 'Perubahan' | 'Kustom';
  statusDescription: string;
  category: string;
  description: string;
  totalArticles: number;
  totalChapters: number;
  datePromulgated?: string;
  sourceUrl?: string;
}

export interface LegalChunk {
  id: string;
  docId: string;
  docTitle: string;
  docType: DocumentType;
  bab?: string;
  bagian?: string;
  pasal: string;
  ayat?: string;
  content: string;
  explanation?: string; // Penjelasan Pasal
  embedding?: number[];
}

export interface QueryExpansion {
  originalQuery: string;
  legalTerms: string[];
  expandedQueries: string[];
  intent: 'KONSULTASI_HUKUM' | 'SANKSI_PIDANA' | 'ANALISIS_RUU' | 'PERBANDINGAN_PASAL' | 'UMUM';
  detectedDocFilter?: string[];
  hydeHypothesis?: string;
}

export interface CandidateScore {
  chunkId: string;
  docId: string;
  docTitle: string;
  docType: DocumentType;
  pasal: string;
  ayat?: string;
  bab?: string;
  content: string;
  denseRank: number;
  denseScore: number;
  sparseRank: number;
  sparseScore: number;
  rrfScore: number;
  rerankScore?: number;
  selected: boolean;
}

export interface RagInspection {
  queryExpansion: QueryExpansion;
  hybridCandidates: CandidateScore[];
  selectedCandidates: CandidateScore[];
  executionTimeMs: {
    queryExpansion: number;
    denseRetrieval: number;
    sparseRetrieval: number;
    fusion: number;
    reranking: number;
    generation: number;
    total: number;
  };
}

export interface LegalCitation {
  id: string;
  docId: string;
  docTitle: string;
  docType: DocumentType;
  pasal: string;
  ayat?: string;
  bab?: string;
  content: string;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: LegalCitation[];
  ragInspection?: RagInspection;
  error?: boolean;
}
