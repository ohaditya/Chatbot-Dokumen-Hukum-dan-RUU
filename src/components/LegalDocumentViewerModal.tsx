import React, { useState, useEffect } from 'react';
import { X, BookOpen, Search, Scale, AlertCircle, FileText, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';
import { LegalDocument, LegalChunk } from '../types.ts';

interface LegalDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocument;
  documents: LegalDocument[];
  targetPasal?: string;
}

export const LegalDocumentViewerModal: React.FC<LegalDocumentViewerModalProps> = ({
  isOpen,
  onClose,
  initialDoc,
  documents,
  targetPasal,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | undefined>(initialDoc || documents[0]);
  const [chunks, setChunks] = useState<LegalChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialDoc) {
      setSelectedDoc(initialDoc);
    } else if (!selectedDoc && documents.length > 0) {
      setSelectedDoc(documents[0]);
    }
  }, [initialDoc, documents]);

  useEffect(() => {
    if (targetPasal) {
      setSearchQuery(targetPasal);
    }
  }, [targetPasal]);

  useEffect(() => {
    if (!selectedDoc) return;
    setLoading(true);
    fetch(`/api/documents/${selectedDoc.id}/chunks`)
      .then((res) => res.json())
      .then((data) => {
        if (data.chunks) {
          setChunks(data.chunks);
        }
      })
      .catch((err) => console.error('Failed to load chunks:', err))
      .finally(() => setLoading(false));
  }, [selectedDoc]);

  if (!isOpen) return null;

  const filteredChunks = chunks.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.pasal.toLowerCase().includes(q) ||
      (c.bab && c.bab.toLowerCase().includes(q)) ||
      c.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0F1115]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16191E] border border-[#2D333B] rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D333B] bg-[#0F1115]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Basis Data Dokumen Hukum &amp; RUU
              </h3>
              <p className="text-xs text-slate-400">
                Kompilasi regulasi resmi, draf RUU prioritas, dan naskah pasal terverifikasi
              </p>
            </div>
          </div>

          <button
            id="btn-close-doc-viewer"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#21262D] hover:bg-[#2D333B] border border-[#2D333B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Column Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Document List */}
          <div className="w-full md:w-80 border-r border-[#2D333B] bg-[#0D1117] p-4 flex flex-col gap-2 overflow-y-auto shrink-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Pilih Dokumen Regulasi
            </div>

            {documents.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              const isRuu = doc.type === 'RUU';

              return (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoc(doc);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-[#21262D] border-indigo-500/50 text-white shadow-sm ring-1 ring-indigo-500/30'
                      : 'bg-[#16191E] border-[#2D333B] text-slate-300 hover:bg-[#21262D] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        isRuu
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {doc.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {doc.tahun}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs leading-snug line-clamp-2">
                    {doc.shortTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {doc.nomor}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Document Details & Article Browser */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#16191E]">
            {selectedDoc ? (
              <>
                {/* Document Header Details */}
                <div className="p-5 border-b border-[#2D333B] bg-[#0D1117] shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            selectedDoc.type === 'RUU'
                              ? 'bg-red-500/15 text-red-400 border-red-500/30'
                              : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          Status: {selectedDoc.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {selectedDoc.nomor} • {selectedDoc.tahun}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-white font-serif leading-snug">
                        {selectedDoc.title}
                      </h2>
                    </div>

                    {selectedDoc.sourceUrl && (
                      <a
                        href={selectedDoc.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 font-medium"
                      >
                        Sumber Resmi <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Status Note Banner if RUU */}
                  {selectedDoc.type === 'RUU' && (
                    <div className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-200/90 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Peringatan Status RUU:</strong> {selectedDoc.statusDescription}
                      </div>
                    </div>
                  )}

                  <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                    {selectedDoc.description}
                  </p>

                  {/* Search within document */}
                  <div className="mt-3 relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari pasal, kata kunci, atau ayat dalam dokumen ini..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0F1115] border border-[#2D333B] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Articles List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {loading ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                      Memuat daftar pasal dan naskah hukum...
                    </div>
                  ) : filteredChunks.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-400">
                      Tidak ditemukan pasal yang cocok dengan pencarian "{searchQuery}".
                    </div>
                  ) : (
                    filteredChunks.map((chunk) => (
                      <div
                        key={chunk.id}
                        id={`chunk-${chunk.id}`}
                        className="p-4 rounded-xl bg-[#21262D] border border-[#2D333B] hover:border-indigo-500/30 transition-colors"
                      >
                        {chunk.bab && (
                          <div className="text-[11px] font-bold text-indigo-400 tracking-wide uppercase mb-1">
                            {chunk.bab}
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-white font-serif">
                            {chunk.pasal} {chunk.ayat ? `(${chunk.ayat})` : ''}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500">
                            ID: {chunk.id}
                          </span>
                        </div>

                        <div className="text-xs text-slate-200 font-serif leading-relaxed whitespace-pre-line bg-[#0F1115] p-3 rounded-lg border border-[#2D333B]">
                          {chunk.content}
                        </div>

                        {chunk.explanation && (
                          <div className="mt-2.5 pt-2 border-t border-[#2D333B] text-[11px] text-slate-400 leading-relaxed">
                            <span className="text-indigo-400 font-semibold mr-1">Penjelasan Resmi:</span>
                            {chunk.explanation}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                Pilih dokumen di panel kiri untuk membaca naskah pasal.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
