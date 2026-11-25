import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileEdit,
} from 'lucide-react';
import type { ContentStatus } from '../../types/contentra';
import { STATUS_STYLES } from '../../utils/formatters';

interface StatusBadgeProps {
  status: ContentStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];

  const Icon =
    status === 'Terpublikasi'
      ? CheckCircle2
      : status === 'Terjadwal'
        ? CalendarClock
        : status === 'Dalam Proses'
          ? Clock
          : status === 'Perlu Revisi'
            ? AlertTriangle
            : FileEdit;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shrink-0 ${style.bg} ${style.text} ${style.border} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{style.label}</span>
    </span>
  );
}
