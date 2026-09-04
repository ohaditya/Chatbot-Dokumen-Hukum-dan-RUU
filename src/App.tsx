import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Loader2,
  Trash2,
  Scale,
  Sparkles,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { PresetQuestions } from './components/PresetQuestions.tsx';
import { ChatMessageView } from './components/ChatMessageView.tsx';
import { RagInspectorModal } from './components/RagInspectorModal.tsx';
import { LegalDocumentViewerModal } from './components/LegalDocumentViewerModal.tsx';
import { UploadDocumentModal } from './components/UploadDocumentModal.tsx';
import { LegalDocument, ChatMessage, RagInspection } from './types.ts';

export default function App() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Modals state
  const [isRagInspectorOpen, setIsRagInspectorOpen] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<RagInspection | undefined>(undefined);
  const [currentInspectedQuery, setCurrentInspectedQuery] = useState('');

  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [viewerTargetDoc, setViewerTargetDoc] = useState<LegalDocument | undefined>(undefined);
  const [viewerTargetPasal, setViewerTargetPasal] = useState<string | undefined>(undefined);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load initial documents
  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((err) => console.error('Failed to load documents:', err));
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loadingPhase]);

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    // Dynamic phase indicator for Advanced RAG pipeline
    setLoadingPhase('1. Pre-Retrieval: Query Expansion & Legal Term Extraction...');
    const phaseTimeout1 = setTimeout(() => {
      setLoadingPhase('2. Hybrid Retrieval: Dense Embedding + Sparse BM25 RRF...');
    }, 1200);
    const phaseTimeout2 = setTimeout(() => {
      setLoadingPhase('3. Post-Retrieval: Cross-Encoder Re-Ranking & Context Compression...');
    }, 2400);
    const phaseTimeout3 = setTimeout(() => {
      setLoadingPhase('4. Grounded Legal Synthesis dengan Rujukan Pasal...');
    }, 3800);

    try {
      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          filterDocId: selectedFilter === 'all' ? undefined : selectedFilter,
        }),
      });

      clearTimeout(phaseTimeout1);
      clearTimeout(phaseTimeout2);
      clearTimeout(phaseTimeout3);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memproses pertanyaan hukum.');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        ragInspection: data.ragInspection,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      clearTimeout(phaseTimeout1);
      clearTimeout(phaseTimeout2);
      clearTimeout(phaseTimeout3);

      const errorMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `**Kendala Pemrosesan:**\n${err.message || 'Terjadi kesalahan sistem.'}\n\n*Pastikan GEMINI_API_KEY telah terkonfigurasi di panel Secrets AI Studio.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setLoadingPhase('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenInspector = (msg: ChatMessage) => {
    if (msg.ragInspection) {
      setCurrentInspection(msg.ragInspection);
      // Find corresponding user query
      const msgIndex = messages.findIndex((m) => m.id === msg.id);
      const priorUserMsg = msgIndex > 0 ? messages[msgIndex - 1] : undefined;
      setCurrentInspectedQuery(priorUserMsg?.content || msg.ragInspection.queryExpansion.originalQuery);
      setIsRagInspectorOpen(true);
    }
  };

  const handleOpenDocViewer = (doc?: LegalDocument, pasal?: string) => {
    setViewerTargetDoc(doc || documents[0]);
    setViewerTargetPasal(pasal);
    setIsDocViewerOpen(true);
  };

  const handleDocumentAdded = (newDoc: LegalDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    handleOpenDocViewer(newDoc);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInputQuery('');
    setLoadingPhase('');
    setIsRagInspectorOpen(false);
    showToast('Sesi konsultasi baru telah dimulai. Riwayat percakapan dibersihkan.');
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleExportChat = () => {
    if (messages.length === 0) {
      showToast('Belum ada pesan dalam sesi ini untuk diekspor.');
      return;
    }
    const exportData = {
      exportedAt: new Date().toISOString(),
      session: 'Konsultasi Hukum & Advanced RAG',
      messagesCount: messages.length,
      messages: messages.map((m) => ({
        role: m.role,
        time: m.timestamp,
        content: m.content,
        citations: m.citations,
      })),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hukumai-chat-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Log percakapan hukum berhasil diekspor.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0F1115] text-[#E2E8F0] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <Header
        documents={documents}
        onOpenDocViewer={handleOpenDocViewer}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
        onNewChat={handleClearChat}
        onExportLog={handleExportChat}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-[#16191E] border border-indigo-500/50 shadow-2xl text-xs text-indigo-200 font-medium flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 sm:px-6 py-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            {/* Hero Card */}
            <div className="text-center max-w-2xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Arsitektur Advanced RAG: Hybrid Search + Re-ranking
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight leading-tight mb-2.5">
                Konsultasi &amp; Tanya Jawab Regulasi Hukum
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Asisten kecerdasan buatan berbasis naskah hukum resmi Indonesia. Mampu menelaah draf{' '}
                <strong className="text-red-400">Rancangan Undang-Undang (RUU)</strong> prioritas dan{' '}
                <strong className="text-blue-400">Undang-Undang berlaku</strong> dengan rujukan Pasal &amp; Ayat terverifikasi.
              </p>
            </div>

            {/* Pipeline Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mb-4">
              <div className="p-3.5 rounded-xl bg-[#16191E] border border-[#2D333B] text-xs">
                <div className="font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> 1. Pre-Retrieval
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Query Rewriting &amp; HyDE menerjemahkan bahasa awam ke istilah hukum normatif.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16191E] border border-[#2D333B] text-xs">
                <div className="font-semibold text-blue-400 mb-1 flex items-center gap-1.5">
                  <Scale className="w-4 h-4" /> 2. Hybrid Retrieval
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Perpaduan Dense Vector Similarity dan Sparse BM25 Lexical dengan RRF k=60.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16191E] border border-[#2D333B] text-xs">
                <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4" /> 3. Grounded Citation
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Pembedaan tegas status RUU vs UU Berlaku serta sitasi langsung ke Pasal dan Ayat.
                </p>
              </div>
            </div>

            {/* Preset Questions */}
            <PresetQuestions
              onSelectQuestion={(q) => handleSendMessage(q)}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* Messages List */
          <div className="flex-1 py-4">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#2D333B]">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Sesi Konsultasi Aktif ({messages.length} Pesan)</span>
              </div>
              <button
                onClick={handleClearChat}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors"
                title="Hapus riwayat chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bersihkan Chat</span>
              </button>
            </div>

            {messages.map((msg) => (
              <ChatMessageView
                key={msg.id}
                message={msg}
                onOpenInspector={handleOpenInspector}
                onOpenDocViewer={handleOpenDocViewer}
                documents={documents}
              />
            ))}

            {/* Loading Phase Box */}
            {isLoading && (
              <div className="flex items-start gap-3 my-4 animate-in fade-in duration-300">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1 bg-[#16191E] rounded-2xl rounded-tl-sm border border-[#2D333B] p-4 shadow-lg">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-2">
                    <Cpu className="w-4 h-4 animate-pulse text-indigo-400" />
                    <span>Memproses Pipeline Advanced RAG...</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-[#0F1115] p-3 rounded-lg border border-[#2D333B] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>{loadingPhase || 'Menyiapkan pencarian hukum...'}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="sticky bottom-0 pt-2 pb-3 bg-[#0F1115]/95 backdrop-blur-md border-t border-[#2D333B]">
          <div className="relative rounded-2xl bg-[#16191E] border border-[#2D333B] focus-within:border-indigo-500/70 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all shadow-xl">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Tanyakan ketentuan pasal, sanksi, atau draf RUU (misal: 'Apakah aset koruptor bisa disita tanpa vonis pidana di RUU Perampasan Aset?')..."
              className="w-full px-4 pt-3 pb-12 rounded-2xl bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Tekan <kbd className="px-1.5 py-0.5 rounded bg-[#21262D] font-mono text-[10px] text-slate-300 border border-[#2D333B]">Enter</kbd> untuk kirim, <kbd className="px-1.5 py-0.5 rounded bg-[#21262D] font-mono text-[10px] text-slate-300 border border-[#2D333B]">Shift + Enter</kbd> baris baru
                </span>
              </div>

              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  id="btn-send-message"
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || isLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-950/40 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Analisis RAG</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Advanced RAG Pipeline Inspector Modal */}
      <RagInspectorModal
        isOpen={isRagInspectorOpen}
        onClose={() => setIsRagInspectorOpen(false)}
        inspection={currentInspection}
        query={currentInspectedQuery}
      />

      {/* Legal Document & Article Viewer Modal */}
      <LegalDocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        initialDoc={viewerTargetDoc}
        documents={documents}
        targetPasal={viewerTargetPasal}
      />

      {/* Custom Document Upload Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDocumentAdded={handleDocumentAdded}
      />
    </div>
  );
}
