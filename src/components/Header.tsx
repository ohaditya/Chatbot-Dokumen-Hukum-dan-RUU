import React from 'react';
import { BookOpen, UploadCloud, ShieldCheck, Sparkles, Layers, Menu, Download, PlusCircle, Scale } from 'lucide-react';
import { LegalDocument } from '../types.ts';

interface HeaderProps {
  documents: LegalDocument[];
  onOpenDocViewer: (doc?: LegalDocument) => void;
  onOpenUploadModal: () => void;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  onNewChat?: () => void;
  onExportLog?: () => void;
  onToggleSidebar?: () => void;
  activeSessionTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  documents,
  onOpenDocViewer,
  onOpenUploadModal,
  selectedFilter,
  onSelectFilter,
  onNewChat,
  onExportLog,
  onToggleSidebar,
  activeSessionTitle = 'Analisis Regulasi & RUU',
}) => {
  const ruuCount = documents.filter((d) => d.type === 'RUU').length;
  const uuCount = documents.filter((d) => d.type === 'UU').length;

  return (
    <header className="border-b border-[#2D333B] bg-[#0F1115]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left Session & System Info */}
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="p-1.5 rounded-lg bg-[#21262D] text-slate-300 hover:text-white border border-[#2D333B] md:hidden"
              title="Buka Navigasi Dokumen"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Brand icon for mobile / compact */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-sm">
                L
              </div>
              <span className="font-semibold text-white text-sm">HukumAI</span>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                Session: <span className="text-slate-200 font-semibold">{activeSessionTitle}</span>
              </span>
              <span className="text-[10px] bg-[#21262D] px-2 py-0.5 rounded text-indigo-300 font-mono border border-[#2D333B]">
                RAG Alpha-V2
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              id="btn-open-corpus"
              onClick={() => onOpenDocViewer()}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#21262D] hover:bg-[#2D333B] border border-[#2D333B] transition-colors shadow-sm"
              title="Telusuri Dokumen & RUU yang terindeks"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Daftar Regulasi ({documents.length})</span>
            </button>

            <button
              id="btn-upload-document"
              onClick={onOpenUploadModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-[#21262D] hover:bg-[#2D333B] border border-indigo-500/30 hover:border-indigo-500/50 transition-colors shadow-sm"
              title="Unggah draf RUU atau teks regulasi kustom"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
              <span>Unggah Dokumen</span>
            </button>

            <button
              id="btn-export-log"
              onClick={onExportLog}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-[#21262D] text-slate-300 rounded-lg border border-[#2D333B] hover:bg-[#2D333B] transition-colors"
              title="Unduh log riwayat analisis RAG"
            >
              <Download className="w-3 h-3 text-slate-400" />
              <span>Export Log</span>
            </button>

            <button
              id="btn-new-chat"
              onClick={onNewChat}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-950/30"
              title="Mulai sesi konsultasi hukum baru"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-2.5 pt-2 border-t border-[#2D333B]/60 flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-500 text-[11px] font-semibold mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" /> Scope Retrieval:
            </span>
            <button
              id="filter-all"
              onClick={() => onSelectFilter('all')}
              className={`px-2.5 py-0.5 rounded text-xs transition-all font-medium ${
                selectedFilter === 'all'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-[#21262D] text-slate-400 hover:text-slate-200 border border-[#2D333B]'
              }`}
            >
              Semua ({documents.length})
            </button>
            <button
              id="filter-ruu"
              onClick={() => onSelectFilter('ruu')}
              className={`px-2.5 py-0.5 rounded text-xs transition-all font-medium ${
                selectedFilter === 'ruu'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-[#21262D] text-slate-400 hover:text-slate-200 border border-[#2D333B]'
              }`}
            >
              RUU Prioritas ({ruuCount})
            </button>
            <button
              id="filter-uu"
              onClick={() => onSelectFilter('uu')}
              className={`px-2.5 py-0.5 rounded text-xs transition-all font-medium ${
                selectedFilter === 'uu'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'bg-[#21262D] text-slate-400 hover:text-slate-200 border border-[#2D333B]'
              }`}
            >
              UU Positif ({uuCount})
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-500 text-[11px] shrink-0">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Hybrid Search (Dense + BM25)
            </span>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Grounded Legal Citations
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

