import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TEAM_MEMBERS } from '../../data/initialData';
import type {
  ContentFormat,
  ContentFormValues,
  ContentItem,
  ContentStatus,
  PlatformType,
} from '../../types/contentra';

interface ContentFormModalProps {
  open: boolean;
  initialItem?: ContentItem | null;
  defaultDate?: string;
  onClose: () => void;
  onSave: (values: ContentFormValues, existingId?: string) => void;
}

const PLATFORMS: PlatformType[] = [
  'Instagram',
  'Instagram Story',
  'TikTok',
  'X/Twitter',
  'Facebook',
];

const FORMATS: ContentFormat[] = [
  'Carousel',
  'Reels / Video Pendek',
  'Single Post',
  'Story',
  'Infografis',
  'Thread',
];

const STATUSES: ContentStatus[] = [
  'Draft',
  'Dalam Proses',
  'Terjadwal',
  'Terpublikasi',
  'Perlu Revisi',
];

export function ContentFormModal({
  open,
  initialItem,
  defaultDate,
  onClose,
  onSave,
}: ContentFormModalProps) {
  const [form, setForm] = useState<ContentFormValues>({
    title: '',
    description: '',
    communicationGoal: '',
    targetAudience: '',
    keyMessage: '',
    platform: 'Instagram',
    format: 'Carousel',
    publishDate: defaultDate || '2026-11-26',
    publishTime: '09:00',
    pic: TEAM_MEMBERS[0],
    status: 'Draft',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContentFormValues, string>>>({});

  useEffect(() => {
    if (!open) return;
    if (initialItem) {
      setForm({
        title: initialItem.title,
        description: initialItem.description,
        communicationGoal: initialItem.communicationGoal,
        targetAudience: initialItem.targetAudience,
        keyMessage: initialItem.keyMessage,
        platform: initialItem.platform,
        format: initialItem.format,
        publishDate: initialItem.publishDate,
        publishTime: initialItem.publishTime,
        pic: initialItem.pic,
        status: initialItem.status,
      });
    } else {
      setForm({
        title: '',
        description: '',
        communicationGoal: '',
        targetAudience: '',
        keyMessage: '',
        platform: 'Instagram',
        format: 'Carousel',
        publishDate: defaultDate || '2026-11-26',
        publishTime: '09:00',
        pic: TEAM_MEMBERS[0],
        status: 'Draft',
      });
    }
    setErrors({});
  }, [open, initialItem, defaultDate]);

  if (!open) return null;

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ContentFormValues, string>> = {};
    if (!form.title.trim()) nextErrors.title = 'Judul konten wajib diisi.';
    if (!form.description.trim()) nextErrors.description = 'Deskripsi konten wajib diisi.';
    if (!form.communicationGoal.trim())
      nextErrors.communicationGoal = 'Tujuan komunikasi wajib diisi.';
    if (!form.targetAudience.trim()) nextErrors.targetAudience = 'Target audiens wajib diisi.';
    if (!form.keyMessage.trim()) nextErrors.keyMessage = 'Pesan utama wajib diisi.';
    if (!form.publishDate) nextErrors.publishDate = 'Tanggal publikasi wajib dipilih.';
    if (!form.publishTime) nextErrors.publishTime = 'Jam publikasi wajib diisi.';
    if (!form.pic.trim()) nextErrors.pic = 'Penanggung jawab wajib diisi.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form, initialItem?.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-form-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="content-form-title" className="text-lg font-semibold text-slate-900">
              {initialItem ? 'Edit Konten Kehumasan' : 'Tambah Konten Baru'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Data konten akan langsung tersinkronisasi ke Dashboard, Kalender, Siklus MUQOLIP, dan Perpustakaan Konten.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup form"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Judul Konten <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Kampanye Literasi Digital Kampus"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Deskripsi Konten <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Jelaskan konteks singkat dan isi konten yang akan diproduksi..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tujuan Komunikasi <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                value={form.communicationGoal}
                onChange={(e) => setForm({ ...form, communicationGoal: e.target.value })}
                placeholder="Apa dampak komunikasi yang diharapkan?"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              />
              {errors.communicationGoal && (
                <p className="mt-1 text-xs text-rose-600">{errors.communicationGoal}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Audiens <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={2}
                value={form.targetAudience}
                onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                placeholder="Contoh: Mahasiswa baru, mitra eksternal, publik umum"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              />
              {errors.targetAudience && (
                <p className="mt-1 text-xs text-rose-600">{errors.targetAudience}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pesan Utama (Key Message) <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={form.keyMessage}
              onChange={(e) => setForm({ ...form, keyMessage: e.target.value })}
              placeholder="Inti pesan yang ingin melekat di benak audiens..."
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
            />
            {errors.keyMessage && (
              <p className="mt-1 text-xs text-rose-600">{errors.keyMessage}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Platform Publikasi
              </label>
              <select
                value={form.platform}
                onChange={(e) =>
                  setForm({ ...form, platform: e.target.value as PlatformType })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              >
                {PLATFORMS.map((p) => (
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
                value={form.format}
                onChange={(e) =>
                  setForm({ ...form, format: e.target.value as ContentFormat })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Publikasi <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              />
              {errors.publishDate && (
                <p className="mt-1 text-xs text-rose-600">{errors.publishDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jam Publikasi <span className="text-rose-600">*</span>
              </label>
              <input
                type="time"
                value={form.publishTime}
                onChange={(e) => setForm({ ...form, publishTime: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              />
              {errors.publishTime && (
                <p className="mt-1 text-xs text-rose-600">{errors.publishTime}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Penanggung Jawab <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                list="contentra-team-members"
                value={form.pic}
                onChange={(e) => setForm({ ...form, pic: e.target.value })}
                placeholder="Nama penanggung jawab"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              />
              <datalist id="contentra-team-members">
                {TEAM_MEMBERS.map((member) => (
                  <option key={member} value={member} />
                ))}
              </datalist>
              {errors.pic && <p className="mt-1 text-xs text-rose-600">{errors.pic}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status Konten
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as ContentStatus })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/15"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-violet-700 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-800 transition-colors"
            >
              {initialItem ? 'Simpan Perubahan' : 'Simpan Konten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
