import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Scale,
  User,
  Cpu,
  AlertTriangle,
  BookOpen,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, LegalCitation, LegalDocument } from '../types.ts';

interface ChatMessageViewProps {
  message: ChatMessage;
  onOpenInspector: (msg: ChatMessage) => void;
  onOpenDocViewer: (doc?: LegalDocument, pasal?: string) => void;
  documents: LegalDocument[];
}

export const ChatMessageView: React.FC<ChatMessageViewProps> = ({
  message,
  onOpenInspector,
  onOpenDocViewer,
  documents,
}) => {
  const [copied, setCopied] = useState(false);
  const [showCitationsDrawer, setShowCitationsDrawer] = useState(true);

  const isUser = message.role === 'user';

  // Check if any citations are RUU
  const containsRuu = message.citations?.some((c) => c.docType === 'RUU');

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCitationClick = (citation: LegalCitation) => {
    const doc = documents.find((d) => d.id === citation.docId);
    onOpenDocViewer(doc, citation.pasal);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
          <div className="bg-[#21262D] text-slate-200 rounded-2xl rounded-tr-sm px-4 py-3 border border-[#2D333B] shadow-md">
            <p className="text-sm font-sans leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
            <div className="text-[10px] text-slate-500 mt-1.5 text-right font-mono">
              {message.timestamp}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#16191E] border border-[#2D333B] flex items-center justify-center text-slate-300 shrink-0">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="flex items-start gap-3 w-full max-w-4xl">
        {/* Assistant Avatar */}
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-400/30">
          <Scale className="w-4 h-4 text-white stroke-[2.2]" />
        </div>

        {/* Message Container */}
        <div className="flex-1 bg-[#16191E] rounded-2xl rounded-tl-sm border border-indigo-500/20 shadow-xl overflow-hidden">
          {/* Top Bar: Grounded Badge & Advanced RAG Inspector Trigger */}
          <div className="px-4 py-2.5 border-b border-[#2D333B] bg-[#0D1117] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-semibold text-indigo-400">
                <FileCheck2 className="w-3.5 h-3.5" /> Analisis Hukum Terverifikasi
              </span>
              {message.ragInspection && (
                <span className="text-[11px] text-slate-500 font-mono">
                  • {message.ragInspection.executionTimeMs.total}ms total
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {message.ragInspection && (
                <button
                  id={`btn-inspect-rag-${message.id}`}
                  onClick={() => onOpenInspector(message)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                >
                  <Cpu className="w-3 h-3 text-indigo-400" />
                  <span>Inspeksi RAG Pipeline</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#21262D] transition-colors"
                title="Salin jawaban"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* RUU Alert Banner if RUU is cited */}
          {containsRuu && (
            <div className="mx-4 mt-3.5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-200/90 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-300 font-semibold block mb-0.5">
                  Pemberitahuan Status RUU (Rancangan Undang-Undang):
                </strong>
                Jawaban ini merujuk pada draf Rancangan Undang-Undang yang saat ini masih dalam proses legislasi di DPR RI/Pemerintah dan belum disahkan menjadi hukum positif yang berlaku.
              </div>
            </div>
          )}

          {/* Markdown Content */}
          <div className="p-4 sm:p-5 text-slate-200 text-sm leading-relaxed font-sans prose prose-invert prose-indigo max-w-none prose-headings:font-serif prose-headings:text-white prose-p:my-2.5 prose-li:my-1 prose-strong:text-indigo-200 prose-table:border prose-table:border-[#2D333B]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Grounded Citations Section */}
          {message.citations && message.citations.length > 0 && (
            <div className="border-t border-[#2D333B] bg-[#0D1117] p-4">
              <div className="flex items-center justify-between mb-2.5">
                <button
                  onClick={() => setShowCitationsDrawer(!showCitationsDrawer)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Rujukan Pasal Terverifikasi ({message.citations.length})</span>
                  {showCitationsDrawer ? (
                    <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
                <span className="text-[10px] text-slate-500">
                  Klik rujukan untuk membuka naskah lengkap
                </span>
              </div>

              {showCitationsDrawer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {message.citations.map((citation, index) => {
                    const isRuu = citation.docType === 'RUU';
                    return (
                      <div
                        key={index}
                        onClick={() => handleCitationClick(citation)}
                        className="group p-2.5 rounded-lg bg-[#16191E] hover:bg-[#21262D] border border-[#2D333B] hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                                isRuu
                                  ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                  : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              }`}
                            >
                              {citation.docType}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                              Buka Naskah <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                          <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors font-serif">
                            {citation.docTitle} - {citation.pasal}
                          </div>
                        </div>

                        <p className="mt-1.5 text-[11px] text-slate-400 line-clamp-2 italic font-serif bg-[#0F1115] p-1.5 rounded border border-[#2D333B]">
                          "{citation.content.slice(0, 160)}..."
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

};
