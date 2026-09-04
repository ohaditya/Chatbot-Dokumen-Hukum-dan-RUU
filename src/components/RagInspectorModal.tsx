import React, { useState } from 'react';
import { X, Cpu, Search, Sparkles, Filter, CheckCircle2, Clock, BarChart3, ChevronRight, FileText, AlertTriangle } from 'lucide-react';
import { RagInspection, CandidateScore } from '../types.ts';

interface RagInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inspection?: RagInspection;
  query: string;
}

export const RagInspectorModal: React.FC<RagInspectorModalProps> = ({
  isOpen,
  onClose,
  inspection,
  query,
}) => {
  const [activeTab, setActiveTab] = useState<'flow' | 'expansion' | 'hybrid' | 'rerank' | 'timings'>('flow');

  if (!isOpen || !inspection) return null;

  const { queryExpansion, hybridCandidates, selectedCandidates, executionTimeMs } = inspection;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0F1115]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16191E] border border-[#2D333B] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D333B] bg-[#0F1115]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Inspeksi Pipeline Advanced RAG
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                  {executionTimeMs.total}ms
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Audit transparansi: Pre-retrieval expansion, hybrid fusion rank (Dense + BM25), dan cross-encoder re-ranking
              </p>
            </div>
          </div>
          <button
            id="btn-close-rag-inspector"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#21262D] hover:bg-[#2D333B] border border-[#2D333B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#2D333B] bg-[#0D1117] overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('flow')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Pipeline Overview
          </button>
          <button
            onClick={() => setActiveTab('expansion')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'expansion'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 1. Pre-Retrieval ({queryExpansion.expandedQueries.length} Queries)
          </button>
          <button
            onClick={() => setActiveTab('hybrid')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hybrid'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> 2. Hybrid RRF ({hybridCandidates.length} Chunks)
          </button>
          <button
            onClick={() => setActiveTab('rerank')}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'rerank'
                ? 'border-indigo-500 text-indigo-300 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> 3. Post-Retrieval Re-Rank
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Query Summary Banner */}
          <div className="p-3.5 rounded-xl bg-[#0D1117] border border-[#2D333B] text-xs">
            <span className="text-slate-400 font-medium">Kueri Asli Pengguna:</span>
            <p className="text-slate-100 font-semibold mt-1 font-serif text-sm">
              "{query}"
            </p>
          </div>

          {/* TAB 1: FLOW OVERVIEW */}
          {activeTab === 'flow' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Alur Kerja Advanced RAG 4 Tahap
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-[#21262D] border border-[#2D333B] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-1">
                      <span>Tahap 1</span>
                      <span className="font-mono text-[11px] text-slate-400">{executionTimeMs.queryExpansion}ms</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mb-1">Pre-Retrieval</h5>
                    <p className="text-[11px] text-slate-400">
                      Query Rewriting &amp; Legal HyDE Expansion untuk menjembatani bahasa awam dengan terminologi perundang-undangan.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2D333B] text-[11px] text-indigo-300 font-medium">
                    {queryExpansion.legalTerms.length} istilah hukum teridentifikasi
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-[#21262D] border border-[#2D333B] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-blue-400 font-semibold mb-1">
                      <span>Tahap 2</span>
                      <span className="font-mono text-[11px] text-slate-400">{executionTimeMs.denseRetrieval + executionTimeMs.sparseRetrieval}ms</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mb-1">Hybrid Retrieval</h5>
                    <p className="text-[11px] text-slate-400">
                      Menggabungkan Dense Vector Search (Gemini Embedding) dengan Sparse BM25 Lexical Search via RRF.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2D333B] text-[11px] text-blue-300 font-medium">
                    RRF k=60 Fusion Weight
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-[#21262D] border border-[#2D333B] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-1">
                      <span>Tahap 3</span>
                      <span className="font-mono text-[11px] text-slate-400">{executionTimeMs.reranking}ms</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mb-1">Cross-Encoder Re-Rank</h5>
                    <p className="text-[11px] text-slate-400">
                      Penilaian relevansi pasal oleh LLM untuk mengeliminasi false-positive sebelum disintesis ke LLM.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2D333B] text-[11px] text-purple-300 font-medium">
                    {selectedCandidates.length} pasal terseleksi
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-xl bg-[#21262D] border border-[#2D333B] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                      <span>Tahap 4</span>
                      <span className="font-mono text-[11px] text-slate-400">{executionTimeMs.generation}ms</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200 mb-1">Grounded Synthesis</h5>
                    <p className="text-[11px] text-slate-400">
                      Penalaran hukum berbasis rujukan normatif ketat dengan penandaan status RUU vs UU Berlaku.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#2D333B] text-[11px] text-emerald-300 font-medium">
                    Grounding Citation Aktif
                  </div>
                </div>
              </div>

              {/* Latency Timing Bar */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-[#2D333B]">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Distribusi Waktu Eksekusi
                  </span>
                  <span className="font-mono text-white font-bold">{executionTimeMs.total} ms total</span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#21262D] overflow-hidden flex">
                  <div
                    style={{ width: `${Math.max(5, (executionTimeMs.queryExpansion / executionTimeMs.total) * 100)}%` }}
                    className="h-full bg-indigo-500"
                    title={`Query Expansion: ${executionTimeMs.queryExpansion}ms`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (executionTimeMs.denseRetrieval / executionTimeMs.total) * 100)}%` }}
                    className="h-full bg-blue-500"
                    title={`Dense Search: ${executionTimeMs.denseRetrieval}ms`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (executionTimeMs.sparseRetrieval / executionTimeMs.total) * 100)}%` }}
                    className="h-full bg-sky-500"
                    title={`Sparse BM25: ${executionTimeMs.sparseRetrieval}ms`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (executionTimeMs.reranking / executionTimeMs.total) * 100)}%` }}
                    className="h-full bg-purple-500"
                    title={`Re-ranking: ${executionTimeMs.reranking}ms`}
                  />
                  <div
                    style={{ width: `${Math.max(5, (executionTimeMs.generation / executionTimeMs.total) * 100)}%` }}
                    className="h-full bg-emerald-500"
                    title={`Generation: ${executionTimeMs.generation}ms`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> Expansion: {executionTimeMs.queryExpansion}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Dense: {executionTimeMs.denseRetrieval}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-500" /> Sparse: {executionTimeMs.sparseRetrieval}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" /> Re-rank: {executionTimeMs.reranking}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Generation: {executionTimeMs.generation}ms
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: QUERY EXPANSION & HYDE */}
          {activeTab === 'expansion' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Pemetaan Terminologi Hukum (Legal Ontology)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {queryExpansion.legalTerms.map((term, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Variasi Kueri Pencarian (Multi-Query Expansion)
                </h4>
                <div className="space-y-2">
                  {queryExpansion.expandedQueries.map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#21262D] border border-[#2D333B] text-xs flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#16191E] text-slate-400 font-mono flex items-center justify-center text-[11px] shrink-0 mt-0.5 border border-[#2D333B]">
                        {i + 1}
                      </span>
                      <span className="text-slate-200 font-mono">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {queryExpansion.hydeHypothesis && (
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    3. HyDE (Hypothetical Document Excerpt)
                  </h4>
                  <div className="p-3.5 rounded-xl bg-[#21262D] border border-indigo-500/30 text-xs text-indigo-200/90 leading-relaxed font-serif italic">
                    "{queryExpansion.hydeHypothesis}"
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    HyDE menghasilkan draf perumusan norma pasal hipotesis untuk meningkatkan kecocokan vektor dense embedding terhadap teks perundang-undangan.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HYBRID RRF CANDIDATES */}
          {activeTab === 'hybrid' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hasil Penggabungan Dense + Sparse (RRF Ranking)
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Formula: RRF = 0.55/(60+DenseRank) + 0.45/(60+SparseRank)
                </span>
              </div>

              <div className="space-y-2.5">
                {hybridCandidates.map((cand, idx) => {
                  const isRuu = cand.docType === 'RUU';
                  return (
                    <div
                      key={cand.chunkId}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        cand.selected
                          ? 'bg-indigo-950/30 border-indigo-500/50 ring-1 ring-indigo-500/30'
                          : 'bg-[#21262D] border-[#2D333B]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#16191E] text-slate-300 font-mono text-[11px] flex items-center justify-center font-bold border border-[#2D333B]">
                            #{idx + 1}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isRuu ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {cand.docType}
                          </span>
                          <span className="font-semibold text-slate-200">
                            {cand.docTitle} - {cand.pasal}
                          </span>
                        </div>

                        {/* Scores badge */}
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-blue-300 bg-[#0F1115] px-2 py-0.5 rounded border border-[#2D333B]" title="Dense Cosine Rank & Score">
                            Dense: #{cand.denseRank} ({cand.denseScore})
                          </span>
                          <span className="text-slate-300 bg-[#0F1115] px-2 py-0.5 rounded border border-[#2D333B]" title="Sparse BM25 Rank & Score">
                            Sparse: #{cand.sparseRank} ({cand.sparseScore})
                          </span>
                          <span className="text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-700/40 font-bold" title="Reciprocal Rank Fusion">
                            RRF: {cand.rrfScore}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 font-serif bg-[#0F1115] p-2.5 rounded-lg border border-[#2D333B]">
                        {cand.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: RERANK & SELECTED */}
          {activeTab === 'rerank' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Pasal Terpilih Setelah Cross-Encoder Re-Ranking ({selectedCandidates.length})
              </h4>

              <div className="space-y-3">
                {selectedCandidates.map((cand, idx) => (
                  <div
                    key={cand.chunkId}
                    className="p-4 rounded-xl bg-[#21262D] border border-indigo-500/40 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold text-[11px] border border-indigo-500/30">
                          Terpilih #{idx + 1}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {cand.docTitle}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-indigo-400 font-semibold">
                        Relevance Score: {cand.rerankScore !== undefined ? cand.rerankScore.toFixed(2) : '-'}
                      </span>
                    </div>

                    <div className="text-xs text-indigo-300 font-semibold mb-2">
                      {cand.bab ? `${cand.bab} • ` : ''}{cand.pasal} {cand.ayat ? `(${cand.ayat})` : ''}
                    </div>

                    <p className="text-xs text-slate-300 font-serif leading-relaxed bg-[#0F1115] p-3 rounded-lg border border-[#2D333B] whitespace-pre-line">
                      {cand.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
