import { useMemo, useState } from 'react';
import {
  Edit3,
  Eye,
  GitBranch,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useContentra } from '../context/ContentraContext';
import type {
  ContentItem,
  ContentStatus,
  NavPage,
  PlatformType,
} from '../types/contentra';
import {
  ALL_PLATFORMS,
  ALL_STATUSES,
  formatCompactTime,
  formatEngagementRate,
  formatIndonesianDate,
  getItemEngagementRate,
} from '../utils/formatters';

interface ContentLibraryPageProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (item: ContentItem) => void;
  onOpenDetailModal: (item: ContentItem) => void;
  onRequestDelete: (item: ContentItem) => void;
  onNavigate: (page: NavPage) => void;
}

export function ContentLibraryPage({
  onOpenAddModal,
  onOpenEditModal,
  onOpenDetailModal,
  onRequestDelete,
  onNavigate,
}: ContentLibraryPageProps) {
  const { items, setActiveCycleContentId } = useContentra();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'Semua'>('Semua');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'Semua'>('Semua');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'title'>('newest');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.keyMessage.toLowerCase().includes(q) ||
        item.pic.toLowerCase().includes(q);
      const matchPlatform =
        platformFilter === 'Semua' || item.platform === platformFilter;
      const matchStatus = statusFilter === 'Semua' || item.status === statusFilter;
      return matchQuery && matchPlatform && matchStatus;
    });

    return filtered.sort((a, b) => {
      if (sortOrder === 'title') return a.title.localeCompare(b.title);
      if (sortOrder === 'oldest') return a.publishDate.localeCompare(b.publishDate);
      return b.publishDate.localeCompare(a.publishDate);
    });
  }, [items, searchQuery, platformFilter, statusFilter, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Perpustakaan Konten Kehumasan
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Arsip lengkap seluruh konten yang pernah dibuat beserta status siklus MUQOLIP, jadwal, dan capaian performanya.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Konten Baru</span>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul konten, pesan utama, atau penanggung jawab..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={platformFilter}
              onChange={(e) =>
                setPlatformFilter(e.target.value as PlatformType | 'Semua')
              }
              aria-label="Filter platform"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-violet-600 focus:outline-none"
            >
              <option value="Semua">Semua Platform</option>
              {ALL_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as ContentStatus | 'Semua')
              }
              aria-label="Filter status"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-violet-600 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as 'newest' | 'oldest' | 'title')
              }
              aria-label="Urutkan konten"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-violet-600 focus:outline-none"
            >
              <option value="newest">Tanggal Terbaru</option>
              <option value="oldest">Tanggal Terlama</option>
              <option value="title">Judul A–Z</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-700">
              Belum ada konten yang sesuai pencarian.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Coba kata kunci lain atau buat konten baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 pl-5 pr-3">Judul Konten</th>
                  <th className="px-3 py-3 whitespace-nowrap">Platform & Format</th>
                  <th className="px-3 py-3 whitespace-nowrap">Jadwal Tayang</th>
                  <th className="px-3 py-3 whitespace-nowrap">Tahap MUQOLIP</th>
                  <th className="px-3 py-3 whitespace-nowrap">Status</th>
                  <th className="px-3 py-3 text-right whitespace-nowrap">Eng. Rate</th>
                  <th className="py-3 pl-3 pr-5 text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredItems.map((item) => {
                  const revisiCount = item.cycle.iterationHistory.filter(
                    (it) => it.decision === 'NO'
                  ).length;
                  const er = getItemEngagementRate(item);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pl-5 pr-3 min-w-[230px]">
                        <button
                          type="button"
                          onClick={() => onOpenDetailModal(item)}
                          className="text-left font-semibold text-slate-900 hover:text-violet-700"
                        >
                          {item.title}
                        </button>
                        <div className="mt-0.5 text-xs text-slate-500">
                          PIC: {item.pic}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-800">
                          {item.platform}
                        </div>
                        <div className="text-xs text-slate-500">{item.format}</div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-800">
                          {formatIndonesianDate(item.publishDate)}
                        </div>
                        <div className="font-mono text-xs tabular-nums text-slate-500">
                          {formatCompactTime(item.publishTime)}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="font-mono text-xs font-medium tabular-nums text-slate-800">
                          Tahap {item.cycle.currentStage} / 7
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {revisiCount > 0 ? `${revisiCount}x revisi` : 'Belum ada revisi'}
                        </div>
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-3 py-3.5 text-right font-mono text-xs font-semibold tabular-nums text-slate-800 whitespace-nowrap">
                        {formatEngagementRate(er)}
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCycleContentId(item.id);
                              onNavigate('siklus');
                            }}
                            title="Buka di Siklus MUQOLIP"
                            aria-label={`Buka siklus ${item.title}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-violet-700 hover:bg-violet-50"
                          >
                            <GitBranch className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDetailModal(item)}
                            title="Lihat Detail"
                            aria-label={`Lihat detail ${item.title}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEditModal(item)}
                            title="Edit Konten"
                            aria-label={`Edit ${item.title}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRequestDelete(item)}
                            title="Hapus Konten"
                            aria-label={`Hapus ${item.title}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
