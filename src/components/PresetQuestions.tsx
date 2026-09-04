import React from 'react';
import { ArrowUpRight, Scale, ShieldAlert, FileText, Briefcase, FileCode, Sparkles } from 'lucide-react';

interface PresetQuestionsProps {
  onSelectQuestion: (question: string) => void;
  isLoading: boolean;
}

interface PresetItem {
  icon: React.ReactNode;
  tag: string;
  tagColor: string;
  title: string;
  query: string;
}

export const PresetQuestions: React.FC<PresetQuestionsProps> = ({ onSelectQuestion, isLoading }) => {
  const presets: PresetItem[] = [
    {
      icon: <Scale className="w-3.5 h-3.5 text-red-400" />,
      tag: 'RUU Prioritas',
      tagColor: 'bg-red-500/10 text-red-400 border-red-500/30',
      title: 'Perampasan Aset Tanpa Vonis Pidana (In Rem)',
      query: 'Bagaimana mekanisme perampasan aset tindak pidana tanpa putusan pidana (in rem forfeiture) dalam RUU Perampasan Aset? Apakah kekayaan yang tidak wajar (unexplained wealth) bisa disita?',
    },
    {
      icon: <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />,
      tag: 'UU PDP (Hukum Positif)',
      tagColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      title: 'Kewajiban 3x24 Jam Notifikasi Kebocoran Data',
      query: 'Bagaimana kewajiban pengendali data jika terjadi insiden kebocoran data menurut UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi? Berapa batas waktu notifikasi dan sanksi denda administratifnya?',
    },
    {
      icon: <FileCode className="w-3.5 h-3.5 text-indigo-400" />,
      tag: 'UU ITE 2024 (Revisi Kedua)',
      tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      title: 'Pencemaran Nama Baik & Delik Aduan',
      query: 'Apa saja perubahan pada pasal pencemaran nama baik di UU ITE 2024 (Pasal 27A)? Mengapa sekarang ditegaskan sebagai delik aduan mutlak dan berapa ancaman pidananya?',
    },
    {
      icon: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />,
      tag: 'UU Cipta Kerja',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      title: 'Formula Pesangon & Kompensasi PKWT Kontrak',
      query: 'Bagaimana formula perhitungan uang pesangon (UP) dan UPMK Pasal 156 dalam UU Cipta Kerja? Serta apakah pekerja kontrak (PKWT) berhak atas uang kompensasi ketika masa kontraknya selesai?',
    },
    {
      icon: <FileText className="w-3.5 h-3.5 text-purple-400" />,
      tag: 'KUHP Baru (UU 1/2023)',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      title: 'Pidana Mati Bersyarat 10 Tahun & Masa Transisi',
      query: 'Bagaimana pengaturan pidana mati dengan masa percobaan 10 tahun (Pasal 100) dalam KUHP Baru (UU 1/2023) dan kapan undang-undang ini berlaku operasional penuh?',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-5">
      <div className="flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        Contoh Kueri &amp; Kasus Regulasi Terindeks (Advanced RAG)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {presets.map((item, index) => (
          <button
            key={index}
            id={`preset-btn-${index}`}
            disabled={isLoading}
            onClick={() => onSelectQuestion(item.query)}
            className="group flex flex-col justify-between text-left p-3.5 rounded-xl bg-[#16191E] hover:bg-[#21262D] border border-[#2D333B] hover:border-indigo-500/40 transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${item.tagColor}`}>
                  {item.tag}
                </span>
                <span className="p-1 rounded bg-[#0F1115] text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                {item.title}
              </h4>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
              {item.query}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
