import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  GitBranch,
  History,
  Play,
  RotateCcw,
  Save,
  Sparkles,
  User,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useContentra } from '../context/ContentraContext';
import { TEAM_MEMBERS } from '../data/initialData';
import type {
  AudienceAgeGroup,
  ContentFormat,
  MuqolipStage,
  NavPage,
  PlatformType,
} from '../types/contentra';
import {
  ALL_PLATFORMS,
  calculateEngagementRate,
  formatCompactTime,
  formatEngagementRate,
  formatIndonesianDate,
  formatNumber,
} from '../utils/formatters';

interface MuqolipCyclePageProps {
  onNavigate: (page: NavPage) => void;
}

const STAGE_META: {
  stage: MuqolipStage;
  shortTitle: string;
  title: string;
  subtitle: string;
  isDecision?: boolean;
}[] = [
  {
    stage: 1,
    shortTitle: 'Mulai',
    title: 'Tahap 1 — Mulai',
    subtitle: 'Inisiasi proyek konten kehumasan baru',
  },
  {
    stage: 2,
    shortTitle: 'Tujuan Komunikasi',
    title: 'Tahap 2 — Menentukan Tujuan Komunikasi Humas',
    subtitle: 'Rumusan tujuan, isu komunikasi, target audiens & capaian',
  },
  {
    stage: 3,
    shortTitle: 'Pesan & Media',
    title: 'Tahap 3 — Menentukan Pesan dan Memilih Media',
    subtitle: 'Pesan utama, pendukung, gaya bahasa, platform & format',
  },
  {
    stage: 4,
    shortTitle: 'Jadwal & Kalender',
    title: 'Tahap 4 — Menentukan Jadwal & Kalender Konten',
    subtitle: 'Penentuan waktu tayang, PIC, dan sinkronisasi kalender',
  },
  {
    stage: 5,
    shortTitle: 'Evaluasi Kesesuaian',
    title: 'Tahap 5 — Evaluasi Kesesuaian Konten dan Jadwal',
    subtitle: 'Decision point kesesuaian konten terhadap tujuan komunikasi',
    isDecision: true,
  },
  {
    stage: 6,
    shortTitle: 'Publikasi & Respons',
    title: 'Tahap 6 — Publikasi dan Memantau Respons Publik',
    subtitle: 'Tayang aktual, metrik interaksi & evaluasi respons publik',
    isDecision: true,
  },
  {
    stage: 7,
    shortTitle: 'Selesai',
    title: 'Tahap 7 — Selesai',
    subtitle: 'Ringkasan komprehensif hasil siklus & kesimpulan',
  },
];

const FORMAT_OPTIONS: ContentFormat[] = [
  'Carousel',
  'Reels / Video Pendek',
  'Single Post',
  'Story',
  'Infografis',
  'Thread',
];

const STYLE_OPTIONS = [
  'Informatif & Persuasif',
  'Edukatif & Ringkas',
  'Hangat & Naratif',
  'Lugas & Terstruktur',
  'Formal & Apresiatif',
  'Dinamis & Inspiratif',
];

export function MuqolipCyclePage({ onNavigate }: MuqolipCyclePageProps) {
  const {
    items,
    activeCycleContentId,
    setActiveCycleContentId,
    startNewCycleProject,
    advanceStage1To2,
    saveStage2,
    saveStage3,
    saveStage4,
    submitStage5Decision,
    saveStage6Metrics,
    submitStage6Decision,
    saveStage7Conclusion,
  } = useContentra();

  const activeItem = useMemo(
    () => items.find((i) => i.id === activeCycleContentId) ?? items[0] ?? null,
    [items, activeCycleContentId]
  );

  const [selectedStage, setSelectedStage] = useState<MuqolipStage>(
    activeItem?.cycle.currentStage ?? 1
  );

  // Sync selectedStage when switching project
  useEffect(() => {
    if (activeItem) {
      setSelectedStage(activeItem.cycle.currentStage);
    }
  }, [activeItem?.id, activeItem?.cycle.currentStage]);

  // Form states per stage
  const [newProjectTitle, setNewProjectTitle] = useState('');

  // Stage 2 state
  const [s2Goal, setS2Goal] = useState('');
  const [s2Issue, setS2Issue] = useState('');
  const [s2Audience, setS2Audience] = useState('');
  const [s2Outcome, setS2Outcome] = useState('');

  // Stage 3 state
  const [s3KeyMessage, setS3KeyMessage] = useState('');
  const [s3Supporting, setS3Supporting] = useState('');
  const [s3Style, setS3Style] = useState(STYLE_OPTIONS[0]);
  const [s3Platform, setS3Platform] = useState<PlatformType>('Instagram');
  const [s3Format, setS3Format] = useState<ContentFormat>('Carousel');

  // Stage 4 state
  const [s4Date, setS4Date] = useState('2026-11-26');
  const [s4Time, setS4Time] = useState('09:00');
  const [s4Platform, setS4Platform] = useState<PlatformType>('Instagram');
  const [s4Pic, setS4Pic] = useState(TEAM_MEMBERS[0]);

  // Stage 5 Decision state
  const [s5Mode, setS5Mode] = useState<'none' | 'YES' | 'NO'>('none');
  const [s5Notes, setS5Notes] = useState('');
  const [s5TargetStage, setS5TargetStage] = useState<MuqolipStage>(3);
  const [s5Reviewer, setS5Reviewer] = useState(TEAM_MEMBERS[0]);

  // Stage 6 Metrics & Decision state
  const [s6MarkPublished, setS6MarkPublished] = useState(true);
  const [s6ActualDate, setS6ActualDate] = useState('2026-11-24');
  const [s6Likes, setS6Likes] = useState(0);
  const [s6Comments, setS6Comments] = useState(0);
  const [s6Shares, setS6Shares] = useState(0);
  const [s6Reach, setS6Reach] = useState(0);
  const [s6Views, setS6Views] = useState(0);
  const [s6AgeGroup, setS6AgeGroup] = useState<AudienceAgeGroup>('18-24');
  const [s6PublicNotes, setS6PublicNotes] = useState('');
  const [s6Mode, setS6Mode] = useState<'none' | 'YES' | 'NO'>('none');
  const [s6EvalNotes, setS6EvalNotes] = useState('');
  const [s6TargetStage, setS6TargetStage] = useState<MuqolipStage>(2);
  const [s6Reviewer, setS6Reviewer] = useState(TEAM_MEMBERS[0]);

  // Stage 7 state
  const [s7Conclusion, setS7Conclusion] = useState('');

  useEffect(() => {
    if (!activeItem) return;
    setS2Goal(activeItem.communicationGoal);
    setS2Issue(activeItem.communicationIssue);
    setS2Audience(activeItem.targetAudience);
    setS2Outcome(activeItem.desiredOutcome);

    setS3KeyMessage(activeItem.keyMessage);
    setS3Supporting(activeItem.supportingMessages);
    setS3Style(activeItem.communicationStyle || STYLE_OPTIONS[0]);
    setS3Platform(activeItem.platform);
    setS3Format(activeItem.format);

    setS4Date(activeItem.publishDate);
    setS4Time(activeItem.publishTime);
    setS4Platform(activeItem.platform);
    setS4Pic(activeItem.pic);

    setS5Notes(activeItem.cycle.stage5Notes);
    setS5Mode('none');

    setS6MarkPublished(activeItem.status === 'Terpublikasi');
    setS6ActualDate(activeItem.cycle.stage6ActualDate || activeItem.publishDate || '2026-11-24');
    setS6Likes(activeItem.metrics.likes);
    setS6Comments(activeItem.metrics.comments);
    setS6Shares(activeItem.metrics.shares);
    setS6Reach(activeItem.metrics.reach);
    setS6Views(activeItem.metrics.views);
    setS6AgeGroup(activeItem.metrics.audienceAgeGroup);
    setS6PublicNotes(activeItem.cycle.stage6PublicNotes);
    setS6EvalNotes(activeItem.cycle.stage6RevisionNotes);
    setS6Mode('none');

    setS7Conclusion(activeItem.cycle.stage7Conclusion);
  }, [activeItem]);

  // Mini calendar dates for November 2026 (Nov 1 2026 is Sunday)
  const novCalendarDays = useMemo(() => {
    const days: { day: number; iso: string; count: number }[] = [];
    for (let d = 1; d <= 30; d++) {
      const iso = `2026-11-${String(d).padStart(2, '0')}`;
      const count = items.filter((i) => i.publishDate === iso).length;
      days.push({ day: d, iso, count });
    }
    return days;
  }, [items]);

  const revisionCount = useMemo(() => {
    if (!activeItem) return 0;
    return activeItem.cycle.iterationHistory.filter((it) => it.decision === 'NO').length;
  }, [activeItem]);

  const liveStage6Er = useMemo(
    () => calculateEngagementRate(s6Likes, s6Comments, s6Shares, s6Reach),
    [s6Likes, s6Comments, s6Shares, s6Reach]
  );

  const handleStartNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created = startNewCycleProject(
      newProjectTitle.trim() || `Proyek Konten Baru ${items.length + 1}`
    );
    setNewProjectTitle('');
    setActiveCycleContentId(created.id);
    setSelectedStage(2);
  };

  if (!activeItem) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="text-lg font-bold text-slate-900">
          Belum Ada Proyek Konten di Siklus MUQOLIP
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Mulai siklus baru untuk menyusun konten kehumasan dari Tahap 1 hingga Tahap 7.
        </p>
        <button
          type="button"
          onClick={() => startNewCycleProject('Proyek Konten Kehumasan Perdana')}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800"
        >
          <Play className="h-4 w-4" />
          Mulai Siklus Baru
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
              <GitBranch className="h-4 w-4" />
              <span>Alur Kerja Kehumasan Interaktif</span>
            </div>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Siklus Literatif Tunggal Penyusunan Konten Kehumasan MUQOLIP
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              Klik setiap tahapan pada flowchart untuk melihat detail, mengisi form penyusunan, melakukan evaluasi keputusan YES/NO, dan memantau riwayat iterasi revisi.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="min-w-[240px]">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Pilih Proyek Konten Aktif
              </label>
              <select
                value={activeItem.id}
                onChange={(e) => setActiveCycleContentId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none"
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} (Tahap {item.cycle.currentStage}/7 — {item.status})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleStartNewProject} className="flex items-end gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Buat Proyek Siklus Baru
                </label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  placeholder="Judul proyek konten..."
                  className="w-44 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-violet-600 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-800 transition-colors whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Mulai Siklus</span>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={activeItem.status} size="md" />
            <span className="text-slate-600">
              Tahap Aktif: <strong className="text-slate-900">Tahap {activeItem.cycle.currentStage} dari 7</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-slate-600">
              Platform: <strong className="text-slate-900">{activeItem.platform}</strong>
            </span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-600">
              Iterasi Revisi: <strong className="text-amber-700">{revisionCount}x</strong>
            </span>
          </div>
          <span className="text-slate-500">
            Penanggung Jawab: <strong className="text-slate-800">{activeItem.pic}</strong>
          </span>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">
        <section className="xl:col-span-5 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Diagram Alur Interaktif MUQOLIP
              </h3>
              <p className="text-[11px] text-slate-500">
                Klik simpul tahap atau belah ketupat keputusan untuk mengelola.
              </p>
            </div>
            <span className="font-mono text-xs tabular-nums text-violet-700 font-semibold">
              {Math.round((activeItem.cycle.completedStages.length / 7) * 100)}% Selesai
            </span>
          </div>

          <div className="relative flex flex-col items-center">
            {STAGE_META.map((meta, index) => {
              const isSelected = selectedStage === meta.stage;
              const isCurrent = activeItem.cycle.currentStage === meta.stage;
              const isCompleted = activeItem.cycle.completedStages.includes(meta.stage);

              return (
                <div key={meta.stage} className="w-full flex flex-col items-center">
                  {meta.isDecision ? (
                    <button
                      type="button"
                      onClick={() => setSelectedStage(meta.stage)}
                      className={`group relative w-full rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600/20'
                          : isCurrent
                            ? 'border-blue-400 bg-blue-50/50 hover:border-blue-500'
                            : isCompleted
                              ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                          <div
                            className={`h-9 w-9 rotate-45 rounded-md border-2 transition-colors ${
                              isSelected
                                ? 'border-violet-700 bg-violet-700'
                                : isCurrent
                                  ? 'border-blue-700 bg-blue-600'
                                  : isCompleted
                                    ? 'border-emerald-600 bg-emerald-600'
                                    : 'border-slate-400 bg-white'
                            }`}
                          />
                          <span
                            className={`relative z-10 font-mono text-xs font-bold ${
                              isSelected || isCurrent || isCompleted
                                ? 'text-white'
                                : 'text-slate-700'
                            }`}
                          >
                            T{meta.stage}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {meta.shortTitle} (Decision)
                            </span>
                            {isCurrent && (
                              <span className="font-mono text-[10px] font-semibold text-violet-700">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                            {meta.subtitle}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
                              YES → {meta.stage === 5 ? 'Tahap 6' : 'Tahap 7'}
                            </span>
                            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">
                              NO ↺ Kembali Revisi
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedStage(meta.stage)}
                      className={`w-full rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-600/20'
                          : isCurrent
                            ? 'border-blue-400 bg-blue-50/50 hover:border-blue-500'
                            : isCompleted
                              ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                            isSelected
                              ? 'bg-violet-700 text-white'
                              : isCurrent
                                ? 'bg-blue-700 text-white'
                                : isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {isCompleted && !isCurrent ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            `T${meta.stage}`
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {meta.shortTitle}
                            </span>
                            {isCurrent && (
                              <span className="font-mono text-[10px] font-semibold text-violet-700">
                                Aktif
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
                            {meta.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  )}

                  {index < STAGE_META.length - 1 && (
                    <div className="flex items-center justify-center py-1 text-slate-300">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-900">
            <div className="flex items-center gap-1.5 font-semibold">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Mekanisme Literatif (Loop Perbaikan)</span>
            </div>
            <p className="mt-1 leading-relaxed text-amber-800">
              Jika evaluasi pada Tahap 5 atau Tahap 6 menghasilkan keputusan <strong>NO</strong>, sistem mencatat riwayat iterasi dan mengarahkan proyek kembali ke tahap terkait untuk diperbaiki sebelum diajukan ulang.
            </p>
          </div>
        </section>

        <div className="xl:col-span-7 space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs font-semibold text-violet-700">
                  {STAGE_META[selectedStage - 1]?.title}
                </div>
                <h3 className="mt-0.5 text-lg font-bold text-slate-900">
                  {activeItem.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedStage(s as MuqolipStage)}
                    className={`h-7 w-7 rounded-md font-mono text-xs font-semibold transition-colors ${
                      selectedStage === s
                        ? 'bg-violet-700 text-white'
                        : activeItem.cycle.completedStages.includes(s as MuqolipStage)
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {selectedStage === 1 && (
              <div className="mt-5 space-y-5">
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Titik Awal Penyusunan Konten Kehumasan
                  </h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    Tahap 1 menginisiasi proyek konten baru agar seluruh perencanaan, penyusunan pesan, penjadwalan, hingga pemantauan respons publik terdokumentasi dalam satu siklus terpadu.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        advanceStage1To2(activeItem.id);
                        setSelectedStage(2);
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <span>Lanjutkan Proyek Ini ke Tahap 2</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <form
                  onSubmit={handleStartNewProject}
                  className="rounded-xl border border-slate-200 p-5 space-y-3"
                >
                  <h4 className="text-sm font-semibold text-slate-900">
                    Atau Mulai Siklus Proyek Konten Baru
                  </h4>
                  <p className="text-xs text-slate-500">
                    Membuat entri konten baru dengan status Draft dan langsung memulai alur MUQOLIP dari awal.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={newProjectTitle}
                      onChange={(e) => setNewProjectTitle(e.target.value)}
                      placeholder="Masukkan judul proyek konten baru..."
                      className="flex-1 rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800 whitespace-nowrap"
                    >
                      <Play className="h-4 w-4" />
                      <span>Mulai Siklus</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {selectedStage === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveStage2(
                    activeItem.id,
                    {
                      communicationGoal: s2Goal,
                      communicationIssue: s2Issue,
                      targetAudience: s2Audience,
                      desiredOutcome: s2Outcome,
                    },
                    true
                  );
                  setSelectedStage(3);
                }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tujuan Komunikasi <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={s2Goal}
                    onChange={(e) => setS2Goal(e.target.value)}
                    placeholder="Jelaskan tujuan komunikasi yang ingin dicapai..."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Permasalahan atau Kebutuhan Komunikasi <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={s2Issue}
                    onChange={(e) => setS2Issue(e.target.value)}
                    placeholder="Apa kesenjangan informasi atau kebutuhan audiens yang melatarbelakangi konten ini?"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Audiens <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={s2Audience}
                    onChange={(e) => setS2Audience(e.target.value)}
                    placeholder="Segmen audiens utama dan sekunder..."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hasil yang Ingin Dicapai (Expected Outcome) <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={s2Outcome}
                    onChange={(e) => setS2Outcome(e.target.value)}
                    placeholder="Indikator keberhasilan terukur, misal target partisipan atau tingkat interaksi..."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      saveStage2(
                        activeItem.id,
                        {
                          communicationGoal: s2Goal,
                          communicationIssue: s2Issue,
                          targetAudience: s2Audience,
                          desiredOutcome: s2Outcome,
                        },
                        false
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Progres
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
                  >
                    <span>Simpan & Lanjut Tahap 3</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}

            {selectedStage === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveStage3(
                    activeItem.id,
                    {
                      keyMessage: s3KeyMessage,
                      supportingMessages: s3Supporting,
                      communicationStyle: s3Style,
                      platform: s3Platform,
                      format: s3Format,
                    },
                    true
                  );
                  setSelectedStage(4);
                }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pesan Utama (Key Message) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={s3KeyMessage}
                    onChange={(e) => setS3KeyMessage(e.target.value)}
                    placeholder="Inti pesan yang harus dipahami audiens..."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pesan Pendukung <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={s3Supporting}
                    onChange={(e) => setS3Supporting(e.target.value)}
                    placeholder="Fakta pendukung, poin rincian, atau ajakan bertindak (CTA)..."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Gaya Komunikasi
                    </label>
                    <select
                      value={s3Style}
                      onChange={(e) => setS3Style(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-600 focus:outline-none"
                    >
                      {STYLE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Platform / Media Dipilih
                    </label>
                    <select
                      value={s3Platform}
                      onChange={(e) => {
                        const p = e.target.value as PlatformType;
                        setS3Platform(p);
                        setS4Platform(p);
                      }}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-600 focus:outline-none"
                    >
                      {ALL_PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Format Konten
                    </label>
                    <select
                      value={s3Format}
                      onChange={(e) => setS3Format(e.target.value as ContentFormat)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-600 focus:outline-none"
                    >
                      {FORMAT_OPTIONS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      saveStage3(
                        activeItem.id,
                        {
                          keyMessage: s3KeyMessage,
                          supportingMessages: s3Supporting,
                          communicationStyle: s3Style,
                          platform: s3Platform,
                          format: s3Format,
                        },
                        false
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Progres
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
                  >
                    <span>Simpan & Lanjut Tahap 4</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}

            {selectedStage === 4 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveStage4(
                    activeItem.id,
                    {
                      publishDate: s4Date,
                      publishTime: s4Time,
                      platform: s4Platform,
                      pic: s4Pic,
                    },
                    true
                  );
                  setSelectedStage(5);
                }}
                className="mt-5 space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Tanggal Publikasi <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      value={s4Date}
                      onChange={(e) => setS4Date(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Jam Publikasi <span className="text-rose-600">*</span>
                    </label>
                    <input
                      required
                      type="time"
                      value={s4Time}
                      onChange={(e) => setS4Time(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Platform Publikasi
                    </label>
                    <select
                      value={s4Platform}
                      onChange={(e) => setS4Platform(e.target.value as PlatformType)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                    >
                      {ALL_PLATFORMS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Penanggung Jawab
                    </label>
                    <input
                      required
                      type="text"
                      list="muqolip-pic-list"
                      value={s4Pic}
                      onChange={(e) => setS4Pic(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                    />
                    <datalist id="muqolip-pic-list">
                      {TEAM_MEMBERS.map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Kalender Publikasi (Nov 2026)
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('kalender')}
                        className="text-[11px] font-semibold text-violet-700 hover:underline"
                      >
                        Buka Kalender Penuh
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-slate-400 mb-1">
                      <span>Min</span>
                      <span>Sen</span>
                      <span>Sel</span>
                      <span>Rab</span>
                      <span>Kam</span>
                      <span>Jum</span>
                      <span>Sab</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {novCalendarDays.map((d) => {
                        const isPicked = s4Date === d.iso;
                        return (
                          <button
                            key={d.iso}
                            type="button"
                            onClick={() => setS4Date(d.iso)}
                            title={`${d.iso}: ${d.count} konten terjadwal`}
                            className={`rounded py-1 font-mono text-[11px] tabular-nums transition-colors ${
                              isPicked
                                ? 'bg-violet-700 font-bold text-white'
                                : d.count > 0
                                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                  : 'bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {d.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-blue-900">
                        Preview Jadwal Konten
                      </div>
                      <h5 className="mt-2 text-sm font-bold text-slate-900">
                        {activeItem.title}
                      </h5>
                      <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                        {activeItem.keyMessage || activeItem.description}
                      </p>
                      <div className="mt-3 space-y-1.5 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-blue-700" />
                          <span>{formatIndonesianDate(s4Date, true)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-blue-700" />
                          <span className="font-mono tabular-nums">
                            {formatCompactTime(s4Time)} · {s4Platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-blue-700" />
                          <span>PIC: {s4Pic}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-500">
                      Menyimpan jadwal di sini otomatis memperbarui Content Calendar.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() =>
                      saveStage4(
                        activeItem.id,
                        {
                          publishDate: s4Date,
                          publishTime: s4Time,
                          platform: s4Platform,
                          pic: s4Pic,
                        },
                        false
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Jadwal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
                  >
                    <span>Simpan & Lanjut Tahap 5 Evaluasi</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </form>
            )}

            {selectedStage === 5 && (
              <div className="mt-5 space-y-5">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-800">Ringkasan Bahan Evaluasi:</div>
                  <p className="text-slate-600">
                    <strong>Tujuan:</strong> {activeItem.communicationGoal || '-'}
                  </p>
                  <p className="text-slate-600">
                    <strong>Pesan Utama:</strong> {activeItem.keyMessage || '-'}
                  </p>
                  <p className="text-slate-600">
                    <strong>Jadwal & Media:</strong> {activeItem.platform} ({activeItem.format}) ·{' '}
                    {formatIndonesianDate(activeItem.publishDate)} pukul{' '}
                    {formatCompactTime(activeItem.publishTime)}
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl border border-violet-200 bg-violet-50/40 p-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center">
                    <div className="h-11 w-11 rotate-45 rounded-lg border-2 border-violet-700 bg-violet-700 shadow-sm" />
                    <span className="absolute font-mono text-xs font-bold text-white">
                      ?
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 max-w-md">
                    Apakah konten dan jadwal publikasi sudah sesuai dengan tujuan komunikasi?
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    Status keputusan saat ini:{' '}
                    <strong>
                      {activeItem.cycle.stage5Decision === 'pending'
                        ? 'Menunggu Evaluasi'
                        : activeItem.cycle.stage5Decision}
                    </strong>
                  </p>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setS5Mode('YES')}
                      className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-colors ${
                        s5Mode === 'YES'
                          ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>YES — Sesuai & Siap Publikasi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setS5Mode('NO')}
                      className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-colors ${
                        s5Mode === 'NO'
                          ? 'bg-amber-700 text-white ring-2 ring-amber-500/30'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>NO — Perlu Penyesuaian / Perbaikan</span>
                    </button>
                  </div>
                </div>

                {s5Mode !== 'none' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitStage5Decision(
                        activeItem.id,
                        s5Mode,
                        s5Notes,
                        s5TargetStage,
                        s5Reviewer
                      );
                      setSelectedStage(s5Mode === 'YES' ? 6 : s5TargetStage);
                      setS5Mode('none');
                    }}
                    className={`rounded-xl border p-5 space-y-4 ${
                      s5Mode === 'YES'
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-slate-900">
                        {s5Mode === 'YES'
                          ? 'Konfirmasi Persetujuan Evaluasi (YES)'
                          : 'Form Catatan Evaluasi & Perbaikan (NO)'}
                      </h5>
                      <span className="font-mono text-xs font-semibold text-slate-600">
                        Keputusan: {s5Mode}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {s5Mode === 'YES'
                          ? 'Catatan Persetujuan Evaluasi'
                          : 'Bagian yang Perlu Diperbaiki (Wajib diisi)'}
                      </label>
                      <textarea
                        required={s5Mode === 'NO'}
                        rows={3}
                        value={s5Notes}
                        onChange={(e) => setS5Notes(e.target.value)}
                        placeholder={
                          s5Mode === 'YES'
                            ? 'Tuliskan catatan verifikasi kesesuaian konten dan jadwal...'
                            : 'Jelaskan secara spesifik bagian pesan, media, atau jadwal yang harus direvisi...'
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {s5Mode === 'NO' && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Arahkan Kembali ke Tahap Perbaikan
                          </label>
                          <select
                            value={s5TargetStage}
                            onChange={(e) =>
                              setS5TargetStage(Number(e.target.value) as MuqolipStage)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-600 focus:outline-none"
                          >
                            <option value={2}>Tahap 2 — Tujuan Komunikasi Humas</option>
                            <option value={3}>Tahap 3 — Pesan dan Pemilihan Media</option>
                            <option value={4}>Tahap 4 — Jadwal dan Kalender Konten</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Evaluator / Peninjau
                        </label>
                        <select
                          value={s5Reviewer}
                          onChange={(e) => setS5Reviewer(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-violet-600 focus:outline-none"
                        >
                          {TEAM_MEMBERS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setS5Mode('none')}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className={`rounded-lg px-4 py-2 text-xs font-semibold text-white ${
                          s5Mode === 'YES'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        {s5Mode === 'YES'
                          ? 'Setujui & Jadwalkan Konten'
                          : `Simpan Iterasi & Kembali ke Tahap ${s5TargetStage}`}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {selectedStage === 6 && (
              <div className="mt-5 space-y-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveStage6Metrics(activeItem.id, {
                      stage6ActualDate: s6ActualDate,
                      likes: s6Likes,
                      comments: s6Comments,
                      shares: s6Shares,
                      reach: s6Reach,
                      views: s6Views,
                      stage6PublicNotes: s6PublicNotes,
                      audienceAgeGroup: s6AgeGroup,
                      markPublished: s6MarkPublished,
                    });
                  }}
                  className="space-y-4 rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      Pencatatan Publikasi & Respons Publik
                    </h4>
                    <span className="font-mono text-xs font-semibold tabular-nums text-violet-700">
                      Engagement Rate: {formatEngagementRate(liveStage6Er)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-slate-50 px-4 py-3 border border-slate-200">
                    <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={s6MarkPublished}
                        onChange={(e) => setS6MarkPublished(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-violet-700 focus:ring-violet-600"
                      />
                      <span>Tandai konten sebagai sudah dipublikasikan (Terpublikasi)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-600">Tanggal Aktual:</label>
                      <input
                        type="date"
                        value={s6ActualDate}
                        onChange={(e) => setS6ActualDate(e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono tabular-nums text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jumlah Likes
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={s6Likes}
                        onChange={(e) => setS6Likes(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jumlah Komentar
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={s6Comments}
                        onChange={(e) => setS6Comments(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Jumlah Shares
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={s6Shares}
                        onChange={(e) => setS6Shares(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Total Reach
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={s6Reach}
                        onChange={(e) => setS6Reach(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Total Views
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={s6Views}
                        onChange={(e) => setS6Views(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono tabular-nums text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Usia Dominan Audiens
                      </label>
                      <select
                        value={s6AgeGroup}
                        onChange={(e) =>
                          setS6AgeGroup(e.target.value as AudienceAgeGroup)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                      >
                        <option value="18-24">18–24 tahun</option>
                        <option value="25-34">25–34 tahun</option>
                        <option value="35-44">35–44 tahun</option>
                        <option value="45+">45+ tahun</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan Respons Publik
                    </label>
                    <textarea
                      rows={2}
                      value={s6PublicNotes}
                      onChange={(e) => setS6PublicNotes(e.target.value)}
                      placeholder="Rangkum sentimen komentar, pertanyaan audiens, atau kualitas interaksi..."
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                    >
                      <Save className="h-3.5 w-3.5" />
                      <span>Simpan Data Publikasi & Metrik</span>
                    </button>
                  </div>
                </form>

                <div className="flex flex-col items-center rounded-xl border border-violet-200 bg-violet-50/40 p-6 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center">
                    <div className="h-11 w-11 rotate-45 rounded-lg border-2 border-violet-700 bg-violet-700" />
                    <span className="absolute font-mono text-xs font-bold text-white">
                      ?
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 max-w-md">
                    Apakah respons publik sudah positif dan sesuai dengan tujuan komunikasi?
                  </h4>
                  <p className="mt-1 text-xs text-slate-600">
                    Keputusan saat ini:{' '}
                    <strong>
                      {activeItem.cycle.stage6Decision === 'pending'
                        ? 'Menunggu Penilaian'
                        : activeItem.cycle.stage6Decision}
                    </strong>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setS6Mode('YES')}
                      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>YES — Lanjut ke Tahap Selesai</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setS6Mode('NO')}
                      className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>NO — Kembali Evaluasi & Perbaikan Siklus</span>
                    </button>
                  </div>
                </div>

                {s6Mode !== 'none' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      submitStage6Decision(
                        activeItem.id,
                        s6Mode,
                        s6EvalNotes,
                        s6TargetStage,
                        s6Reviewer
                      );
                      setSelectedStage(s6Mode === 'YES' ? 7 : s6TargetStage);
                      setS6Mode('none');
                    }}
                    className={`rounded-xl border p-5 space-y-4 ${
                      s6Mode === 'YES'
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <h5 className="text-sm font-bold text-slate-900">
                      {s6Mode === 'YES'
                        ? 'Konfirmasi Penyelesaian Siklus (YES)'
                        : 'Alasan Evaluasi & Rekomendasi Perbaikan Siklus Berikutnya (NO)'}
                    </h5>
                    <textarea
                      required={s6Mode === 'NO'}
                      rows={3}
                      value={s6EvalNotes}
                      onChange={(e) => setS6EvalNotes(e.target.value)}
                      placeholder={
                        s6Mode === 'YES'
                          ? 'Catatan ringkas kesuksesan respons publik...'
                          : 'Tuliskan alasan mengapa respons belum optimal dan rekomendasi perbaikan untuk siklus berikutnya...'
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {s6Mode === 'NO' && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Kembali ke Tahap Siklus
                          </label>
                          <select
                            value={s6TargetStage}
                            onChange={(e) =>
                              setS6TargetStage(Number(e.target.value) as MuqolipStage)
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                          >
                            <option value={2}>Tahap 2 — Tujuan Komunikasi</option>
                            <option value={3}>Tahap 3 — Pesan & Media</option>
                            <option value={4}>Tahap 4 — Jadwal Publikasi</option>
                            <option value={5}>Tahap 5 — Evaluasi Kesesuaian</option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Evaluator
                        </label>
                        <select
                          value={s6Reviewer}
                          onChange={(e) => setS6Reviewer(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900"
                        >
                          {TEAM_MEMBERS.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setS6Mode('none')}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className={`rounded-lg px-4 py-2 text-xs font-semibold text-white ${
                          s6Mode === 'YES'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : 'bg-amber-600 hover:bg-amber-700'
                        }`}
                      >
                        {s6Mode === 'YES'
                          ? 'Selesaikan Siklus di Tahap 7'
                          : `Simpan & Kembali ke Tahap ${s6TargetStage}`}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {selectedStage === 7 && (
              <div className="mt-5 space-y-5">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                    <Sparkles className="h-4 w-4 text-emerald-700" />
                    <span>Ringkasan Hasil Siklus Literatif MUQOLIP</span>
                  </div>
                  <p className="mt-1 text-xs text-emerald-800">
                    Dokumentasi menyeluruh dari tujuan komunikasi hingga respons publik aktual.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Tujuan Komunikasi
                    </div>
                    <p className="mt-1 text-sm text-slate-800">
                      {activeItem.communicationGoal || '-'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Pesan Utama
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {activeItem.keyMessage || '-'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Media Publikasi
                    </div>
                    <p className="mt-1 text-sm text-slate-800">
                      {activeItem.platform} · {activeItem.format}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Jadwal & Tayang Aktual
                    </div>
                    <p className="mt-1 text-sm text-slate-800">
                      Rencana: {formatIndonesianDate(activeItem.publishDate)} ({formatCompactTime(activeItem.publishTime)})
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Aktual: {formatIndonesianDate(activeItem.cycle.stage6ActualDate || activeItem.publishDate)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Hasil Evaluasi & Iterasi
                  </div>
                  <p className="text-sm text-slate-800">
                    {activeItem.cycle.stage5Notes || 'Lolos evaluasi kesesuaian tujuan komunikasi dan jadwal publikasi.'}
                  </p>
                  <p className="font-mono text-xs text-slate-500">
                    Total revisi sepanjang siklus: {revisionCount}x
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-slate-500">
                      Respons Publik & Capaian Metrik
                    </div>
                    <span className="font-mono text-xs font-bold text-violet-700">
                      ER: {formatEngagementRate(
                        calculateEngagementRate(
                          activeItem.metrics.likes,
                          activeItem.metrics.comments,
                          activeItem.metrics.shares,
                          activeItem.metrics.reach
                        )
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="rounded bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500">Reach</div>
                      <div className="font-mono text-xs font-bold tabular-nums text-slate-900">
                        {formatNumber(activeItem.metrics.reach)}
                      </div>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500">Views</div>
                      <div className="font-mono text-xs font-bold tabular-nums text-slate-900">
                        {formatNumber(activeItem.metrics.views)}
                      </div>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500">Likes</div>
                      <div className="font-mono text-xs font-bold tabular-nums text-slate-900">
                        {formatNumber(activeItem.metrics.likes)}
                      </div>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500">Komentar</div>
                      <div className="font-mono text-xs font-bold tabular-nums text-slate-900">
                        {formatNumber(activeItem.metrics.comments)}
                      </div>
                    </div>
                    <div className="rounded bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500">Shares</div>
                      <div className="font-mono text-xs font-bold tabular-nums text-slate-900">
                        {formatNumber(activeItem.metrics.shares)}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    {activeItem.cycle.stage6PublicNotes || 'Belum ada catatan respons publik.'}
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveStage7Conclusion(activeItem.id, s7Conclusion);
                  }}
                  className="space-y-3"
                >
                  <label className="block text-xs font-semibold text-slate-700">
                    Kesimpulan Siklus
                  </label>
                  <textarea
                    rows={3}
                    value={s7Conclusion}
                    onChange={(e) => setS7Conclusion(e.target.value)}
                    placeholder="Tuliskan pembelajaran utama dan rekomendasi untuk kampanye kehumasan berikutnya..."
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('analytics')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Lihat di Performance Analytics
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Simpan Kesimpulan Siklus
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Iterasi & Revisi Siklus
                </h3>
              </div>
              <span className="font-mono text-xs tabular-nums text-slate-500">
                {activeItem.cycle.iterationHistory.length} catatan keputusan · {revisionCount} revisi
              </span>
            </div>

            {activeItem.cycle.iterationHistory.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                Belum ada riwayat keputusan YES/NO pada proyek ini. Lakukan evaluasi pada Tahap 5 atau Tahap 6.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-100">
                {activeItem.cycle.iterationHistory
                  .slice()
                  .reverse()
                  .map((entry) => (
                    <div key={entry.id} className="py-3 first:pt-1 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 font-mono text-[11px] font-bold ${
                              entry.decision === 'YES'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Tahap {entry.fromStage} · {entry.decision}
                          </span>
                          {entry.decision === 'NO' && entry.targetStage && (
                            <span className="text-xs font-medium text-amber-800">
                              Kembali ke Tahap {entry.targetStage}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-400">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                        {entry.notes}
                      </p>
                      <div className="mt-1 text-[11px] text-slate-500">
                        Peninjau: {entry.reviewer}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
