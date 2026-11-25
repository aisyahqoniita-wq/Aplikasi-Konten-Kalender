import {
  Calendar,
  Clock,
  Edit3,
  GitBranch,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type { ContentItem, ContentStatus } from '../../types/contentra';
import {
  ALL_STATUSES,
  formatCompactTime,
  formatEngagementRate,
  formatIndonesianDate,
  formatNumber,
  getItemEngagementRate,
} from '../../utils/formatters';
import { StatusBadge } from '../ui/StatusBadge';

interface ContentDetailModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (item: ContentItem) => void;
  onStatusChange: (id: string, status: ContentStatus) => void;
  onOpenInCycle: (id: string) => void;
}

export function ContentDetailModal({
  item,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenInCycle,
}: ContentDetailModalProps) {
  if (!item) return null;

  const engagementRate = getItemEngagementRate(item);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{item.platform}</span>
              <span aria-hidden="true">·</span>
              <span>{item.format}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Tahap {item.cycle.currentStage}/7 MUQOLIP</span>
            </div>
            <h2
              id="detail-modal-title"
              className="mt-1.5 text-lg font-semibold text-slate-900"
            >
              {item.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={item.status} size="md" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail konten"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-100 pb-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{formatIndonesianDate(item.publishDate, true)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="font-mono tabular-nums">{formatCompactTime(item.publishTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <span>{item.pic}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-500">Deskripsi Konten</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-800">
                {item.description || '-'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-500">Tujuan Komunikasi</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-800">
                  {item.communicationGoal || '-'}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500">Target Audiens</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-800">
                  {item.targetAudience || '-'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-500">Pesan Utama</h3>
              <p className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-900">
                {item.keyMessage || '-'}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700">
                Progres Siklus Literatif MUQOLIP
              </h3>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {item.cycle.iterationHistory.filter((i) => i.decision === 'NO').length} kali revisi
              </span>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((stage) => {
                const isDone = item.cycle.completedStages.includes(stage as 1 | 2 | 3 | 4 | 5 | 6 | 7);
                const isCurrent = item.cycle.currentStage === stage;
                return (
                  <div
                    key={stage}
                    className={`rounded-md border px-2 py-1.5 text-center text-xs font-medium tabular-nums ${
                      isCurrent
                        ? 'border-violet-600 bg-violet-50 text-violet-800'
                        : isDone
                          ? 'border-blue-200 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                    }`}
                  >
                    T{stage}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <h3 className="text-xs font-semibold text-slate-700 mb-3">
              Metrik Performa Publik
            </h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500">Eng. Rate</div>
                <div className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-violet-700">
                  {formatEngagementRate(engagementRate)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500">Reach</div>
                <div className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900">
                  {formatNumber(item.metrics.reach)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500">Views</div>
                <div className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900">
                  {formatNumber(item.metrics.views)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500">Likes</div>
                <div className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900">
                  {formatNumber(item.metrics.likes)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500">Komentar</div>
                <div className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900">
                  {formatNumber(item.metrics.comments)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-[11px] text-slate-500">Shares</div>
                <div className="mt-0.5 text-sm font-semibold font-mono tabular-nums text-slate-900">
                  {formatNumber(item.metrics.shares)}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ubah Status Cepat
            </label>
            <select
              value={item.status}
              onChange={(e) => onStatusChange(item.id, e.target.value as ContentStatus)}
              className="w-full sm:w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Hapus
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(item);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit Konten
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInCycle(item.id);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-800 transition-colors"
            >
              <GitBranch className="h-3.5 w-3.5" />
              Buka di Siklus MUQOLIP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
