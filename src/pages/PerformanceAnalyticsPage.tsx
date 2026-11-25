import { useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useContentra } from '../context/ContentraContext';
import type { ContentFormat, ContentItem, PlatformType } from '../types/contentra';
import {
  calculateEngagementRate,
  formatCompactTime,
  formatEngagementRate,
  formatIndonesianDate,
  formatNumber,
  getItemEngagementRate,
} from '../utils/formatters';

type MainPlatformGroup = 'Instagram' | 'TikTok' | 'X/Twitter' | 'Facebook';

const MAIN_PLATFORMS: MainPlatformGroup[] = [
  'Instagram',
  'TikTok',
  'X/Twitter',
  'Facebook',
];

const FORMAT_OPTIONS: ContentFormat[] = [
  'Carousel',
  'Reels / Video Pendek',
  'Single Post',
  'Story',
  'Infografis',
  'Thread',
];

function mapPlatformGroup(p: PlatformType): MainPlatformGroup {
  if (p === 'Instagram' || p === 'Instagram Story') return 'Instagram';
  return p;
}

export function PerformanceAnalyticsPage() {
  const { items } = useContentra();

  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [platformFilter, setPlatformFilter] = useState<MainPlatformGroup | 'Semua'>('Semua');
  const [formatFilter, setFormatFilter] = useState<ContentFormat | 'Semua'>('Semua');
  const [chartMetricMode, setChartMetricMode] = useState<'reach_views' | 'interactions' | 'er'>('reach_views');

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (startDate && item.publishDate < startDate) return false;
      if (endDate && item.publishDate > endDate) return false;
      if (platformFilter !== 'Semua' && mapPlatformGroup(item.platform) !== platformFilter) {
        return false;
      }
      if (formatFilter !== 'Semua' && item.format !== formatFilter) return false;
      return true;
    });
  }, [items, startDate, endDate, platformFilter, formatFilter]);

  const kpi = useMemo(() => {
    let totalLikes = 0;
    let totalComments = 0;
    let totalShares = 0;
    let totalReach = 0;
    let totalViews = 0;

    for (const item of filteredItems) {
      totalLikes += item.metrics.likes;
      totalComments += item.metrics.comments;
      totalShares += item.metrics.shares;
      totalReach += item.metrics.reach;
      totalViews += item.metrics.views;
    }

    const engagementRate = calculateEngagementRate(
      totalLikes,
      totalComments,
      totalShares,
      totalReach
    );

    return {
      engagementRate,
      totalReach,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
    };
  }, [filteredItems]);

  const platformPerformance = useMemo(() => {
    return MAIN_PLATFORMS.map((platform) => {
      const groupItems = filteredItems.filter(
        (i) => mapPlatformGroup(i.platform) === platform
      );
      let likes = 0;
      let comments = 0;
      let shares = 0;
      let reach = 0;
      let views = 0;

      for (const item of groupItems) {
        likes += item.metrics.likes;
        comments += item.metrics.comments;
        shares += item.metrics.shares;
        reach += item.metrics.reach;
        views += item.metrics.views;
      }

      const er = calculateEngagementRate(likes, comments, shares, reach);
      return {
        platform,
        count: groupItems.length,
        likes,
        comments,
        shares,
        reach,
        views,
        engagementRate: Number(er.toFixed(2)),
      };
    });
  }, [filteredItems]);

  const audienceAgeData = useMemo(() => {
    const groups: Record<'18-24' | '25-34' | '35-44' | '45+', number> = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45+': 0,
    };

    const itemsWithReach = filteredItems.filter((i) => i.metrics.reach > 0);
    const source = itemsWithReach.length > 0 ? itemsWithReach : filteredItems;

    for (const item of source) {
      const weight = item.metrics.reach > 0 ? item.metrics.reach : 1;
      groups[item.metrics.audienceAgeGroup] += weight;
    }

    const total = Object.values(groups).reduce((a, b) => a + b, 0);
    return (Object.keys(groups) as Array<'18-24' | '25-34' | '35-44' | '45+'>).map(
      (age) => ({
        ageGroup: `${age} thn`,
        persentase: total > 0 ? Math.round((groups[age] / total) * 100) : 0,
        reach: groups[age],
      })
    );
  }, [filteredItems]);

  const genderBreakdown = useMemo(() => {
    const source = filteredItems.filter((i) => i.metrics.reach > 0);
    const list = source.length > 0 ? source : filteredItems;
    if (list.length === 0) return { female: 0, male: 0 };

    let totalWeight = 0;
    let femaleWeighted = 0;
    let maleWeighted = 0;

    for (const item of list) {
      const w = item.metrics.reach > 0 ? item.metrics.reach : 1;
      totalWeight += w;
      femaleWeighted += item.metrics.audienceGenderSplit.female * w;
      maleWeighted += item.metrics.audienceGenderSplit.male * w;
    }

    if (totalWeight === 0) return { female: 0, male: 0 };
    const female = Math.round(femaleWeighted / totalWeight);
    return { female, male: 100 - female };
  }, [filteredItems]);

  const dynamicInsights = useMemo(() => {
    const withReach = filteredItems.filter((i) => i.metrics.reach > 0);

    // Top platform by ER
    const activePlatforms = platformPerformance.filter((p) => p.reach > 0);
    const topPlatform =
      activePlatforms.length > 0
        ? [...activePlatforms].sort((a, b) => b.engagementRate - a.engagementRate)[0]
        : null;

    // Best & lowest performing content
    const sortedByEr = [...withReach].sort(
      (a, b) => getItemEngagementRate(b) - getItemEngagementRate(a)
    );
    const bestContent: ContentItem | null = sortedByEr[0] ?? null;

    const sortedByReach = [...withReach].sort(
      (a, b) => a.metrics.reach - b.metrics.reach
    );
    const lowestReachContent: ContentItem | null = sortedByReach[0] ?? null;

    // Best publishing time slot
    const timeBuckets: Record<string, { interactions: number; reach: number; count: number }> = {};
    for (const item of withReach) {
      const slot = item.publishTime || '09:00';
      if (!timeBuckets[slot]) {
        timeBuckets[slot] = { interactions: 0, reach: 0, count: 0 };
      }
      timeBuckets[slot].interactions +=
        item.metrics.likes + item.metrics.comments + item.metrics.shares;
      timeBuckets[slot].reach += item.metrics.reach;
      timeBuckets[slot].count += 1;
    }

    const bestTimeEntry = Object.entries(timeBuckets)
      .map(([time, val]) => ({
        time,
        er: calculateEngagementRate(val.interactions, 0, 0, val.reach),
        reach: val.reach,
      }))
      .sort((a, b) => b.er - a.er)[0] ?? null;

    return {
      topPlatform,
      bestContent,
      lowestReachContent,
      bestTimeEntry,
    };
  }, [filteredItems, platformPerformance]);

  const PLATFORM_COLORS: Record<MainPlatformGroup, string> = {
    Instagram: '#6D28D9',
    TikTok: '#0F172A',
    'X/Twitter': '#1D4ED8',
    Facebook: '#2563EB',
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Performance Analytics
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Seluruh metrik dan grafik dihitung langsung dari data konten yang tersimpan di CONTENTRA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Dari:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent font-mono text-xs tabular-nums text-slate-800 focus:outline-none"
              />
              <span className="text-slate-300">—</span>
              <span className="text-[11px] font-semibold text-slate-500">Sampai:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent font-mono text-xs tabular-nums text-slate-800 focus:outline-none"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) =>
                setPlatformFilter(e.target.value as MainPlatformGroup | 'Semua')
              }
              aria-label="Filter platform analytics"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="Semua">Semua Platform</option>
              {MAIN_PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={formatFilter}
              onChange={(e) =>
                setFormatFilter(e.target.value as ContentFormat | 'Semua')
              }
              aria-label="Filter jenis konten analytics"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
            >
              <option value="Semua">Semua Jenis Konten</option>
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-violet-800">
            <span>Engagement Rate</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-2.5 text-2xl font-bold font-mono tabular-nums text-violet-900">
            {formatEngagementRate(kpi.engagementRate)}
          </div>
          <p className="mt-1 text-[11px] text-violet-700">
            (L+C+S) / Reach × 100%
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Reach</span>
            <Users className="h-4 w-4 text-blue-700" />
          </div>
          <div className="mt-2.5 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(kpi.totalReach)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Akun unik terjangkau
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Views</span>
            <Eye className="h-4 w-4 text-slate-600" />
          </div>
          <div className="mt-2.5 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(kpi.totalViews)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Total tayangan konten
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Likes</span>
            <Heart className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-2.5 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(kpi.totalLikes)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Apresiasi audiens
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Comments</span>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2.5 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(kpi.totalComments)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Interaksi diskusi
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Shares</span>
            <Share2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2.5 text-2xl font-bold font-mono tabular-nums text-slate-900">
            {formatNumber(kpi.totalShares)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Distribusi ulang konten
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-7 rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <BarChart3 className="h-4 w-4 text-violet-700" />
                <span>Perbandingan Antarplatform</span>
              </div>
              <h3 className="mt-0.5 text-base font-bold text-slate-900">
                Platform Performance
              </h3>
            </div>

            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setChartMetricMode('reach_views')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  chartMetricMode === 'reach_views'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reach & Views
              </button>
              <button
                type="button"
                onClick={() => setChartMetricMode('interactions')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  chartMetricMode === 'interactions'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Interaksi
              </button>
              <button
                type="button"
                onClick={() => setChartMetricMode('er')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors whitespace-nowrap ${
                  chartMetricMode === 'er'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Eng. Rate (%)
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetricMode === 'reach_views' ? (
                <BarChart data={platformPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="platform" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="reach" name="Reach" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="views" name="Views" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : chartMetricMode === 'interactions' ? (
                <BarChart data={platformPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="platform" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="likes" name="Likes" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="comments" name="Komentar" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" name="Shares" fill="#0F172A" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart data={platformPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="platform" tick={{ fontSize: 12, fill: '#475569' }} />
                  <YAxis unit="%" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Engagement Rate']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="engagementRate" name="Engagement Rate (%)" radius={[6, 6, 0, 0]}>
                    {platformPerformance.map((entry) => (
                      <Cell
                        key={entry.platform}
                        fill={PLATFORM_COLORS[entry.platform as MainPlatformGroup]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>

        <section className="xl:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Audience Insights
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Demografi usia, komposisi gender, serta performa waktu & kanal audiens.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-700 mb-2">
              Kelompok Usia Audiens (%)
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={audienceAgeData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis type="category" dataKey="ageGroup" width={62} tick={{ fontSize: 11, fill: '#334155' }} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Proporsi Audiens']} />
                  <Bar dataKey="persentase" fill="#6D28D9" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Jenis Kelamin Audiens</span>
              <span className="font-mono tabular-nums text-slate-500">
                Perempuan {genderBreakdown.female}% · Laki-laki {genderBreakdown.male}%
              </span>
            </div>
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-violet-700 transition-all"
                style={{ width: `${genderBreakdown.female}%` }}
                title={`Perempuan ${genderBreakdown.female}%`}
              />
              <div
                className="bg-blue-700 transition-all"
                style={{ width: `${genderBreakdown.male}%` }}
                title={`Laki-laki ${genderBreakdown.male}%`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-slate-100 pt-4">
            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500">
                Platform Engagement Tertinggi
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                {dynamicInsights.topPlatform
                  ? dynamicInsights.topPlatform.platform
                  : 'Belum tersedia'}
              </div>
              <div className="font-mono text-xs tabular-nums text-violet-700">
                {dynamicInsights.topPlatform
                  ? `${dynamicInsights.topPlatform.engagementRate}% ER`
                  : '-'}
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="text-[11px] font-semibold text-slate-500">
                Waktu Publikasi Terbaik
              </div>
              <div className="mt-1 text-sm font-bold font-mono tabular-nums text-slate-900">
                {dynamicInsights.bestTimeEntry
                  ? formatCompactTime(dynamicInsights.bestTimeEntry.time)
                  : 'Belum tersedia'}
              </div>
              <div className="font-mono text-xs tabular-nums text-blue-700">
                {dynamicInsights.bestTimeEntry
                  ? `${formatEngagementRate(dynamicInsights.bestTimeEntry.er)} rata-rata ER`
                  : '-'}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Content Insights
          </h3>
          <p className="text-xs text-slate-500">
            Ringkasan analisis otomatis yang berubah mengikuti filter dan pembaruan metrik konten.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-700">
              <Award className="h-4 w-4" />
              <span>Platform Engagement Tertinggi</span>
            </div>
            <div className="mt-2 text-lg font-bold text-slate-900">
              {dynamicInsights.topPlatform
                ? dynamicInsights.topPlatform.platform
                : 'Belum ada data tayang'}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {dynamicInsights.topPlatform
                ? `Mencapai ${dynamicInsights.topPlatform.engagementRate}% engagement rate dari ${formatNumber(dynamicInsights.topPlatform.reach)} total reach.`
                : 'Publikasikan konten dan catat metrik di Tahap 6 MUQOLIP untuk melihat peringkat platform.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              <span>Konten Performa Terbaik</span>
            </div>
            <div className="mt-2 text-base font-bold text-slate-900 line-clamp-1">
              {dynamicInsights.bestContent
                ? dynamicInsights.bestContent.title
                : 'Belum ada data tayang'}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {dynamicInsights.bestContent
                ? `${dynamicInsights.bestContent.platform} · ER ${formatEngagementRate(
                    getItemEngagementRate(dynamicInsights.bestContent)
                  )} (${formatNumber(dynamicInsights.bestContent.metrics.reach)} reach).`
                : 'Belum ada konten dengan data jangkauan pada filter yang dipilih.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <TrendingDown className="h-4 w-4" />
              <span>Konten Jangkauan Terendah</span>
            </div>
            <div className="mt-2 text-base font-bold text-slate-900 line-clamp-1">
              {dynamicInsights.lowestReachContent
                ? dynamicInsights.lowestReachContent.title
                : 'Belum ada data tayang'}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {dynamicInsights.lowestReachContent
                ? `${dynamicInsights.lowestReachContent.platform} · ${formatNumber(
                    dynamicInsights.lowestReachContent.metrics.reach
                  )} reach pada ${formatIndonesianDate(
                    dynamicInsights.lowestReachContent.publishDate
                  )}.`
                : 'Tidak ditemukan konten dengan jangkauan tercatat.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Clock className="h-4 w-4" />
              <span>Rekomendasi Waktu Publikasi</span>
            </div>
            <div className="mt-2 text-lg font-bold font-mono tabular-nums text-slate-900">
              {dynamicInsights.bestTimeEntry
                ? formatCompactTime(dynamicInsights.bestTimeEntry.time)
                : '19:00 WIB'}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              {dynamicInsights.bestTimeEntry
                ? `Berdasarkan data aktual, jam tayang ${dynamicInsights.bestTimeEntry.time} WIB menghasilkan rasio interaksi tertinggi (${formatEngagementRate(dynamicInsights.bestTimeEntry.er)}).`
                : 'Catat metrik respons publik di Tahap 6 untuk menghitung rekomendasi jam terbaik secara otomatis.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
