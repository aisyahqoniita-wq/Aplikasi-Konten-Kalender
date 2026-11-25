import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_CONTENTS, INITIAL_NOTIFICATIONS } from '../data/initialData';
import type {
  AudienceAgeGroup,
  ContentFormValues,
  ContentItem,
  ContentStatus,
  IterationEntry,
  MuqolipStage,
  NotificationItem,
  ToastMessage,
} from '../types/contentra';

const STORAGE_ITEMS_KEY = 'contentra_items_v1';
const STORAGE_NOTIFS_KEY = 'contentra_notifications_v1';

interface Stage2Payload {
  communicationGoal: string;
  communicationIssue: string;
  targetAudience: string;
  desiredOutcome: string;
}

interface Stage3Payload {
  keyMessage: string;
  supportingMessages: string;
  communicationStyle: string;
  platform: ContentItem['platform'];
  format: ContentItem['format'];
}

interface Stage4Payload {
  publishDate: string;
  publishTime: string;
  platform: ContentItem['platform'];
  pic: string;
}

interface Stage6MetricsPayload {
  stage6ActualDate: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  views: number;
  stage6PublicNotes: string;
  audienceAgeGroup: AudienceAgeGroup;
  markPublished: boolean;
}

interface ContentraContextValue {
  items: ContentItem[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];
  activeCycleContentId: string;
  setActiveCycleContentId: (id: string) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  addContent: (values: ContentFormValues, startCycleAtStage?: MuqolipStage) => ContentItem;
  updateContent: (id: string, updates: Partial<ContentItem>) => void;
  deleteContent: (id: string) => void;
  updateStatus: (id: string, status: ContentStatus) => void;
  updateSchedule: (id: string, publishDate: string, publishTime?: string) => void;
  startNewCycleProject: (title?: string) => ContentItem;
  advanceStage1To2: (id: string) => void;
  saveStage2: (id: string, payload: Stage2Payload, advance?: boolean) => void;
  saveStage3: (id: string, payload: Stage3Payload, advance?: boolean) => void;
  saveStage4: (id: string, payload: Stage4Payload, advance?: boolean) => void;
  submitStage5Decision: (
    id: string,
    decision: 'YES' | 'NO',
    notes: string,
    targetStageForNo?: MuqolipStage,
    reviewer?: string
  ) => void;
  saveStage6Metrics: (id: string, payload: Stage6MetricsPayload) => void;
  submitStage6Decision: (
    id: string,
    decision: 'YES' | 'NO',
    notes: string,
    targetStageForNo?: MuqolipStage,
    reviewer?: string
  ) => void;
  saveStage7Conclusion: (id: string, conclusion: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const ContentraContext = createContext<ContentraContextValue | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function uniqueCompletedStages(stages: MuqolipStage[], add: MuqolipStage[]): MuqolipStage[] {
  const set = new Set<MuqolipStage>([...stages, ...add]);
  return Array.from(set).sort((a, b) => a - b) as MuqolipStage[];
}

export function ContentraProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ContentItem[]>(() =>
    loadFromStorage<ContentItem[]>(STORAGE_ITEMS_KEY, INITIAL_CONTENTS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadFromStorage<NotificationItem[]>(STORAGE_NOTIFS_KEY, INITIAL_NOTIFICATIONS)
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeCycleContentId, setActiveCycleContentId] = useState<string>(() => {
    const initial = loadFromStorage<ContentItem[]>(STORAGE_ITEMS_KEY, INITIAL_CONTENTS);
    return initial[0]?.id ?? '';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifications));
    } catch {
      // Ignore storage quota errors
    }
  }, [notifications]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushNotification = (title: string, message: string, relatedContentId?: string) => {
    const now = new Date();
    const formattedTime = `${now.getDate()} Nov 2026, ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: formattedTime,
      read: false,
      relatedContentId,
    };
    setNotifications((prev) => [newNotif, ...prev].slice(0, 15));
  };

  const addContent = (
    values: ContentFormValues,
    startCycleAtStage?: MuqolipStage
  ): ContentItem => {
    const nowIso = new Date().toISOString();
    const id = `cnt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;

    let inferredStage: MuqolipStage = startCycleAtStage ?? 4;
    let completed: MuqolipStage[] = [1, 2, 3];
    if (!startCycleAtStage) {
      if (values.status === 'Terpublikasi') {
        inferredStage = 6;
        completed = [1, 2, 3, 4, 5];
      } else if (values.status === 'Terjadwal') {
        inferredStage = 6;
        completed = [1, 2, 3, 4, 5];
      } else if (values.status === 'Dalam Proses') {
        inferredStage = 5;
        completed = [1, 2, 3, 4];
      } else {
        inferredStage = 2;
        completed = [1];
      }
    } else {
      completed = Array.from(
        { length: Math.max(0, startCycleAtStage - 1) },
        (_, i) => (i + 1) as MuqolipStage
      );
    }

    const newItem: ContentItem = {
      id,
      title: values.title.trim(),
      description: values.description.trim(),
      communicationGoal: values.communicationGoal.trim(),
      communicationIssue: '',
      targetAudience: values.targetAudience.trim(),
      desiredOutcome: '',
      keyMessage: values.keyMessage.trim(),
      supportingMessages: '',
      communicationStyle: 'Informatif & Persuasif',
      platform: values.platform,
      format: values.format,
      publishDate: values.publishDate,
      publishTime: values.publishTime,
      pic: values.pic,
      status: values.status,
      createdAt: nowIso,
      updatedAt: nowIso,
      cycle: {
        currentStage: inferredStage,
        completedStages: completed,
        stage5Decision: values.status === 'Terjadwal' || values.status === 'Terpublikasi' ? 'YES' : 'pending',
        stage5Notes: '',
        stage6ActualDate: values.status === 'Terpublikasi' ? values.publishDate : '',
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
        audienceGenderSplit: { female: 56, male: 44 },
      },
    };

    setItems((prev) => [newItem, ...prev]);
    setActiveCycleContentId(id);
    pushNotification('Konten Baru Ditambahkan', `"${newItem.title}" berhasil dibuat (${newItem.status}).`, id);
    showToast(`Konten "${newItem.title}" berhasil disimpan.`);
    return newItem;
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    showToast('Perubahan konten berhasil disimpan.');
  };

  const deleteContent = (id: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (activeCycleContentId === id) {
        setActiveCycleContentId(next[0]?.id ?? '');
      }
      return next;
    });
    if (target) {
      pushNotification('Konten Dihapus', `"${target.title}" telah dihapus dari repositori.`, undefined);
      showToast(`Konten "${target.title}" berhasil dihapus.`, 'info');
    }
  };

  const updateStatus = (id: string, status: ContentStatus) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        let nextCycle = { ...item.cycle };
        if (status === 'Terpublikasi') {
          nextCycle = {
            ...nextCycle,
            currentStage: Math.max(nextCycle.currentStage, 6) as MuqolipStage,
            completedStages: uniqueCompletedStages(nextCycle.completedStages, [1, 2, 3, 4, 5]),
            stage5Decision: 'YES',
            stage6ActualDate: nextCycle.stage6ActualDate || item.publishDate || '2026-11-24',
          };
        } else if (status === 'Terjadwal') {
          nextCycle = {
            ...nextCycle,
            currentStage: Math.max(nextCycle.currentStage, 6) as MuqolipStage,
            completedStages: uniqueCompletedStages(nextCycle.completedStages, [1, 2, 3, 4, 5]),
            stage5Decision: 'YES',
          };
        }
        return {
          ...item,
          status,
          cycle: nextCycle,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast(`Status konten diperbarui menjadi "${status}".`);
  };

  const updateSchedule = (id: string, publishDate: string, publishTime?: string) => {
    const target = items.find((i) => i.id === id);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              publishDate,
              publishTime: publishTime ?? item.publishTime,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    if (target) {
      showToast(`Jadwal "${target.title}" dipindahkan ke ${publishDate}.`);
    }
  };

  const startNewCycleProject = (title?: string): ContentItem => {
    const cleanTitle = title?.trim() || 'Proyek Konten Kehumasan Baru';
    const created = addContent(
      {
        title: cleanTitle,
        description: 'Proyek penyusunan konten kehumasan melalui Siklus Literatif MUQOLIP.',
        communicationGoal: '',
        targetAudience: '',
        keyMessage: '',
        platform: 'Instagram',
        format: 'Carousel',
        publishDate: '2026-11-29',
        publishTime: '10:00',
        pic: 'Aisyah Qonita',
        status: 'Draft',
      },
      2
    );
    return created;
  };

  const advanceStage1To2 = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              cycle: {
                ...item.cycle,
                currentStage: 2,
                completedStages: uniqueCompletedStages(item.cycle.completedStages, [1]),
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    showToast('Siklus dimulai. Lanjut ke Tahap 2: Menentukan Tujuan Komunikasi.');
  };

  const saveStage2 = (id: string, payload: Stage2Payload, advance = true) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              communicationGoal: payload.communicationGoal,
              communicationIssue: payload.communicationIssue,
              targetAudience: payload.targetAudience,
              desiredOutcome: payload.desiredOutcome,
              status: item.status === 'Draft' ? 'Dalam Proses' : item.status,
              cycle: {
                ...item.cycle,
                currentStage: advance
                  ? (Math.max(item.cycle.currentStage, 3) as MuqolipStage)
                  : item.cycle.currentStage,
                completedStages: uniqueCompletedStages(item.cycle.completedStages, [1, 2]),
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    showToast(advance ? 'Tahap 2 disimpan. Lanjut ke Tahap 3.' : 'Progres Tahap 2 disimpan.');
  };

  const saveStage3 = (id: string, payload: Stage3Payload, advance = true) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              keyMessage: payload.keyMessage,
              supportingMessages: payload.supportingMessages,
              communicationStyle: payload.communicationStyle,
              platform: payload.platform,
              format: payload.format,
              status: item.status === 'Draft' ? 'Dalam Proses' : item.status,
              cycle: {
                ...item.cycle,
                currentStage: advance
                  ? (Math.max(item.cycle.currentStage, 4) as MuqolipStage)
                  : item.cycle.currentStage,
                completedStages: uniqueCompletedStages(item.cycle.completedStages, [1, 2, 3]),
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    showToast(advance ? 'Tahap 3 disimpan. Lanjut ke Tahap 4.' : 'Progres Tahap 3 disimpan.');
  };

  const saveStage4 = (id: string, payload: Stage4Payload, advance = true) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              publishDate: payload.publishDate,
              publishTime: payload.publishTime,
              platform: payload.platform,
              pic: payload.pic,
              status: item.status === 'Draft' || item.status === 'Perlu Revisi' ? 'Dalam Proses' : item.status,
              cycle: {
                ...item.cycle,
                currentStage: advance ? 5 : item.cycle.currentStage,
                completedStages: uniqueCompletedStages(item.cycle.completedStages, [1, 2, 3, 4]),
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    showToast(
      advance
        ? 'Jadwal tersinkronisasi ke Content Calendar. Lanjut ke Tahap 5 Evaluasi.'
        : 'Jadwal publikasi Tahap 4 berhasil diperbarui.'
    );
  };

  const submitStage5Decision = (
    id: string,
    decision: 'YES' | 'NO',
    notes: string,
    targetStageForNo: MuqolipStage = 3,
    reviewer = 'Tim Evaluator CONTENTRA'
  ) => {
    const nowLabel = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const entry: IterationEntry = {
          id: `iter-${Date.now()}`,
          timestamp: nowLabel,
          fromStage: 5,
          decision,
          targetStage: decision === 'NO' ? targetStageForNo : 6,
          notes:
            notes.trim() ||
            (decision === 'YES'
              ? 'Konten dan jadwal publikasi dinilai sesuai tujuan komunikasi.'
              : 'Diperlukan penyesuaian kembali pada tahap penyusunan.'),
          reviewer,
        };

        if (decision === 'YES') {
          const nextStatus: ContentStatus =
            item.status === 'Terpublikasi' ? 'Terpublikasi' : 'Terjadwal';
          return {
            ...item,
            status: nextStatus,
            cycle: {
              ...item.cycle,
              currentStage: 6,
              completedStages: uniqueCompletedStages(item.cycle.completedStages, [1, 2, 3, 4, 5]),
              stage5Decision: 'YES',
              stage5Notes: entry.notes,
              iterationHistory: [...item.cycle.iterationHistory, entry],
            },
            updatedAt: new Date().toISOString(),
          };
        }

        // Decision === 'NO': loop back to targetStageForNo for revision
        const retainedCompleted = item.cycle.completedStages.filter(
          (s) => s < targetStageForNo
        ) as MuqolipStage[];
        return {
          ...item,
          status: 'Perlu Revisi',
          cycle: {
            ...item.cycle,
            currentStage: targetStageForNo,
            completedStages: retainedCompleted,
            stage5Decision: 'NO',
            stage5Notes: entry.notes,
            iterationHistory: [...item.cycle.iterationHistory, entry],
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (decision === 'YES') {
      pushNotification(
        'Evaluasi Tahap 5 Disetujui',
        'Konten berstatus Terjadwal dan siap dipublikasikan pada Tahap 6.',
        id
      );
      showToast('Keputusan YES dicatat. Status konten menjadi Terjadwal & lanjut ke Tahap 6.');
    } else {
      pushNotification(
        'Iterasi Revisi Tahap 5',
        `Konten dikembalikan ke Tahap ${targetStageForNo} untuk perbaikan.`,
        id
      );
      showToast(
        `Keputusan NO dicatat. Konten diarahkan kembali ke Tahap ${targetStageForNo} untuk revisi.`,
        'warning'
      );
    }
  };

  const saveStage6Metrics = (id: string, payload: Stage6MetricsPayload) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status: payload.markPublished ? 'Terpublikasi' : item.status,
          cycle: {
            ...item.cycle,
            stage6ActualDate: payload.stage6ActualDate || item.publishDate,
            stage6PublicNotes: payload.stage6PublicNotes,
          },
          metrics: {
            ...item.metrics,
            likes: Math.max(0, Number(payload.likes) || 0),
            comments: Math.max(0, Number(payload.comments) || 0),
            shares: Math.max(0, Number(payload.shares) || 0),
            reach: Math.max(0, Number(payload.reach) || 0),
            views: Math.max(0, Number(payload.views) || 0),
            audienceAgeGroup: payload.audienceAgeGroup,
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('Data publikasi & metrik respons publik tersimpan dan tersinkronisasi ke Analytics.');
  };

  const submitStage6Decision = (
    id: string,
    decision: 'YES' | 'NO',
    notes: string,
    targetStageForNo: MuqolipStage = 2,
    reviewer = 'Tim Evaluator CONTENTRA'
  ) => {
    const nowLabel = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const entry: IterationEntry = {
          id: `iter-${Date.now()}`,
          timestamp: nowLabel,
          fromStage: 6,
          decision,
          targetStage: decision === 'NO' ? targetStageForNo : 7,
          notes:
            notes.trim() ||
            (decision === 'YES'
              ? 'Respons publik positif dan sesuai dengan tujuan komunikasi.'
              : 'Respons publik belum optimal, memerlukan perbaikan pada siklus berikutnya.'),
          reviewer,
        };

        if (decision === 'YES') {
          return {
            ...item,
            status: 'Terpublikasi',
            cycle: {
              ...item.cycle,
              currentStage: 7,
              completedStages: uniqueCompletedStages(item.cycle.completedStages, [1, 2, 3, 4, 5, 6, 7]),
              stage6Decision: 'YES',
              stage7Conclusion:
                item.cycle.stage7Conclusion ||
                `Konten "${item.title}" telah melalui seluruh alur Siklus Literatif MUQOLIP dengan respons publik yang selaras terhadap tujuan komunikasi.`,
              iterationHistory: [...item.cycle.iterationHistory, entry],
            },
            updatedAt: new Date().toISOString(),
          };
        }

        // Decision === 'NO': return to evaluation/improvement cycle
        const retained = item.cycle.completedStages.filter((s) => s < targetStageForNo) as MuqolipStage[];
        return {
          ...item,
          status: 'Perlu Revisi',
          cycle: {
            ...item.cycle,
            currentStage: targetStageForNo,
            completedStages: retained,
            stage6Decision: 'NO',
            stage6RevisionNotes: entry.notes,
            iterationHistory: [...item.cycle.iterationHistory, entry],
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (decision === 'YES') {
      pushNotification(
        'Siklus MUQOLIP Selesai',
        'Evaluasi respons publik disetujui dan konten mencapai Tahap 7 (Selesai).',
        id
      );
      showToast('Keputusan YES dicatat. Siklus MUQOLIP selesai di Tahap 7!');
    } else {
      pushNotification(
        'Perbaikan Siklus Berikutnya',
        `Evaluasi respons publik diarahkan kembali ke Tahap ${targetStageForNo}.`,
        id
      );
      showToast(
        `Keputusan NO dicatat. Catatan perbaikan disimpan dan siklus diarahkan ke Tahap ${targetStageForNo}.`,
        'warning'
      );
    }
  };

  const saveStage7Conclusion = (id: string, conclusion: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              cycle: {
                ...item.cycle,
                completedStages: uniqueCompletedStages(item.cycle.completedStages, [1, 2, 3, 4, 5, 6, 7]),
                stage7Conclusion: conclusion,
              },
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
    showToast('Kesimpulan siklus MUQOLIP berhasil disimpan.');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    setItems(INITIAL_CONTENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveCycleContentId(INITIAL_CONTENTS[0]?.id ?? '');
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(INITIAL_CONTENTS));
    localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    showToast('Data demo CONTENTRA berhasil diatur ulang ke kondisi awal.', 'info');
  };

  return (
    <ContentraContext.Provider
      value={{
        items,
        notifications,
        toasts,
        activeCycleContentId,
        setActiveCycleContentId,
        showToast,
        dismissToast,
        addContent,
        updateContent,
        deleteContent,
        updateStatus,
        updateSchedule,
        startNewCycleProject,
        advanceStage1To2,
        saveStage2,
        saveStage3,
        saveStage4,
        submitStage5Decision,
        saveStage6Metrics,
        submitStage6Decision,
        saveStage7Conclusion,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </ContentraContext.Provider>
  );
}

export function useContentra() {
  const ctx = useContext(ContentraContext);
  if (!ctx) {
    throw new Error('useContentra must be used within ContentraProvider');
  }
  return ctx;
}
