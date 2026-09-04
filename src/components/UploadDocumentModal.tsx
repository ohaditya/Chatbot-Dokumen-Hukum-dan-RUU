import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LegalDocument } from '../types.ts';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: LegalDocument) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [title, setTitle] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [docType, setDocType] = useState<'RUU' | 'UU' | 'PERPRES' | 'PP' | 'CUSTOM'>('RUU');
  const [category, setCategory] = useState('Hukum & Regulasi');
  const [rawText, setRawText] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
      setShortTitle(cleanName.slice(0, 20));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) {
      setErrorMessage('Judul dokumen dan teks naskah wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          shortTitle: shortTitle.trim() || title.trim().slice(0, 25),
          type: docType,
          category: category.trim(),
          description: description.trim() || `Dokumen hukum ${docType} diunggah pengguna.`,
          rawText: rawText.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengunggah dokumen.');
      }

      onDocumentAdded(data.document);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat mengunggah.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#0F1115]/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16191E] border border-[#2D333B] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D333B] bg-[#0F1115]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Unggah Dokumen Hukum / Draf RUU Baru
              </h3>
              <p className="text-xs text-slate-400">
                Sistem akan memecah otomatis berdasarkan struktur BAB, Pasal, &amp; Ayat ke indeks Advanced RAG
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#21262D] hover:bg-[#2D333B] border border-[#2D333B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-300 mb-1">
                Judul Dokumen / RUU <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: RUU Etika Kecerdasan Artifisial"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#0F1115] border border-[#2D333B] text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Jenis Dokumen
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1115] border border-[#2D333B] text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="RUU">RUU (Rancangan UU)</option>
                <option value="UU">UU (Undang-Undang)</option>
                <option value="PP">PP (Peraturan Pemerintah)</option>
                <option value="PERPRES">Perpres (Peraturan Presiden)</option>
                <option value="CUSTOM">Lainnya / Kustom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nama Singkat / Alias
              </label>
              <input
                type="text"
                placeholder="Contoh: RUU AI 2024"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1115] border border-[#2D333B] text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Kategori Hukum
              </label>
              <input
                type="text"
                placeholder="Contoh: Hukum Teknologi &amp; Siber"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0F1115] border border-[#2D333B] text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Pilih Berkas Teks (.txt, .md, .json)
            </label>
            <div className="border-2 border-dashed border-[#2D333B] hover:border-indigo-500/50 rounded-xl p-4 text-center bg-[#0F1115]/50 transition-colors">
              <input
                type="file"
                id="doc-file-input"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="doc-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-6 h-6 text-indigo-400" />
                <span className="font-semibold text-slate-200">
                  Klik untuk unggah atau seret berkas ke sini
                </span>
                <span className="text-[11px] text-slate-400">
                  Mendukung format teks naskah perundang-undangan
                </span>
              </label>
            </div>
          </div>

          {/* Paste Raw Text */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Atau Tempel Naskah Hukum / Draf RUU <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={8}
              placeholder={`Contoh format:
BAB I KETENTUAN UMUM
Pasal 1
Dalam Undang-Undang ini yang dimaksud dengan...

BAB II PRINSIP DAN SISTEM
Pasal 2
(1) Setiap Penyelenggara wajib mematuhi asas kehati-hatian...`}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-[#0F1115] border border-[#2D333B] text-white font-mono text-xs focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tips: Pembagian pasal otomatis terdeteksi jika naskah memuat pola "Pasal 1", "Pasal 2", dst.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#2D333B] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-medium text-slate-400 hover:text-white bg-[#21262D] hover:bg-[#2D333B] border border-[#2D333B] transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-950/40 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengindeks ke RAG...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan &amp; Indeks Regulasi</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
