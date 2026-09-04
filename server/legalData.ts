import { LegalDocument, LegalChunk } from '../src/types.ts';

export const INITIAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'ruu-perampasan-aset',
    title: 'Rancangan Undang-Undang tentang Perampasan Aset Tindak Pidana',
    shortTitle: 'RUU Perampasan Aset',
    nomor: 'RUU Prioritas Prolegnas',
    tahun: 2024,
    type: 'RUU',
    status: 'Rancangan (RUU)',
    statusDescription: 'Masih dalam proses pembahasan di DPR RI dan Pemerintah. Belum memiliki kekuatan hukum mengikat.',
    category: 'Hukum Pidana & Pemulihan Aset',
    description: 'Rancangan regulasi untuk merampas aset hasil tindak pidana korupsi, pencucian uang, dan kejahatan ekonomi tanpa bergantung pada vonis pidana terhadap pelaku (Non-Conviction Based Asset Forfeiture / In Rem).',
    totalArticles: 68,
    totalChapters: 8,
    sourceUrl: 'https://dpr.go.id/prolegnas'
  },
  {
    id: 'uu-pdp-2022',
    title: 'Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    shortTitle: 'UU PDP',
    nomor: 'UU No. 27',
    tahun: 2022,
    type: 'UU',
    status: 'Berlaku',
    statusDescription: 'Telah diundangkan pada 17 Oktober 2022 dan berlaku efektif secara penuh sejak Oktober 2024.',
    category: 'Hukum Siber & Privasi',
    description: 'Landasan hukum utama perlindungan data pribadi di Indonesia yang mengatur hak subjek data, kewajiban pengendali data pribadi, transfer data lintas batas, serta sanksi denda administratif dan pidana.',
    totalArticles: 76,
    totalChapters: 16,
    datePromulgated: '2022-10-17',
    sourceUrl: 'https://peraturan.go.id'
  },
  {
    id: 'uu-ite-2024',
    title: 'Undang-Undang Republik Indonesia Nomor 1 Tahun 2024 tentang Perubahan Kedua atas UU No. 11/2008 tentang Informasi dan Transaksi Elektronik',
    shortTitle: 'UU ITE (Revisi Kedua 2024)',
    nomor: 'UU No. 1',
    tahun: 2024,
    type: 'UU',
    status: 'Perubahan',
    statusDescription: 'Telah disahkan dan diundangkan pada 2 Januari 2024. Merevisi pasal pencemaran nama baik, berita bohong, dan perlindungan anak di ranah digital.',
    category: 'Hukum Siber & Transaksi Elektronik',
    description: 'Pembaruan hukum ITE yang menegaskan batasan pasal pencemaran nama baik (Pasal 27A), berita bohong yang menimbulkan kerusuhan (Pasal 28 ayat 3), serta tanggung jawab Penyelenggara Sistem Elektronik.',
    totalArticles: 54,
    totalChapters: 13,
    datePromulgated: '2024-01-02',
    sourceUrl: 'https://peraturan.go.id'
  },
  {
    id: 'uu-kuhp-2023',
    title: 'Undang-Undang Republik Indonesia Nomor 1 Tahun 2023 tentang Kitab Undang-Undang Hukum Pidana (KUHP Nasional)',
    shortTitle: 'KUHP Baru (UU 1/2023)',
    nomor: 'UU No. 1',
    tahun: 2023,
    type: 'UU',
    status: 'Berlaku',
    statusDescription: 'Diundangkan 2 Januari 2023 dengan masa transisi 3 tahun, berlaku efektif secara operasional per Januari 2026.',
    category: 'Hukum Pidana Umum',
    description: 'Kodifikasi hukum pidana nasional modern yang menggantikan KUHP peninggalan kolonial Belanda (WvS), memperkenalkan pidana pengawasan, kerja sosial, pidana mati bersyarat, dan pengakuan living law.',
    totalArticles: 624,
    totalChapters: 37,
    datePromulgated: '2023-01-02',
    sourceUrl: 'https://peraturan.go.id'
  },
  {
    id: 'uu-cipta-kerja-ketenagakerjaan',
    title: 'Undang-Undang Republik Indonesia Nomor 6 Tahun 2023 tentang Penetapan Perppu Cipta Kerja menjadi UU (Klaster Ketenagakerjaan)',
    shortTitle: 'UU Cipta Kerja (Ketenagakerjaan)',
    nomor: 'UU No. 6',
    tahun: 2023,
    type: 'UU',
    status: 'Berlaku',
    statusDescription: 'Telah diundangkan pada 31 Maret 2023. Mengatur hubungan kerja, PKWT, alih daya, PHK, dan pesangon.',
    category: 'Hukum Ketenagakerjaan',
    description: 'Regulasi ketenagakerjaan terkini yang mengubah UU No. 13/2003, mencakup formula baru pesangon Pasal 156, kompensasi kontrak PKWT, ketentuan alih daya (outsourcing), dan mekanisme PHK bipartit.',
    totalArticles: 185,
    totalChapters: 18,
    datePromulgated: '2023-03-31',
    sourceUrl: 'https://peraturan.go.id'
  }
];

export const INITIAL_LEGAL_CHUNKS: LegalChunk[] = [
  // ==========================================
  // RUU PERAMPASAN ASET TINDAK PIDANA
  // ==========================================
  {
    id: 'ruu-pa-pasal-1',
    docId: 'ruu-perampasan-aset',
    docTitle: 'RUU Perampasan Aset Tindak Pidana',
    docType: 'RUU',
    bab: 'BAB I KETENTUAN UMUM',
    pasal: 'Pasal 1',
    ayat: 'Angka 1 s.d. 5',
    content: `Dalam Undang-Undang ini yang dimaksud dengan:
1. Perampasan Aset adalah upaya paksa yang dilakukan oleh negara untuk mengambil alih hak kepemilikan dan/atau penguasaan atas Aset Tindak Pidana berdasarkan putusan pengadilan yang telah memperoleh kekuatan hukum tetap tanpa didasarkan pada penjatuhan pidana terhadap pelakunya (in rem forfeiture).
2. Aset Tindak Pidana adalah semua benda bergerak atau benda tidak bergerak, berwujud atau tidak berwujud, yang patut diduga berasal dari tindak pidana atau digunakan secara langsung atau tidak langsung untuk melakukan tindak pidana.
3. Tindak Pidana adalah tindak pidana yang diancam dengan pidana penjara 4 (empat) tahun atau lebih dan/atau tindak pidana korupsi, pencucian uang, narkotika, perpajakan, kepabeanan, serta tindak pidana ekonomi lainnya.
4. Pemohon adalah Jaksa Penuntut Umum atau institusi penegak hukum yang berwenang mengajukan permohonan Perampasan Aset kepada pengadilan negeri.
5. Pihak Ketiga adalah orang perseorangan atau korporasi yang memiliki hak atau kepentingan yang sah atas aset yang diajukan permohonan perampasan.`,
    explanation: 'Definisi ini menetapkan paradigma baru perampasan aset perdata (non-conviction based) yang menargetkan benda/aset (in rem), bukan orangnya (in personam).'
  },
  {
    id: 'ruu-pa-pasal-5',
    docId: 'ruu-perampasan-aset',
    docTitle: 'RUU Perampasan Aset Tindak Pidana',
    docType: 'RUU',
    bab: 'BAB II RUANG LINGKUP ASET YANG DAPAT DIRAMPAS',
    pasal: 'Pasal 5',
    ayat: 'Ayat (1) dan (2)',
    content: `(1) Aset yang dapat dirampas berdasarkan Undang-Undang ini meliputi:
a. Aset yang bernilai paling sedikit Rp100.000.000,00 (seratus juta rupiah) yang diduga kuat berasal dari tindak pidana;
b. Aset yang digunakan atau direncanakan untuk digunakan melakukan tindak pidana;
c. Aset yang merupakan pendapatan, keuntungan, atau bunga yang diperoleh dari Aset Tindak Pidana;
d. Aset yang merupakan pengganti dari Aset Tindak Pidana yang telah dialihkan, dihibahkan, atau disamarkan;
e. Aset milik tersangka atau terdakwa yang tidak seimbang dengan sumber penghasilan sah dan patut diduga berasal dari tindak pidana (unexplained wealth).
(2) Batasan nilai minimum sebagaimana dimaksud pada ayat (1) huruf a tidak berlaku bagi aset yang terkait langsung dengan tindak pidana terorisme atau tindak pidana narkotika.`,
    explanation: 'Ketentuan ini mengatur ambang batas (threshold) Rp100 juta agar penegakan hukum fokus pada aset bernilai signifikan, sekaligus memasukkan konsep kekayaan tak wajar (unexplained wealth).'
  },
  {
    id: 'ruu-pa-pasal-6',
    docId: 'ruu-perampasan-aset',
    docTitle: 'RUU Perampasan Aset Tindak Pidana',
    docType: 'RUU',
    bab: 'BAB II RUANG LINGKUP ASET YANG DAPAT DIRAMPAS',
    pasal: 'Pasal 6',
    ayat: 'Ayat (1) s.d. (3)',
    content: `(1) Perampasan Aset tanpa penjatuhan pidana dapat diajukan dalam kondisi:
a. Tersangka atau terdakwa meninggal dunia, melarikan diri, sakit permanen, atau tidak diketahui keberadaannya;
b. Tersangka atau terdakwa diputus lepas dari segala tuntutan hukum namun asetnya terbukti secara keperdataan merupakan aset tindak pidana;
c. Perkara pidananya tidak dapat disidangkan karena alasan hukum lain yang sah;
d. Aset ditemukan namun pemilik atau penguasanya tidak diketahui (aset tak bertuan);
e. Telah diputus pidana namun terdapat aset yang belum dirampas atau baru ditemukan di kemudian hari.
(2) Pembuktian dalam permohonan Perampasan Aset menggunakan standar pembuktian perdata (preponderance of evidence / balance of probabilities).
(3) Beban pembuktian kepemilikan yang sah atas aset dibebankan kepada pihak yang mengklaim memiliki aset tersebut (pembuktian terbalik).`,
    explanation: 'Pasal kunci yang memungkinkan negara menyita aset koruptor yang buron ke luar negeri atau meninggal dunia sebelum vonis pidana inkrah.'
  },
  {
    id: 'ruu-pa-pasal-13',
    docId: 'ruu-perampasan-aset',
    docTitle: 'RUU Perampasan Aset Tindak Pidana',
    docType: 'RUU',
    bab: 'BAB III TATA CARA PERMOHONAN DAN PEMERIKSAAN PERAMPASAN ASET',
    pasal: 'Pasal 13',
    ayat: 'Ayat (1) s.d. (4)',
    content: `(1) Jaksa selaku Pemohon mengajukan permohonan Perampasan Aset secara tertulis kepada Pengadilan Negeri yang daerah hukumnya meliputi tempat kedudukan aset atau tempat kediaman termohon.
(2) Permohonan sebagaimana dimaksud pada ayat (1) wajib memuat:
a. Identitas Pemohon;
b. Uraian rinci identitas dan lokasi aset yang dimohonkan perampasan;
c. Nilai taksiran aset;
d. Alat bukti permulaan yang cukup yang menunjukkan aset berkaitan dengan tindak pidana;
e. Identitas pihak yang menguasai atau diduga memiliki aset jika diketahui.
(3) Ketua Pengadilan Negeri dalam waktu paling lama 3 (tiga) hari kerja sejak permohonan diterima wajib menetapkan majelis hakim pemeriksa perkara.
(4) Pengadilan Negeri wajib memutus permohonan Perampasan Aset dalam jangka waktu paling lama 60 (enam puluh) hari kerja terhitung sejak sidang pertama dibuka.`,
    explanation: 'Mengatur kepastian hukum dan batas waktu cepat (60 hari kerja) dalam proses peradilan perampasan aset di pengadilan negeri.'
  },
  {
    id: 'ruu-pa-pasal-24',
    docId: 'ruu-perampasan-aset',
    docTitle: 'RUU Perampasan Aset Tindak Pidana',
    docType: 'RUU',
    bab: 'BAB IV PERLINDUNGAN PIHAK KETIGA YANG BERITIKAD BAIK',
    pasal: 'Pasal 24',
    ayat: 'Ayat (1) s.d. (3)',
    content: `(1) Pihak Ketiga yang beritikad baik yang memiliki hak atas aset yang dimohonkan perampasan berhak mengajukan keberatan kepada pengadilan negeri yang memeriksa perkara permohonan.
(2) Keberatan sebagaimana dimaksud pada ayat (1) diajukan dalam tenggang waktu paling lama 30 (tiga puluh) hari kalender sejak pengumuman permohonan perampasan aset diumumkan secara resmi oleh pengadilan.
(3) Pihak Ketiga wajib membuktikan:
a. Hak kepemilikan yang sah diperoleh sebelum aset tersebut terkait dengan tindak pidana;
b. Perolehan hak dilakukan dengan pembayaran nilai yang wajar (fair market value); dan
c. Tidak mengetahui dan tidak patut menduga bahwa aset tersebut bersumber dari tindak pidana.
(4) Dalam hal keberatan dikabulkan, hakim wajib memerintahkan pelepasan aset dari sita dan menyerahkannya kembali kepada pihak ketiga.`,
    explanation: 'Memberikan perlindungan konstitusional bagi pembeli sah, kreditur, atau ahli waris yang tidak tahu menahu mengenai kejahatan pelaku.'
  },

  // ==========================================
  // UU PDP (UU NO. 27 TAHUN 2022)
  // ==========================================
  {
    id: 'uu-pdp-pasal-1',
    docId: 'uu-pdp-2022',
    docTitle: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    docType: 'UU',
    bab: 'BAB I KETENTUAN UMUM',
    pasal: 'Pasal 1',
    ayat: 'Angka 1 s.d. 6',
    content: `Dalam Undang-Undang ini yang dimaksud dengan:
1. Data Pribadi adalah data tentang orang perseorangan yang teridentifikasi atau dapat diidentifikasi secara tersendiri atau dikombinasi dengan informasi lainnya baik secara langsung maupun tidak langsung melalui sistem elektronik atau nonelektronik.
2. Perlindungan Data Pribadi adalah keseluruhan upaya untuk menjaga data pribadi dalam rangka menjamin hak asasi subjek data pribadi.
3. Subjek Data Pribadi adalah orang perseorangan yang pada dirinya melekat data pribadi.
4. Pengendali Data Pribadi adalah setiap orang, badan publik, dan organisasi internasional yang bertindak sendiri-sendiri atau bersama-sama dalam menentukan tujuan dan melakukan kendali pemrosesan data pribadi.
5. Prosesor Data Pribadi adalah setiap orang, badan publik, dan organisasi internasional yang bertindak sendiri-sendiri atau bersama-sama dalam melakukan pemrosesan data pribadi atas nama Pengendali Data Pribadi.`,
    explanation: 'Menegaskan distingsi peran vital antara Pengendali Data (Data Controller) dan Prosesor Data (Data Processor).'
  },
  {
    id: 'uu-pdp-pasal-4',
    docId: 'uu-pdp-2022',
    docTitle: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    docType: 'UU',
    bab: 'BAB II JENIS DATA PRIBADI',
    pasal: 'Pasal 4',
    ayat: 'Ayat (1) s.d. (3)',
    content: `(1) Data Pribadi terdiri atas:
a. Data Pribadi yang bersifat spesifik; dan
b. Data Pribadi yang bersifat umum.
(2) Data Pribadi yang bersifat spesifik sebagaimana dimaksud pada ayat (1) huruf a meliputi:
a. data dan informasi kesehatan;
b. data biometrik;
c. data genetika;
d. catatan kejahatan;
e. data anak;
f. data keuangan pribadi; dan/atau
g. data lainnya sesuai dengan ketentuan peraturan perundang-undangan.
(3) Data Pribadi yang bersifat umum sebagaimana dimaksud pada ayat (1) huruf b meliputi:
a. nama lengkap;
b. jenis kelamin;
c. kewarganegaraan;
d. agama;
e. status perkawinan; dan/atau
f. data pribadi yang dikombinasikan untuk mengidentifikasi seseorang.`,
    explanation: 'Klasifikasi data spesifik mewajibkan standar keamanan lebih ketat (seperti enkripsi tingkat tinggi dan penilaian dampak privasi / DPIA).'
  },
  {
    id: 'uu-pdp-pasal-5-sd-8',
    docId: 'uu-pdp-2022',
    docTitle: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    docType: 'UU',
    bab: 'BAB IV HAK SUBJEK DATA PRIBADI',
    pasal: 'Pasal 5 s.d. Pasal 8',
    ayat: 'Pasal 5, 6, 7, 8',
    content: `Pasal 5:
Subjek Data Pribadi berhak mendapatkan informasi tentang kejelasan identitas, dasar kepentingan hukum, tujuan permintaan dan penggunaan Data Pribadi, dan akuntabilitas pihak yang meminta Data Pribadi.

Pasal 6:
Subjek Data Pribadi berhak melengkapi, memperbarui, dan/atau memperbaiki kesalahan dan/atau ketidakakuratan Data Pribadi tentang dirinya sesuai dengan tujuan pemrosesan Data Pribadi.

Pasal 7:
Subjek Data Pribadi berhak mendapatkan akses dan memperoleh salinan Data Pribadi tentang dirinya sesuai dengan ketentuan peraturan perundang-undangan.

Pasal 8:
Subjek Data Pribadi berhak mengakhiri pemrosesan, menghapus, dan/atau memusnahkan Data Pribadi tentang dirinya sesuai dengan ketentuan peraturan perundang-undangan (Right to Erasure / Right to be Forgotten).`,
    explanation: 'Hak-hak fundamental individu di ranah digital yang wajib dipatuhi oleh semua perusahaan, aplikasi, dan instansi pemerintah.'
  },
  {
    id: 'uu-pdp-pasal-46',
    docId: 'uu-pdp-2022',
    docTitle: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    docType: 'UU',
    bab: 'BAB V KEWAJIBAN PENGENDALI DATA PRIBADI',
    pasal: 'Pasal 46',
    ayat: 'Ayat (1) s.d. (3)',
    content: `(1) Dalam hal terjadi kegagalan pelindungan Data Pribadi (kebocoran data), Pengendali Data Pribadi wajib menyampaikan pemberitahuan secara tertulis dalam waktu paling lambat 3 x 24 (tiga kali dua puluh empat) jam kepada:
a. Subjek Data Pribadi; dan
b. Lembaga Perlindungan Data Pribadi.
(2) Pemberitahuan tertulis sebagaimana dimaksud pada ayat (1) minimal harus memuat:
a. Data Pribadi yang terungkap/bocor;
b. Kapan dan bagaimana Data Pribadi terungkap; dan
c. Upaya penanganan dan pemulihan atas terungkapnya Data Pribadi oleh Pengendali Data Pribadi.
(3) Dalam hal kegagalan pelindungan Data Pribadi mengganggu pelayanan publik dan/atau berdampak serius terhadap kepentingan masyarakat, Pengendali Data Pribadi wajib memberitahukan kepada masyarakat.`,
    explanation: 'Kewajiban notifikasi kebocoran data dalam tempo ketat 72 jam (3x24 jam) guna mencegah kerugian finansial atau peretasan lanjutan.'
  },
  {
    id: 'uu-pdp-pasal-57-sanksi-admin',
    docId: 'uu-pdp-2022',
    docTitle: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    docType: 'UU',
    bab: 'BAB XII SANKSI ADMINISTRATIF',
    pasal: 'Pasal 57',
    ayat: 'Ayat (1) s.d. (3)',
    content: `(1) Lembaga berwenang menjatuhkan sanksi administratif atas pelanggaran kewajiban pemrosesan data pribadi berupa:
a. peringatan tertulis;
b. penghentian sementara kegiatan pemrosesan Data Pribadi;
c. penghapusan atau pemusnahan Data Pribadi; dan/atau
d. denda administratif.
(2) Denda administratif sebagaimana dimaksud pada ayat (1) huruf d dikenakan paling tinggi 2% (dua persen) dari pendapatan tahunan atau penerimaan tahunan terhadap variabel pelanggaran.
(3) Ketentuan lebih lanjut mengenai tata cara pengenaan sanksi administratif diatur dalam Peraturan Pemerintah.`,
    explanation: 'Sanksi denda administratif maksimal 2% omzet tahunan mengadopsi prinsip regulasi internasional GDPR di Uni Eropa.'
  },
  {
    id: 'uu-pdp-pasal-65-67-pidana',
    docId: 'uu-pdp-2022',
    docTitle: 'UU No. 27 Tahun 2022 tentang Perlindungan Data Pribadi',
    docType: 'UU',
    bab: 'BAB XIV KETENTUAN PIDANA',
    pasal: 'Pasal 65 dan Pasal 67',
    ayat: 'Pasal 65 ayat (1)-(3), Pasal 67 ayat (1)-(3)',
    content: `Pasal 65:
(1) Setiap Orang yang dengan sengaja dan melawan hukum memperoleh atau mengumpulkan Data Pribadi yang bukan miliknya dengan maksud untuk menguntungkan diri sendiri atau orang lain yang dapat mengakibatkan kerugian Subjek Data Pribadi.
(2) Setiap Orang yang dengan sengaja dan melawan hukum mengungkapkan Data Pribadi yang bukan miliknya.
(3) Setiap Orang yang dengan sengaja dan melawan hukum menggunakan Data Pribadi yang bukan miliknya.

Pasal 67:
(1) Setiap Orang yang melanggar ketentuan Pasal 65 ayat (1) dipidana dengan pidana penjara paling lama 5 (lima) tahun dan/atau pidana denda paling banyak Rp5.000.000.000,00 (lima miliar rupiah).
(2) Setiap Orang yang melanggar ketentuan Pasal 65 ayat (2) dipidana dengan pidana penjara paling lama 4 (empat) tahun dan/atau pidana denda paling banyak Rp4.000.000.000,00 (empat miliar rupiah).
(3) Setiap Orang yang melanggar ketentuan Pasal 65 ayat (3) dipidana dengan pidana penjara paling lama 5 (lima) tahun dan/atau pidana denda paling banyak Rp5.000.000.000,00 (lima miliar rupiah).
(4) Dalam hal tindak pidana dilakukan oleh korporasi, pidana dapat dijatuhkan terhadap pengurus dan korporasi berupa denda maksimal 10 kali lipat serta pencabutan izin usaha.`,
    explanation: 'Ancaman pidana penjara 5 tahun dan denda miliaran rupiah bagi pelaku peretasan, penjualan data pribadi, doxxing, dan sindikat jual beli data kependudukan.'
  },

  // ==========================================
  // UU ITE REVISI KEDUA (UU NO. 1 TAHUN 2024)
  // ==========================================
  {
    id: 'uu-ite-pasal-27a-pencemaran',
    docId: 'uu-ite-2024',
    docTitle: 'UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE',
    docType: 'UU',
    bab: 'BAB VII PERBUATAN YANG DILARANG',
    pasal: 'Pasal 27A & Pasal 45 ayat (4)',
    ayat: 'Pasal 27A, Pasal 45 ayat (4)',
    content: `Pasal 27A:
Setiap Orang dengan sengaja menyerang kehormatan atau nama baik orang lain dengan cara menuduhkan suatu hal, dengan maksud supaya hal tersebut diketahui umum dalam bentuk Informasi Elektronik dan/atau Dokumen Elektronik yang dilakukan melalui Sistem Elektronik.

Pasal 45 ayat (4):
Setiap Orang yang dengan sengaja dan tanpa hak mendistribusikan dan/atau mentransmisikan dan/atau membuat dapat diaksesnya Informasi Elektronik dan/atau Dokumen Elektronik yang memiliki muatan pencemaran nama baik sebagaimana dimaksud dalam Pasal 27A dipidana dengan pidana penjara paling lama 2 (dua) tahun dan/atau denda paling banyak Rp400.000.000,00 (empat ratus juta rupiah).

Pasal 45 ayat (6) & (7):
(6) Tindak pidana sebagaimana dimaksud dalam Pasal 27A merupakan tindak pidana aduan (klachtdelict) yang hanya dapat dituntut atas pengaduan korban langsung (tidak dapat diwakili oleh kuasa hukum atau organisasi).
(7) Perbuatan sebagaimana dimaksud dalam Pasal 27A tidak dipidana jika dilakukan demi kepentingan umum atau jika terpaksa dilakukan untuk membela diri.`,
    explanation: 'Pembaruan krusial UU ITE 2024: Menurunkan ancaman hukuman penjara dari 4 tahun menjadi 2 tahun (sehingga tersangka tidak dapat langsung ditahan pada tahap penyidikan) dan menegaskan delik aduan mutlak serta pengecualian kepentingan umum.'
  },
  {
    id: 'uu-ite-pasal-28-hoaks',
    docId: 'uu-ite-2024',
    docTitle: 'UU No. 1 Tahun 2024 tentang Perubahan Kedua UU ITE',
    docType: 'UU',
    bab: 'BAB VII PERBUATAN YANG DILARANG',
    pasal: 'Pasal 28 & Pasal 45A',
    ayat: 'Pasal 28 ayat (1)-(3), Pasal 45A ayat (1)-(3)',
    content: `Pasal 28:
(1) Setiap Orang dengan sengaja mendistribusikan dan/atau mentransmisikan Informasi Elektronik dan/atau Dokumen Elektronik yang berisi pemberitahuan bohong atau informasi menyesatkan yang mengakibatkan kerugian materiel bagi konsumen dalam Transaksi Elektronik.
(2) Setiap Orang dengan sengaja dan tanpa hak mendistribusikan dan/atau mentransmisikan Informasi Elektronik yang menimbulkan rasa kebencian atau permusuhan individu dan/atau kelompok masyarakat tertentu berdasarkan atas suku, agama, ras, dan antargolongan (SARA).
(3) Setiap Orang dengan sengaja menyebarkan Informasi Elektronik dan/atau Dokumen Elektronik yang diketahuinya memuat pemberitahuan bohong yang menimbulkan kerusuhan di masyarakat.

Pasal 45A ayat (3):
Setiap Orang yang melanggar ketentuan Pasal 28 ayat (3) dipidana dengan pidana penjara paling lama 6 (enam) tahun dan/atau denda paling banyak Rp1.000.000.000,00 (satu miliar rupiah).`,
    explanation: 'Membedakan secara spesifik antara penipuan belanja daring konsumen, ujaran kebencian SARA, dan penyebaran berita bohong yang memicu kerusuhan fisik nyata di masyarakat.'
  },

  // ==========================================
  // KUHP BARU (UU NO. 1 TAHUN 2023)
  // ==========================================
  {
    id: 'kuhp-pasal-1-2-legalitas',
    docId: 'uu-kuhp-2023',
    docTitle: 'UU No. 1 Tahun 2023 tentang KUHP',
    docType: 'UU',
    bab: 'BUKU KESATU - BAB I RUANG LINGKUP BERLAKUNYA HUKUM PIDANA',
    pasal: 'Pasal 1 dan Pasal 2',
    ayat: 'Pasal 1 ayat (1)-(2), Pasal 2 ayat (1)-(2)',
    content: `Pasal 1:
(1) Tidak ada satu perbuatan pun yang dapat dikenai sanksi pidana dan/atau tindakan, kecuali atas kekuatan peraturan perundang-undangan pidana yang telah ada sebelum perbuatan dilakukan (nullum delictum nulla poena sine praevia lege poenali).
(2) Dalam hal terdapat perubahan peraturan perundang-undangan setelah perbuatan terjadi, diberlakukan peraturan yang meringankan bagi pelaku tindak pidana.

Pasal 2 (Hukum yang Hidup dalam Masyarakat / Living Law):
(1) Ketentuan sebagaimana dimaksud dalam Pasal 1 ayat (1) tidak mengurangi berlakunya hukum yang hidup dalam masyarakat yang menentukan bahwa seseorang patut dipidana walaupun perbuatan tersebut tidak diatur dalam Undang-Undang ini.
(2) Hukum yang hidup dalam masyarakat sebagaimana dimaksud pada ayat (1) berlaku dalam tempat hukum itu hidup dan sepanjang tidak bertentangan dengan Pancasila, Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, hak asasi manusia, dan asas hukum umum yang diakui oleh masyarakat bangsa-bangsa.`,
    explanation: 'Asas legalitas diperluas dengan mengakomodasi hukum adat/living law di daerah tertentu dengan batasan ketat norma konstitusional dan HAM.'
  },
  {
    id: 'kuhp-pasal-100-pidana-mati',
    docId: 'uu-kuhp-2023',
    docTitle: 'UU No. 1 Tahun 2023 tentang KUHP',
    docType: 'UU',
    bab: 'BUKU KESATU - BAB III PIDANA DAN TINDAKAN',
    pasal: 'Pasal 100',
    ayat: 'Ayat (1) s.d. (4)',
    content: `(1) Hakim menjatuhkan pidana mati dengan masa percobaan selama 10 (sepuluh) tahun jika:
a. rasa penyesalan terdakwa dan ada harapan untuk memperbaiki diri; atau
b. peran terdakwa dalam tindak pidana tidak terlalu penting.
(2) Pidana mati dengan masa percobaan sebagaimana dimaksud pada ayat (1) harus dicantumkan dalam putusan pengadilan.
(3) Tenggang waktu masa percobaan 10 (sepuluh) tahun dihitung sejak 1 (satu) hari setelah putusan pengadilan memperoleh kekuatan hukum tetap.
(4) Jika terpidana selama masa percobaan sebagaimana dimaksud pada ayat (1) menunjukkan sikap dan perbuatan yang terpuji, pidana mati dapat diubah menjadi pidana penjara seumur hidup dengan Keputusan Presiden setelah mendapatkan pertimbangan Mahkamah Agung.`,
    explanation: 'Perubahan fundamental paradigma pidana mati di Indonesia: dari pidana pokok menjadi pidana khusus alternatif dengan hak masa percobaan perbaikan diri 10 tahun.'
  },
  {
    id: 'kuhp-pasal-624-transisi',
    docId: 'uu-kuhp-2023',
    docTitle: 'UU No. 1 Tahun 2023 tentang KUHP',
    docType: 'UU',
    bab: 'BUKU KEDUA - KETENTUAN PENUTUP',
    pasal: 'Pasal 624',
    ayat: 'Pasal tunggal',
    content: `Undang-Undang ini mulai berlaku setelah 3 (tiga) tahun terhitung sejak tanggal diundangkan.

(Catatan: UU No. 1 Tahun 2023 diundangkan pada tanggal 2 Januari 2023, sehingga masa transisi berakhir dan ketentuan KUHP Baru berlaku operasional penuh mulai tanggal 2 Januari 2026).`,
    explanation: 'Masa transisi 3 tahun diperuntukkan bagi sosialisasi aparatur penegak hukum (Polisi, Jaksa, Hakim, Advokat) serta penyusunan peraturan pelaksana.'
  },

  // ==========================================
  // UU CIPTA KERJA - KETENAGAKERJAAN (UU 6/2023)
  // ==========================================
  {
    id: 'ciptaker-pasal-156-pesangon',
    docId: 'uu-cipta-kerja-ketenagakerjaan',
    docTitle: 'UU No. 6 Tahun 2023 tentang Cipta Kerja (Ketenagakerjaan)',
    docType: 'UU',
    bab: 'BAB IV KETENAGAKERJAAN',
    pasal: 'Pasal 81 angka 44 (Mengubah Pasal 156 UU Ketenagakerjaan)',
    ayat: 'Ayat (1) s.d. (4)',
    content: `(1) Dalam hal terjadi pemutusan hubungan kerja (PHK), Pengusaha wajib membayar uang pesangon dan/atau uang penghargaan masa kerja dan uang penggantian hak yang seharusnya diterima.
(2) Perhitungan Uang Pesangon (UP) sebagaimana dimaksud pada ayat (1) paling sedikit:
a. masa kerja kurang dari 1 tahun: 1 bulan upah;
b. masa kerja 1 tahun atau lebih tetapi kurang dari 2 tahun: 2 bulan upah;
c. masa kerja 2 tahun atau lebih tetapi kurang dari 3 tahun: 3 bulan upah;
d. masa kerja 3 tahun atau lebih tetapi kurang dari 4 tahun: 4 bulan upah;
e. masa kerja 4 tahun atau lebih tetapi kurang dari 5 tahun: 5 bulan upah;
f. masa kerja 5 tahun atau lebih tetapi kurang dari 6 tahun: 6 bulan upah;
g. masa kerja 6 tahun atau lebih tetapi kurang dari 7 tahun: 7 bulan upah;
h. masa kerja 7 tahun atau lebih tetapi kurang dari 8 tahun: 8 bulan upah;
i. masa kerja 8 tahun atau lebih: 9 bulan upah maksimal.
(3) Perhitungan Uang Penghargaan Masa Kerja (UPMK) paling sedikit:
a. masa kerja 3 tahun s.d. < 6 tahun: 2 bulan upah;
b. masa kerja 6 tahun s.d. < 9 tahun: 3 bulan upah;
c. masa kerja 9 tahun s.d. < 12 tahun: 4 bulan upah;
d. masa kerja 12 tahun s.d. < 15 tahun: 5 bulan upah;
e. masa kerja 15 tahun s.d. < 18 tahun: 6 bulan upah;
f. masa kerja 18 tahun s.d. < 21 tahun: 7 bulan upah;
g. masa kerja 21 tahun s.d. < 24 tahun: 8 bulan upah;
h. masa kerja 24 tahun atau lebih: 10 bulan upah maksimal.
(4) Uang Penggantian Hak (UPH) meliputi:
a. cuti tahunan yang belum diambil dan belum gugur;
b. biaya atau ongkos pulang untuk pekerja dan keluarganya ke tempat kerja diterima;
c. hal-hal lain yang ditetapkan dalam perjanjian kerja, peraturan perusahaan, atau perjanjian kerja bersama.`,
    explanation: 'Rumus baku perhitungan kompensasi PHK. Besaran faktor pengali (misal: 0,5x, 0,75x, 1x, atau 2x) diatur lebih rinci dalam PP No. 35 Tahun 2021 berdasarkan alasan PHK spesifik seperti efisiensi, pailit, atau pelanggaran disiplin.'
  },
  {
    id: 'ciptaker-pasal-pkwt-kompensasi',
    docId: 'uu-cipta-kerja-ketenagakerjaan',
    docTitle: 'UU No. 6 Tahun 2023 tentang Cipta Kerja (Ketenagakerjaan)',
    docType: 'UU',
    bab: 'BAB IV KETENAGAKERJAAN',
    pasal: 'Pasal 81 angka 15 (Mengubah Pasal 61A UU Ketenagakerjaan)',
    ayat: 'Ayat (1) s.d. (3)',
    content: `(1) Dalam hal perjanjian kerja waktu tertentu (PKWT/karyawan kontrak) berakhir, Pengusaha wajib memberikan uang kompensasi kepada pekerja/buruh.
(2) Uang kompensasi sebagaimana dimaksud pada ayat (1) diberikan kepada pekerja/buruh yang telah mempunyai masa kerja paling sedikit 1 (satu) bulan secara terus menerus.
(3) Formula pemberian uang kompensasi PKWT:
a. PKWT selama 12 bulan terus menerus: diberikan sebesar 1 (satu) bulan upah;
b. PKWT selama kurang dari 12 bulan atau lebih dari 12 bulan: dihitung secara prorata dengan rumus (masa kerja dalam bulan / 12) x 1 bulan upah.
(4) Ketentuan uang kompensasi tidak berlaku bagi tenaga kerja asing (TKA).`,
    explanation: 'Kewajiban baru yang revolusioner dari UU Cipta Kerja yang melindungi pekerja kontrak: setiap kontrak PKWT selesai, wajib dibayarkan uang kompensasi tambahan meskipun kontrak tidak diperpanjang.'
  }
];
