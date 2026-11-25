import type { ContentItem, NotificationItem } from '../types/contentra';

export const COMMUNICATION_GOAL_MAIN =
  'Meningkatkan engagement publik dan membangun komunikasi yang efektif melalui penyusunan konten kehumasan yang terencana, relevan, dan konsisten di seluruh platform digital.';

export const TEAM_MEMBERS = [
  'Aisyah Qonita',
  'Raka Pratama',
  'Nadia Kusuma',
  'Dimas Wijaya',
  'Siti Rahmawati',
];

export const INITIAL_CONTENTS: ContentItem[] = [
  {
    id: 'cnt-101',
    title: 'Self Legislation 2.0',
    description:
      'Konten edukatif dan publikasi agenda forum legislasi mahasiswa serta sosialisasi mekanisme aspirasi terbuka.',
    communicationGoal:
      'Meningkatkan pemahaman publik internal mengenai fungsi legislasi dan mendorong partisipasi aktif dalam penyerapan aspirasi.',
    communicationIssue:
      'Rendahnya partisipasi mahasiswa dalam forum legislasi tahun sebelumnya karena kurangnya informasi alur pengajuan aspirasi.',
    targetAudience: 'Mahasiswa aktif, anggota organisasi kemahasiswaan, dan civitas akademika',
    desiredOutcome:
      'Minimal 250 peserta mendaftar forum dan meningkatnya interaksi diskusi di kolom komentar Instagram.',
    keyMessage:
      'Suara Anda menentukan arah kebijakan bersama melalui ruang legislasi yang terbuka dan akuntabel.',
    supportingMessages:
      'Tersedia kanal aspirasi daring, ringkasan draf aturan yang mudah dipahami, serta sesi tanya jawab langsung.',
    communicationStyle: 'Informatif & Persuasif',
    platform: 'Instagram',
    format: 'Carousel',
    publishDate: '2026-11-26',
    publishTime: '09:00',
    pic: 'Aisyah Qonita',
    status: 'Terjadwal',
    createdAt: '2026-11-18T09:00:00Z',
    updatedAt: '2026-11-22T14:20:00Z',
    cycle: {
      currentStage: 6,
      completedStages: [1, 2, 3, 4, 5],
      stage5Decision: 'YES',
      stage5Notes:
        'Desain carousel 7 slide telah disesuaikan dengan panduan identitas visual dan jadwal tayang pukul 09.00 WIB sudah optimal.',
      stage6ActualDate: '',
      stage6PublicNotes: '',
      stage6Decision: 'pending',
      stage6RevisionNotes: '',
      stage7Conclusion: '',
      iterationHistory: [
        {
          id: 'iter-101-1',
          timestamp: '2026-11-21 15:30',
          fromStage: 5,
          decision: 'NO',
          targetStage: 3,
          notes: 'Slide ke-3 terlalu padat teks; perlu diringkas agar pesan utama lebih mudah dipindai.',
          reviewer: 'Nadia Kusuma',
        },
        {
          id: 'iter-101-2',
          timestamp: '2026-11-22 14:20',
          fromStage: 5,
          decision: 'YES',
          notes: 'Revisi teks ringkas disetujui. Konten siap tayang sesuai jadwal 26 November 2026.',
          reviewer: 'Nadia Kusuma',
        },
      ],
    },
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      views: 0,
      audienceAgeGroup: '18-24',
      audienceGenderSplit: { female: 58, male: 42 },
    },
  },
  {
    id: 'cnt-102',
    title: 'Behind The Scene Kegiatan',
    description:
      'Cuplikan persiapan tim panitia dan kehumasan menjelang rangkaian kegiatan puncak organisasi.',
    communicationGoal:
      'Membangun kedekatan emosional dengan audiens melalui transparansi proses kerja tim di balik layar.',
    communicationIssue:
      'Audiens cenderung melihat hasil akhir acara saja tanpa merasakan antusiasme persiapan di lapangan.',
    targetAudience: 'Pengikut setia Instagram, calon peserta acara, dan relawan muda',
    desiredOutcome:
      'Meningkatkan retensi tayangan Story serta memicu rasa penasaran menjelang hari pelaksanaan.',
    keyMessage:
      'Setiap detail kegiatan dipersiapkan dengan dedikasi dan kolaborasi penuh untuk menghadirkan pengalaman terbaik.',
    supportingMessages:
      'Perkenalan singkat koordinator divisi, progres dekorasi ruang, dan pengingat tanggal acara.',
    communicationStyle: 'Hangat & Naratif',
    platform: 'Instagram Story',
    format: 'Story',
    publishDate: '2026-11-27',
    publishTime: '13:00',
    pic: 'Raka Pratama',
    status: 'Draft',
    createdAt: '2026-11-20T10:15:00Z',
    updatedAt: '2026-11-23T11:00:00Z',
    cycle: {
      currentStage: 3,
      completedStages: [1, 2],
      stage5Decision: 'pending',
      stage5Notes: '',
      stage6ActualDate: '',
      stage6PublicNotes: '',
      stage6Decision: 'pending',
      stage6RevisionNotes: '',
      stage7Conclusion: '',
      iterationHistory: [],
    },
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      views: 0,
      audienceAgeGroup: '18-24',
      audienceGenderSplit: { female: 62, male: 38 },
    },
  },
  {
    id: 'cnt-103',
    title: 'Recap Kegiatan Organisasi',
    description:
      'Video pendek rangkuman momen penting, kutipan narasumber, dan antusiasme peserta selama kegiatan berlangsung.',
    communicationGoal:
      'Mendokumentasikan dampak kegiatan sekaligus memperluas jangkauan audiens baru melalui format video dinamis.',
    communicationIssue:
      'Dokumentasi kegiatan sebelumnya hanya berupa foto statis sehingga kurang kompetitif di algoritma video pendek.',
    targetAudience: 'Generasi Z, komunitas mitra, dan publik eksternal di TikTok',
    desiredOutcome:
      'Mencapai minimal 3.500 tayangan organik dan meningkatkan jumlah shares ke jejaring eksternal.',
    keyMessage:
      'Kolaborasi nyata menghasilkan dampak positif yang terus bertumbuh bagi masyarakat kampus dan sekitar.',
    supportingMessages:
      'Statistik singkat jumlah peserta, testimoni 2 peserta terpilih, dan ajakan bergabung pada program berikutnya.',
    communicationStyle: 'Dinamis & Inspiratif',
    platform: 'TikTok',
    format: 'Reels / Video Pendek',
    publishDate: '2026-11-28',
    publishTime: '19:00',
    pic: 'Dimas Wijaya',
    status: 'Dalam Proses',
    createdAt: '2026-11-19T08:40:00Z',
    updatedAt: '2026-11-24T09:10:00Z',
    cycle: {
      currentStage: 5,
      completedStages: [1, 2, 3, 4],
      stage5Decision: 'pending',
      stage5Notes: '',
      stage6ActualDate: '',
      stage6PublicNotes: '',
      stage6Decision: 'pending',
      stage6RevisionNotes: '',
      stage7Conclusion: '',
      iterationHistory: [],
    },
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      views: 0,
      audienceAgeGroup: '18-24',
      audienceGenderSplit: { female: 55, male: 45 },
    },
  },
  {
    id: 'cnt-104',
    title: 'Informasi Kegiatan Mendatang',
    description:
      'Pengumuman resmi jadwal, syarat pendaftaran, dan manfaat mengikuti program unggulan awal Desember.',
    communicationGoal:
      'Memastikan informasi pendaftaran tersampaikan secara jelas dan mendorong konversi pendaftar lebih awal.',
    communicationIssue:
      'Banyak pertanyaan berulang mengenai tenggat waktu dan tautan pendaftaran pada publikasi sebelumnya.',
    targetAudience: 'Mahasiswa lintas fakultas, komunitas mitra, dan publik umum',
    desiredOutcome:
      'Menekan pertanyaan berulang di DM dan mencapai 80% kuota pendaftar dalam 3 hari pertama.',
    keyMessage:
      'Jangan lewatkan kesempatan berjejaring dan mengasah kapasitas diri dalam rangkaian agenda terbuka kami.',
    supportingMessages:
      'Tanggal penting, tautan registrasi ringkas, narahubung resmi, dan fasilitas sertifikat.',
    communicationStyle: 'Jelas, Formal & Informatif',
    platform: 'Instagram',
    format: 'Infografis',
    publishDate: '2026-11-30',
    publishTime: '10:00',
    pic: 'Nadia Kusuma',
    status: 'Terjadwal',
    createdAt: '2026-11-21T13:00:00Z',
    updatedAt: '2026-11-24T08:15:00Z',
    cycle: {
      currentStage: 6,
      completedStages: [1, 2, 3, 4, 5],
      stage5Decision: 'YES',
      stage5Notes: 'Alur informasi dan hierarki tanggal pada infografis sudah terverifikasi jelas.',
      stage6ActualDate: '',
      stage6PublicNotes: '',
      stage6Decision: 'pending',
      stage6RevisionNotes: '',
      stage7Conclusion: '',
      iterationHistory: [
        {
          id: 'iter-104-1',
          timestamp: '2026-11-23 16:45',
          fromStage: 5,
          decision: 'YES',
          notes: 'Konten dan jadwal publikasi pukul 10.00 WIB telah sesuai dengan tujuan komunikasi.',
          reviewer: 'Aisyah Qonita',
        },
      ],
    },
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      reach: 0,
      views: 0,
      audienceAgeGroup: '25-34',
      audienceGenderSplit: { female: 52, male: 48 },
    },
  },
  {
    id: 'cnt-105',
    title: 'Kilas Balik Rakernas Humas 2026',
    description:
      'Laporan visual hasil rapat kerja nasional bidang komunikasi publik dan rencana strategis kuartal akhir.',
    communicationGoal:
      'Menunjukkan akuntabilitas program kerja kehumasan kepada seluruh pemangku kepentingan.',
    communicationIssue:
      'Publik perlu mengetahui tindak lanjut konkret dari rapat kerja yang telah dilaksanakan.',
    targetAudience: 'Pengurus inti, alumni, mitra lembaga, dan mahasiswa',
    desiredOutcome:
      'Mendapat apresiasi positif serta menjaga konsistensi engagement di atas 6%.',
    keyMessage:
      'Komitmen komunikasi transparan berawal dari perencanaan strategis yang terukur.',
    supportingMessages:
      'Tiga poin utama hasil Rakernas, jadwal implementasi, dan kanal umpan balik terbuka.',
    communicationStyle: 'Profesional & Transparan',
    platform: 'Instagram',
    format: 'Carousel',
    publishDate: '2026-11-05',
    publishTime: '11:00',
    pic: 'Aisyah Qonita',
    status: 'Terpublikasi',
    createdAt: '2026-11-01T09:00:00Z',
    updatedAt: '2026-11-07T16:30:00Z',
    cycle: {
      currentStage: 7,
      completedStages: [1, 2, 3, 4, 5, 6, 7],
      stage5Decision: 'YES',
      stage5Notes: 'Seluruh poin keputusan rapat terverifikasi akurat oleh sekretaris jenderal.',
      stage6ActualDate: '2026-11-05',
      stage6PublicNotes:
        'Respons audiens sangat positif; 42 komentar mendukung transparansi program kerja dan banyak disimpan oleh pengurus divisi lain.',
      stage6Decision: 'YES',
      stage6RevisionNotes: '',
      stage7Conclusion:
        'Siklus berhasil melampaui target engagement rate 6% dengan tingkat simpan dan bagikan yang tinggi. Pola carousel 6 slide terbukti efektif untuk laporan program.',
      iterationHistory: [
        {
          id: 'iter-105-1',
          timestamp: '2026-11-04 14:10',
          fromStage: 5,
          decision: 'YES',
          notes: 'Siap publikasi tanggal 5 November pukul 11.00 WIB.',
          reviewer: 'Nadia Kusuma',
        },
        {
          id: 'iter-105-2',
          timestamp: '2026-11-07 16:30',
          fromStage: 6,
          decision: 'YES',
          notes: 'Respons publik positif dan selaras dengan tujuan akuntabilitas.',
          reviewer: 'Aisyah Qonita',
        },
      ],
    },
    metrics: {
      likes: 412,
      comments: 42,
      shares: 68,
      reach: 5420,
      views: 6890,
      audienceAgeGroup: '18-24',
      audienceGenderSplit: { female: 60, male: 40 },
    },
  },
  {
    id: 'cnt-106',
    title: 'Tips Komunikasi Publik Efektif',
    description:
      'Video singkat 45 detik berisi tiga prinsip dasar menyusun siaran pers dan narasi media sosial.',
    communicationGoal:
      'Menghadirkan konten edukatif bernilai tinggi yang mudah dibagikan ulang oleh audiens muda.',
    communicationIssue:
      'Anggota baru tim publikasi sering kesulitan menentukan sudut pandang berita yang ringkas.',
    targetAudience: 'Mahasiswa komunikasi, pegiat media sosial kampus, dan kreator muda',
    desiredOutcome:
      'Meningkatkan jangkauan non-pengikut di TikTok serta rasio bagikan di atas 3%.',
    keyMessage:
      'Pesan yang kuat dimulai dari satu tujuan jelas, kalimat ringkas, dan empati kepada pembaca.',
    supportingMessages:
      'Contoh perbandingan kalimat panjang vs efektif dan ajakan mencoba alur MUQOLIP.',
    communicationStyle: 'Edukatif & Ringkas',
    platform: 'TikTok',
    format: 'Reels / Video Pendek',
    publishDate: '2026-11-10',
    publishTime: '19:00',
    pic: 'Dimas Wijaya',
    status: 'Terpublikasi',
    createdAt: '2026-11-06T08:00:00Z',
    updatedAt: '2026-11-12T20:00:00Z',
    cycle: {
      currentStage: 7,
      completedStages: [1, 2, 3, 4, 5, 6, 7],
      stage5Decision: 'YES',
      stage5Notes: 'Ritme penyuntingan video dan takarir sudah jelas tanpa gangguan audio.',
      stage6ActualDate: '2026-11-10',
      stage6PublicNotes:
        'Video masuk beranda rekomendasi kampus, menghasilkan 156 shares dan banyak pertanyaan lanjutan mengenai teknik penulisan siaran pers.',
      stage6Decision: 'YES',
      stage6RevisionNotes: '',
      stage7Conclusion:
        'Jam tayang 19.00 WIB pada TikTok menghasilkan jangkauan tertinggi bulan November. Konten edukatif seri lanjutan direkomendasikan untuk bulan depan.',
      iterationHistory: [
        {
          id: 'iter-106-1',
          timestamp: '2026-11-09 17:00',
          fromStage: 5,
          decision: 'YES',
          notes: 'Lolos kurasi visual dan durasi 45 detik.',
          reviewer: 'Raka Pratama',
        },
        {
          id: 'iter-106-2',
          timestamp: '2026-11-12 20:00',
          fromStage: 6,
          decision: 'YES',
          notes: 'Performa melampaui target jangkauan.',
          reviewer: 'Dimas Wijaya',
        },
      ],
    },
    metrics: {
      likes: 684,
      comments: 61,
      shares: 156,
      reach: 8450,
      views: 11200,
      audienceAgeGroup: '18-24',
      audienceGenderSplit: { female: 56, male: 44 },
    },
  },
  {
    id: 'cnt-107',
    title: 'Utas Ringkasan Kebijakan Layanan Publik',
    description:
      'Utas informatif mengenai pembaruan alur layanan pengaduan dan saluran respons cepat organisasi.',
    communicationGoal:
      'Menyampaikan pembaruan kebijakan layanan secara terstruktur agar mudah dikutip dan didiskusikan.',
    communicationIssue:
      'Audiens di platform berbasis teks membutuhkan rujukan cepat tanpa harus mengunduh dokumen PDF.',
    targetAudience: 'Jurnalis kampus, pengamat kebijakan, alumni, dan pengguna layanan',
    desiredOutcome:
      'Meningkatkan repost dan diskusi konstruktif pada utas resmi X/Twitter.',
    keyMessage:
      'Layanan pengaduan kini lebih ringkas dengan batas respons maksimal 2x24 jam kerja.',
    supportingMessages:
      'Tautan formulir terpadu, alur eskalasi, dan nomor pusat informasi resmi.',
    communicationStyle: 'Lugas & Terstruktur',
    platform: 'X/Twitter',
    format: 'Thread',
    publishDate: '2026-11-14',
    publishTime: '10:00',
    pic: 'Siti Rahmawati',
    status: 'Terpublikasi',
    createdAt: '2026-11-11T07:30:00Z',
    updatedAt: '2026-11-16T12:15:00Z',
    cycle: {
      currentStage: 7,
      completedStages: [1, 2, 3, 4, 5, 6, 7],
      stage5Decision: 'YES',
      stage5Notes: 'Setiap poin utas sudah memenuhi batas karakter dan tautan aktif telah diuji.',
      stage6ActualDate: '2026-11-14',
      stage6PublicNotes:
        'Mendapat 54 repost dan diskusi positif mengenai kecepatan layanan baru.',
      stage6Decision: 'YES',
      stage6RevisionNotes: '',
      stage7Conclusion:
        'Format thread efektif untuk menyampaikan informasi prosedural di X/Twitter pada jam kerja pagi.',
      iterationHistory: [
        {
          id: 'iter-107-1',
          timestamp: '2026-11-13 15:20',
          fromStage: 5,
          decision: 'YES',
          notes: 'Siap dipublikasikan sesuai jadwal.',
          reviewer: 'Nadia Kusuma',
        },
        {
          id: 'iter-107-2',
          timestamp: '2026-11-16 12:15',
          fromStage: 6,
          decision: 'YES',
          notes: 'Tujuan komunikasi tersampaikan dengan baik.',
          reviewer: 'Siti Rahmawati',
        },
      ],
    },
    metrics: {
      likes: 198,
      comments: 29,
      shares: 54,
      reach: 3250,
      views: 4180,
      audienceAgeGroup: '25-34',
      audienceGenderSplit: { female: 48, male: 52 },
    },
  },
  {
    id: 'cnt-108',
    title: 'Buletin Kemitraan & Kolaborasi Komunitas',
    description:
      'Publikasi rangkuman program kolaborasi bersama mitra eksternal dan komunitas daerah selama kuartal ini.',
    communicationGoal:
      'Memperkuat citra kolaboratif organisasi di kalangan mitra senior, orang tua, dan jaringan alumni.',
    communicationIssue:
      'Segmen audiens berusia dewasa lebih aktif mengikuti informasi lengkap melalui Facebook.',
    targetAudience: 'Alumni, mitra eksternal, tokoh komunitas, dan orang tua mahasiswa',
    desiredOutcome:
      'Mendorong interaksi komentar dukungan dan pembagian informasi ke grup komunitas.',
    keyMessage:
      'Sinergi lintas komunitas membuka ruang manfaat yang lebih luas dan berkelanjutan.',
    supportingMessages:
      'Daftar 5 mitra kolaborasi, foto dokumentasi kegiatan lapangan, dan kontak kemitraan.',
    communicationStyle: 'Formal & Apresiatif',
    platform: 'Facebook',
    format: 'Single Post',
    publishDate: '2026-11-18',
    publishTime: '15:00',
    pic: 'Raka Pratama',
    status: 'Terpublikasi',
    createdAt: '2026-11-14T11:00:00Z',
    updatedAt: '2026-11-20T09:45:00Z',
    cycle: {
      currentStage: 7,
      completedStages: [1, 2, 3, 4, 5, 6, 7],
      stage5Decision: 'YES',
      stage5Notes: 'Penyebutan nama seluruh mitra sudah diverifikasi sesuai MoU.',
      stage6ActualDate: '2026-11-18',
      stage6PublicNotes:
        'Mitra eksternal ikut membagikan ulang postingan ke halaman resmi masing-masing.',
      stage6Decision: 'YES',
      stage6RevisionNotes: '',
      stage7Conclusion:
        'Facebook tetap relevan untuk menjangkau segmen usia 25–44 tahun serta mitra kelembagaan.',
      iterationHistory: [
        {
          id: 'iter-108-1',
          timestamp: '2026-11-17 16:00',
          fromStage: 5,
          decision: 'YES',
          notes: 'Disetujui untuk penayangan sore.',
          reviewer: 'Aisyah Qonita',
        },
        {
          id: 'iter-108-2',
          timestamp: '2026-11-20 09:45',
          fromStage: 6,
          decision: 'YES',
          notes: 'Respons mitra sangat baik.',
          reviewer: 'Raka Pratama',
        },
      ],
    },
    metrics: {
      likes: 164,
      comments: 24,
      shares: 38,
      reach: 2890,
      views: 3420,
      audienceAgeGroup: '35-44',
      audienceGenderSplit: { female: 49, male: 51 },
    },
  },
  {
    id: 'cnt-109',
    title: 'Sosialisasi Pedoman Etika Media Sosial',
    description:
      'Infografis ringkas tentang etika komunikasi digital dan tata cara verifikasi informasi sebelum publikasi.',
    communicationGoal:
      'Menyamakan standar komunikasi seluruh fungsionaris sebelum memasuki periode kampanye akhir tahun.',
    communicationIssue:
      'Ditemukan beberapa perbedaan format kutipan dan penggunaan logo pada unggahan divisi.',
    targetAudience: 'Seluruh tim humas, media partner, dan pengurus divisi',
    desiredOutcome:
      'Seluruh anggota memahami standar komunikasi resmi dan menurunkan kesalahan penulisan.',
    keyMessage:
      'Konsistensi identitas dan ketepatan fakta adalah fondasi kepercayaan publik.',
    supportingMessages:
      'Daftar periksa sebelum unggah, tautan kit media, dan kontak editor.',
    communicationStyle: 'Edukatif & Tegas',
    platform: 'Instagram',
    format: 'Infografis',
    publishDate: '2026-11-22',
    publishTime: '09:00',
    pic: 'Nadia Kusuma',
    status: 'Terpublikasi',
    createdAt: '2026-11-17T10:00:00Z',
    updatedAt: '2026-11-23T18:00:00Z',
    cycle: {
      currentStage: 6,
      completedStages: [1, 2, 3, 4, 5],
      stage5Decision: 'YES',
      stage5Notes: 'Visual pedoman sudah jelas dan mudah dibaca pada layar ponsel.',
      stage6ActualDate: '2026-11-22',
      stage6PublicNotes:
        'Jangkauan cukup baik namun tingkat komentar masih rendah karena belum ada pertanyaan pemantik di caption.',
      stage6Decision: 'pending',
      stage6RevisionNotes: '',
      stage7Conclusion: '',
      iterationHistory: [
        {
          id: 'iter-109-1',
          timestamp: '2026-11-21 10:00',
          fromStage: 5,
          decision: 'YES',
          notes: 'Siap publikasi sesuai jadwal pagi.',
          reviewer: 'Aisyah Qonita',
        },
      ],
    },
    metrics: {
      likes: 235,
      comments: 14,
      shares: 31,
      reach: 3820,
      views: 4510,
      audienceAgeGroup: '18-24',
      audienceGenderSplit: { female: 57, male: 43 },
    },
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Jadwal Tayang Mendekat',
    message: 'Self Legislation 2.0 dijadwalkan tayang pada 26 November 2026 pukul 09:00 WIB.',
    timestamp: '24 Nov 2026, 09:15',
    read: false,
    relatedContentId: 'cnt-101',
  },
  {
    id: 'notif-2',
    title: 'Menunggu Evaluasi Tahap 5',
    message: 'Recap Kegiatan Organisasi siap memasuki tahap evaluasi kesesuaian konten MUQOLIP.',
    timestamp: '24 Nov 2026, 08:40',
    read: false,
    relatedContentId: 'cnt-103',
  },
  {
    id: 'notif-3',
    title: 'Pemantauan Respons Publik',
    message: 'Sosialisasi Pedoman Etika Media Sosial telah tayang dan menunggu keputusan akhir Tahap 6.',
    timestamp: '23 Nov 2026, 18:00',
    read: true,
    relatedContentId: 'cnt-109',
  },
];
