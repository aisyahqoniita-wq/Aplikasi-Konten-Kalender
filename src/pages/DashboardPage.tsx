import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  GitBranch,
  Layers,
  Plus,
  Target,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useContentra } from '../context/ContentraContext';
import { COMMUNICATION_GOAL_MAIN } from '../data/initialData';
import type { ContentItem, ContentStatus, NavPage } from '../types/contentra';
import {
  ALL_STATUSES,
  formatCompactTime,
  formatIndonesianDate,
  formatNumber,
} from '../utils/formatters';

interface DashboardPageProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (item: ContentItem) => void;
  onOpenDetailModal: (item: ContentItem) => void;
  onNavigate: (page: NavPage) => void;
}

export function DashboardPage({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onNavigate,
}: DashboardPageProps) {
  const { items, updateStatus, setActiveCycleContentId } = useContentra();
  const [listScope, setListScope] = useState<'upcoming' | 'all'>('upcoming');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'Semua'>('Semua');

  const todayIso = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const todayFormatted = useMemo(() => {
    return formatIndonesianDate(todayIso, true);
  }, [todayIso]);

  const stats = useMemo(() => {
    const total = items.length;
    const scheduled = items.filter((i) => i.status === 'Terjadwal').length;
    const published = items.filter((i) => i.status === 'Terpublikasi').length;
    const inProgress = items.filter(
      (i) => i.status === 'Dalam Proses' || i.status === 'Perlu Revisi'
    ).length;
    return { total, scheduled, published, inProgress };
  }, [items]);

  const displayedContents = useMemo(() => {
    const sorted = [...items].sort((a, b) =>
      `${a.publishDate} ${a.publishTime}`.localeCompare(`${b.publishDate} ${b.publishTime}`)
    );

    const byScope =
      listScope === 'upcoming'
        ? sorted.filter((i) => i.publishDate >= todayIso || i.status !== 'Terpublikasi')
        : sorted;

    if (statusFilter === 'Semua') return byScope;
    return byScope.filter((i) => i.status === statusFilter);
  }, [items, listScope, statusFilter, todayIso]);

  const activeCyclePreview = useMemo(() => {
    return items
      .filter((i) => i.cycle.currentStage < 7)
      .slice(0, 3);
  }, [items]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-violet-700" />
            <span>{todayFormatted}</span>
          </div>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 text-balance">
            Selamat datang kembali, Tim CONTENTRA!
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Kelola kolaborasi tim kehumasan, pantau jadwal publikasi lintas kanal, dan pastikan setiap konten melewati alur evaluatif MUQOLIP secara produktif.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('siklus')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <GitBranch className="h-4 w-4 text-violet-700" />
            <span>Siklus MUQOLIP</span>
          </button>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>+ Tambah Konten Baru</span>
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-200">
              <Target className="h-4 w-4 text-violet-300" />
              <span>Communication Goals</span>
            </div>
            <p className="mt-2 text-base font-medium leading-relaxed text-slate-100">
              {COMMUNICATION_GOAL_MAIN}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0 lg:self-center"
          >
            <span>Lihat Capaian Analytics</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            setListScope('all');
            setStatusFilter('Semua');
          }}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Konten</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(stats.total)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Seluruh rencana & arsip publikasi
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setListScope('all');
            setStatusFilter('Terjadwal');
          }}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Terjadwal</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono tabular-nums text-blue-700">
            {formatNumber(stats.scheduled)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Siap tayang sesuai kalender konten
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setListScope('all');
            setStatusFilter('Terpublikasi');
          }}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Terpublikasi</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono tabular-nums text-emerald-700">
            {formatNumber(stats.published)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Sudah tayang & dipantau responsnya
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setListScope('all');
            setStatusFilter('Dalam Proses');
          }}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left transition-colors hover:border-violet-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dalam Proses</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-bold font-mono tabular-nums text-violet-700">
            {formatNumber(stats.inProgress)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Tahap penyusunan & revisi siklus
          </p>
        </button>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Daftar Konten Hari Ini & Mendatang
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Kelola jadwal, status publikasi, dan detail konten langsung dari dashboard.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setListScope('upcoming')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    listScope === 'upcoming'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mendatang
                </button>
                <button
                  type="button"
                  onClick={() => setListScope('all')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    listScope === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as ContentStatus | 'Semua')
                }
                aria-label="Filter status konten"
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-violet-600 focus:outline-none"
              >
                <option value="Semua">Semua Status</option>
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {displayedContents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-700">
                Tidak ada konten yang cocok dengan filter saat ini.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Ubah filter atau tambahkan rencana konten kehumasan baru.
              </p>
              <button
                type="button"
                onClick={onOpenAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
              >
                <Plus className="h-4 w-4" />
                Tambah Konten Baru
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                    <th className="py-3 pl-5 pr-3">Konten & Platform</th>
                    <th className="px-3 py-3 whitespace-nowrap">Tanggal & Jam</th>
                    <th className="px-3 py-3 whitespace-nowrap">Penanggung Jawab</th>
                    <th className="px-3 py-3 whitespace-nowrap">Status</th>
                    <th className="py-3 pl-3 pr-5 text-right whitespace-nowrap">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {displayedContents.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/80"
                    >
                      <td className="py-3.5 pl-5 pr-3 min-w-[210px]">
                        <button
                          type="button"
                          onClick={() => onOpenDetailModal(item)}
                          className="text-left font-semibold text-slate-900 hover:text-violet-700 transition-colors"
                        >
                          {item.title}
                        </button>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                          <span>{item.platform}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.format}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-800">
                          {formatIndonesianDate(item.publishDate)}
                        </div>
                        <div className="mt-0.5 font-mono text-xs tabular-nums text-slate-500">
                          {formatCompactTime(item.publishTime)}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-slate-700 whitespace-nowrap">
                        {item.pic}
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          <StatusBadge status={item.status} />
                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateStatus(item.id, e.target.value as ContentStatus)
                            }
                            aria-label={`Ubah status ${item.title}`}
                            className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-600 hover:border-slate-300 focus:border-violet-600 focus:outline-none"
                          >
                            {ALL_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                Ubah: {st}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onOpenDetailModal(item)}
                            title="Lihat Detail"
                            aria-label={`Lihat detail ${item.title}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(item)}
                            title="Edit Konten"
                            aria-label={`Edit ${item.title}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">
                Progres Siklus MUQOLIP
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('siklus')}
                className="text-xs font-semibold text-violet-700 hover:text-violet-900"
              >
                Buka Flowchart
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Proyek konten yang sedang berjalan dalam Siklus Literatif Tunggal 7 Tahap.
            </p>

            <div className="mt-4 divide-y divide-slate-100">
              {activeCyclePreview.length === 0 ? (
                <p className="py-6 text-xs text-slate-500">
                  Seluruh proyek konten telah mencapai Tahap 7 (Selesai).
                </p>
              ) : (
                activeCyclePreview.map((item) => {
                  const pct = Math.round((item.cycle.currentStage / 7) * 100);
                  return (
                    <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-slate-900">
                            {item.title}
                          </div>
                          <div className="mt-0.5 text-xs text-slate-500">
                            {item.platform} · Tahap {item.cycle.currentStage} dari 7
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold tabular-nums text-violet-700">
                          {pct}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-violet-700 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          PIC: {item.pic}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCycleContentId(item.id);
                            onNavigate('siklus');
                          }}
                          className="text-xs font-medium text-blue-700 hover:text-blue-900"
                        >
                          Lanjutkan Tahap →
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('kalender')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Calendar className="h-4 w-4 text-blue-700" />
              <span>Lihat Kalender November 2026</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
