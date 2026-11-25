/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { ContentDetailModal } from './components/modals/ContentDetailModal';
import { ContentFormModal } from './components/modals/ContentFormModal';
import { ConfirmDialog } from './components/ui/ConfirmDialog';
import { ToastContainer } from './components/ui/ToastContainer';
import { ContentraProvider, useContentra } from './context/ContentraContext';
import { ContentCalendarPage } from './pages/ContentCalendarPage';
import { ContentLibraryPage } from './pages/ContentLibraryPage';
import { DashboardPage } from './pages/DashboardPage';
import { MuqolipCyclePage } from './pages/MuqolipCyclePage';
import { PerformanceAnalyticsPage } from './pages/PerformanceAnalyticsPage';
import type { ContentFormValues, ContentItem, NavPage } from './types/contentra';

function ContentraShell() {
  const {
    items,
    addContent,
    updateContent,
    deleteContent,
    updateStatus,
    setActiveCycleContentId,
    resetDemoData,
  } = useContentra();

  const [activePage, setActivePage] = useState<NavPage>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Add / Edit modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [defaultFormDate, setDefaultFormDate] = useState<string>('2026-11-26');

  // Detail modal state (store id so it stays reactive to live context updates)
  const [detailItemId, setDetailItemId] = useState<string | null>(null);
  const detailItem = items.find((i) => i.id === detailItemId) ?? null;

  // Confirm dialogs
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleOpenAddModal = (dateIso = '2026-11-26') => {
    setEditingItem(null);
    setDefaultFormDate(dateIso);
    setFormOpen(true);
  };

  const handleOpenEditModal = (item: ContentItem) => {
    setEditingItem(item);
    setDefaultFormDate(item.publishDate);
    setFormOpen(true);
  };

  const handleSaveForm = (values: ContentFormValues, existingId?: string) => {
    if (existingId) {
      updateContent(existingId, values);
    } else {
      addContent(values);
    }
  };

  const handleOpenInCycle = (id: string) => {
    setActiveCycleContentId(id);
    setActivePage('siklus');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onRequestResetDemo={() => setResetConfirmOpen(true)}
        totalItems={items.length}
      />

      <div className="lg:pl-64 flex min-h-screen flex-col">
        <TopHeader
          activePage={activePage}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenAddModal={() => handleOpenAddModal('2026-11-26')}
          onNavigate={setActivePage}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {activePage === 'dashboard' && (
            <DashboardPage
              onOpenAddModal={() => handleOpenAddModal('2026-11-26')}
              onOpenEditModal={handleOpenEditModal}
              onOpenDetailModal={(item) => setDetailItemId(item.id)}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'siklus' && (
            <MuqolipCyclePage onNavigate={setActivePage} />
          )}

          {activePage === 'kalender' && (
            <ContentCalendarPage
              onOpenAddModalWithDate={(dateIso) => handleOpenAddModal(dateIso)}
              onOpenDetailModal={(item) => setDetailItemId(item.id)}
            />
          )}

          {activePage === 'analytics' && <PerformanceAnalyticsPage />}

          {activePage === 'library' && (
            <ContentLibraryPage
              onOpenAddModal={() => handleOpenAddModal('2026-11-26')}
              onOpenEditModal={handleOpenEditModal}
              onOpenDetailModal={(item) => setDetailItemId(item.id)}
              onRequestDelete={(item) => setDeleteTarget(item)}
              onNavigate={setActivePage}
            />
          )}
        </main>
      </div>

      <ContentFormModal
        open={formOpen}
        initialItem={editingItem}
        defaultDate={defaultFormDate}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveForm}
      />

      <ContentDetailModal
        item={detailItem}
        onClose={() => setDetailItemId(null)}
        onEdit={handleOpenEditModal}
        onDelete={(item) => {
          setDetailItemId(null);
          setDeleteTarget(item);
        }}
        onStatusChange={updateStatus}
        onOpenInCycle={handleOpenInCycle}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus Konten?"
        description={
          deleteTarget
            ? `Apakah Anda yakin ingin menghapus "${deleteTarget.title}"? Seluruh riwayat siklus MUQOLIP dan metrik konten ini akan ikut dihapus.`
            : ''
        }
        confirmLabel="Ya, Hapus Konten"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            deleteContent(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Reset Data Demo CONTENTRA?"
        description="Semua perubahan konten, jadwal, riwayat iterasi, dan metrik lokal akan dikembalikan ke data demo awal."
        confirmLabel="Ya, Reset Data"
        variant="warning"
        onConfirm={() => {
          resetDemoData();
          setResetConfirmOpen(false);
        }}
        onCancel={() => setResetConfirmOpen(false)}
      />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ContentraProvider>
      <ContentraShell />
    </ContentraProvider>
  );
}
