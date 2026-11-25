import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  GripVertical,
  List,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useContentra } from '../context/ContentraContext';
import type { ContentItem, ContentStatus, PlatformType } from '../types/contentra';
import {
  ALL_PLATFORMS,
  ALL_STATUSES,
  STATUS_STYLES,
  formatCompactTime,
  formatIndonesianDate,
} from '../utils/formatters';

interface ContentCalendarPageProps {
  onOpenAddModalWithDate: (dateIso: string) => void;
  onOpenDetailModal: (item: ContentItem) => void;
}

type CalendarTab = 'all' | 'scheduled' | 'published' | 'drafts' | 'in_progress';

const BULAN_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const HARI_SINGKAT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function ContentCalendarPage({
  onOpenAddModalWithDate,
  onOpenDetailModal,
}: ContentCalendarPageProps) {
  const { items, updateSchedule } = useContentra();

  // Focus on November 2026 by default
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(10); // 0-indexed: 10 = November
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [activeTab, setActiveTab] = useState<CalendarTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'Semua'>('Semua');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'Semua'>('Semua');

  const [selectedDateIso, setSelectedDateIso] = useState<string>('2026-11-26');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Schedule edit modal state
  const [editingScheduleItem, setEditingScheduleItem] = useState<ContentItem | null>(null);
  const [editDateVal, setEditDateVal] = useState('');
  const [editTimeVal, setEditTimeVal] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (activeTab === 'scheduled' && item.status !== 'Terjadwal') return false;
      if (activeTab === 'published' && item.status !== 'Terpublikasi') return false;
      if (activeTab === 'drafts' && item.status !== 'Draft') return false;
      if (
        activeTab === 'in_progress' &&
        item.status !== 'Dalam Proses' &&
        item.status !== 'Perlu Revisi'
      ) {
        return false;
      }

      if (q && !item.title.toLowerCase().includes(q)) return false;
      if (platformFilter !== 'Semua' && item.platform !== platformFilter) return false;
      if (statusFilter !== 'Semua' && item.status !== statusFilter) return false;
      return true;
    });
  }, [items, activeTab, searchQuery, platformFilter, statusFilter]);

  const itemsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const item of filteredItems) {
      if (!map[item.publishDate]) map[item.publishDate] = [];
      map[item.publishDate].push(item);
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.publishTime.localeCompare(b.publishTime));
    }
    return map;
  }, [filteredItems]);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: { day: number | null; iso: string | null }[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, iso: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(viewMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({ day: d, iso: `${viewYear}-${mStr}-${dStr}` });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: null, iso: null });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const sortedListItems = useMemo(() => {
    return [...filteredItems].sort((a, b) =>
      `${a.publishDate} ${a.publishTime}`.localeCompare(`${b.publishDate} ${b.publishTime}`)
    );
  }, [filteredItems]);

  const selectedDateContents = useMemo(() => {
    if (!selectedDateIso) return [];
    return itemsByDate[selectedDateIso] ?? [];
  }, [itemsByDate, selectedDateIso]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const openScheduleEdit = (item: ContentItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingScheduleItem(item);
    setEditDateVal(item.publishDate);
    setEditTimeVal(item.publishTime);
  };

  const handleSaveScheduleModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheduleItem) return;
    updateSchedule(editingScheduleItem.id, editDateVal, editTimeVal);
    setSelectedDateIso(editDateVal);
    setEditingScheduleItem(null);
  };

  const handleDropOnDate = (targetIso: string) => {
    if (draggedItemId) {
      updateSchedule(draggedItemId, targetIso);
      setSelectedDateIso(targetIso);
    }
    setDraggedItemId(null);
    setDragOverDate(null);
  };

  const TABS: { id: CalendarTab; label: string }[] = [
    { id: 'all', label: 'All Content' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'published', label: 'Published' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'in_progress', label: 'In Progress' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Kalender Konten & Penjadwalan
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Seret dan lepas kartu konten ke tanggal lain untuk menjadwalkan ulang secara langsung, atau klik tanggal untuk meninjau daftar tayang.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Calendar View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List View</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModalWithDate(selectedDateIso || '2026-11-26')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-800 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>Jadwalkan Konten</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative min-w-[220px] flex-1 max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul konten..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 focus:border-violet-600 focus:bg-white focus:outline-none"
                />
              </div>

              <select
                value={platformFilter}
                onChange={(e) =>
                  setPlatformFilter(e.target.value as PlatformType | 'Semua')
                }
                aria-label="Filter platform kalender"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
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
                aria-label="Filter status kalender"
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700"
              >
                <option value="Semua">Semua Status</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {viewMode === 'calendar' && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Bulan sebelumnya"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[130px] text-center text-sm font-bold text-slate-900">
                  {BULAN_NAMES[viewMonth]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Bulan berikutnya"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                {(viewYear !== 2026 || viewMonth !== 10) && (
                  <button
                    type="button"
                    onClick={() => {
                      setViewYear(2026);
                      setViewMonth(10);
                    }}
                    className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 hover:bg-violet-100"
                  >
                    Nov 2026
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {viewMode === 'calendar' ? (
          <div className="grid grid-cols-1 xl:grid-cols-12">
            <div className="xl:col-span-9 p-4">
              <div className="grid grid-cols-7 border-b border-slate-200 pb-2 text-center text-xs font-semibold text-slate-500">
                {HARI_SINGKAT.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {calendarCells.map((cell, idx) => {
                  if (!cell.day || !cell.iso) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[104px] rounded-lg bg-slate-50/50"
                      />
                    );
                  }

                  const iso = cell.iso;
                  const dayItems = itemsByDate[iso] ?? [];
                  const isSelected = selectedDateIso === iso;
                  const isToday = iso === '2026-11-24';
                  const isDragOver = dragOverDate === iso;

                  return (
                    <div
                      key={iso}
                      onClick={() => setSelectedDateIso(iso)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverDate(iso);
                      }}
                      onDragLeave={() => setDragOverDate(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDropOnDate(iso);
                      }}
                      className={`min-h-[104px] cursor-pointer rounded-lg border p-1.5 transition-colors flex flex-col ${
                        isDragOver
                          ? 'border-violet-600 bg-violet-50 ring-2 ring-violet-500/20'
                          : isSelected
                            ? 'border-blue-600 bg-blue-50/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between px-1 mb-1">
                        <span
                          className={`font-mono text-xs tabular-nums ${
                            isToday
                              ? 'flex h-5 w-5 items-center justify-center rounded-full bg-violet-700 font-bold text-white'
                              : isSelected
                                ? 'font-bold text-blue-700'
                                : 'font-medium text-slate-700'
                          }`}
                        >
                          {cell.day}
                        </span>
                        {dayItems.length > 0 && (
                          <span className="font-mono text-[10px] text-slate-400">
                            {dayItems.length}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 flex-1 overflow-y-auto max-h-[82px]">
                        {dayItems.map((item) => {
                          const st = STATUS_STYLES[item.status];
                          return (
                            <div
                              key={item.id}
                              draggable
                              onDragStart={(e) => {
                                setDraggedItemId(item.id);
                                e.dataTransfer.effectAllowed = 'move';
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenDetailModal(item);
                              }}
                              title={`${item.title} (${item.status}) — Seret untuk pindah tanggal`}
                              className={`group flex items-center gap-1 rounded border px-1.5 py-1 text-[11px] font-medium transition-colors ${st.calendarBg} ${st.calendarText}`}
                            >
                              <GripVertical className="h-3 w-3 shrink-0 opacity-40 group-hover:opacity-90" />
                              <span className="truncate flex-1">{item.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Legenda Status:</span>
                {ALL_STATUSES.map((st) => (
                  <StatusBadge key={st} status={st} />
                ))}
              </div>
            </div>

            <div className="xl:col-span-3 border-t xl:border-t-0 xl:border-l border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Agenda Tanggal Dipilih
                  </div>
                  <h3 className="mt-0.5 text-sm font-bold text-slate-900">
                    {formatIndonesianDate(selectedDateIso, true)}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAddModalWithDate(selectedDateIso)}
                  title="Tambah konten di tanggal ini"
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-violet-700 hover:bg-violet-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {selectedDateContents.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
                    <p className="text-xs font-medium text-slate-700">
                      Belum ada jadwal konten pada tanggal ini.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenAddModalWithDate(selectedDateIso)}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Tambah Konten
                    </button>
                  </div>
                ) : (
                  selectedDateContents.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenDetailModal(item)}
                          className="text-left text-sm font-semibold text-slate-900 hover:text-violet-700"
                        >
                          {item.title}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{item.platform}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {formatCompactTime(item.publishTime)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <StatusBadge status={item.status} />
                        <button
                          type="button"
                          onClick={(e) => openScheduleEdit(item, e)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
                        >
                          <Edit3 className="h-3 w-3" />
                          Ubah Jadwal
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {sortedListItems.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-slate-500">
                Tidak ada konten yang sesuai dengan filter atau tab yang dipilih.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                    <th className="py-3 pl-5 pr-3">Tanggal & Jam</th>
                    <th className="px-3 py-3">Judul Konten</th>
                    <th className="px-3 py-3">Platform</th>
                    <th className="px-3 py-3">Penanggung Jawab</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="py-3 pl-3 pr-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {sortedListItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80">
                      <td className="py-3.5 pl-5 pr-3 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-900">
                          {formatIndonesianDate(item.publishDate)}
                        </div>
                        <div className="font-mono text-xs tabular-nums text-slate-500">
                          {formatCompactTime(item.publishTime)}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <button
                          type="button"
                          onClick={() => onOpenDetailModal(item)}
                          className="text-left font-semibold text-slate-900 hover:text-violet-700"
                        >
                          {item.title}
                        </button>
                        <div className="text-xs text-slate-500">{item.format}</div>
                      </td>
                      <td className="px-3 py-3.5 text-xs text-slate-700 whitespace-nowrap">
                        {item.platform}
                      </td>
                      <td className="px-3 py-3.5 text-xs text-slate-700 whitespace-nowrap">
                        {item.pic}
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => openScheduleEdit(item, e)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          Edit Jadwal
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {editingScheduleItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Jadwal Publikasi
                </h3>
                <p className="text-xs text-slate-500">{editingScheduleItem.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingScheduleItem(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveScheduleModal} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tanggal Publikasi Baru
                </label>
                <input
                  type="date"
                  required
                  value={editDateVal}
                  onChange={(e) => setEditDateVal(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jam Publikasi Baru
                </label>
                <input
                  type="time"
                  required
                  value={editTimeVal}
                  onChange={(e) => setEditTimeVal(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingScheduleItem(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
