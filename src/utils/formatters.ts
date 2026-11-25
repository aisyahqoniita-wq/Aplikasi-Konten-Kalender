import type { ContentItem, ContentStatus, PlatformType } from '../types/contentra';

const BULAN_ID = [
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

const HARI_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export function formatIndonesianDate(dateStr: string, includeDay = false): string {
  if (!dateStr) return 'Belum dijadwalkan';
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);
  const base = `${day} ${BULAN_ID[month - 1] ?? ''} ${year}`;
  if (!includeDay) return base;
  return `${HARI_ID[dateObj.getDay()]}, ${base}`;
}

export function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return '-';
  const [hourStr, minStr] = timeStr.split(':');
  const hour = Number(hourStr);
  if (isNaN(hour)) return timeStr;
  const suffix = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const hPad = String(h12).padStart(2, '0');
  return `${timeStr} WIB (${hPad}:${minStr ?? '00'} ${suffix})`;
}

export function formatCompactTime(timeStr: string): string {
  if (!timeStr) return '-';
  return `${timeStr} WIB`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(Math.round(num));
}

export function calculateEngagementRate(
  likes: number,
  comments: number,
  shares: number,
  reach: number
): number {
  if (!reach || reach <= 0) return 0;
  return ((likes + comments + shares) / reach) * 100;
}

export function formatEngagementRate(rate: number): string {
  if (!isFinite(rate) || isNaN(rate)) return '0%';
  if (rate === 0) return '0%';
  return `${rate.toFixed(2)}%`;
}

export function getItemEngagementRate(item: ContentItem): number {
  const { likes, comments, shares, reach } = item.metrics;
  return calculateEngagementRate(likes, comments, shares, reach);
}

export const STATUS_STYLES: Record<
  ContentStatus,
  {
    bg: string;
    text: string;
    border: string;
    calendarBg: string;
    calendarText: string;
    label: string;
  }
> = {
  Terjadwal: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    calendarBg: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    calendarText: 'text-blue-800',
    label: 'Terjadwal',
  },
  Terpublikasi: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    calendarBg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200',
    calendarText: 'text-emerald-800',
    label: 'Terpublikasi',
  },
  'Dalam Proses': {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    calendarBg: 'bg-violet-50 hover:bg-violet-100 border-violet-200',
    calendarText: 'text-violet-800',
    label: 'Dalam Proses',
  },
  Draft: {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    calendarBg: 'bg-slate-100 hover:bg-slate-200 border-slate-200',
    calendarText: 'text-slate-700',
    label: 'Draft',
  },
  'Perlu Revisi': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    calendarBg: 'bg-amber-50 hover:bg-amber-100 border-amber-200',
    calendarText: 'text-amber-800',
    label: 'Perlu Revisi',
  },
};

export const PLATFORM_SHORT: Record<PlatformType, string> = {
  Instagram: 'IG Feed',
  'Instagram Story': 'IG Story',
  TikTok: 'TikTok',
  'X/Twitter': 'X / Twitter',
  Facebook: 'Facebook',
};

export const ALL_PLATFORMS: PlatformType[] = [
  'Instagram',
  'Instagram Story',
  'TikTok',
  'X/Twitter',
  'Facebook',
];

export const ALL_STATUSES: ContentStatus[] = [
  'Terjadwal',
  'Dalam Proses',
  'Draft',
  'Perlu Revisi',
  'Terpublikasi',
];
