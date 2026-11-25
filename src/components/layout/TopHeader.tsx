import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Menu, Plus, User } from 'lucide-react';
import { useContentra } from '../../context/ContentraContext';
import type { NavPage } from '../../types/contentra';

interface TopHeaderProps {
  activePage: NavPage;
  onOpenMobileNav: () => void;
  onOpenAddModal: () => void;
  onNavigate: (page: NavPage) => void;
}

const PAGE_TITLES: Record<NavPage, string> = {
  dashboard: 'Dashboard Utama',
  siklus: 'Siklus Literatif MUQOLIP',
  kalender: 'Content Calendar',
  analytics: 'Performance Analytics',
  library: 'Content Library',
};

export function TopHeader({
  activePage,
  onOpenMobileNav,
  onOpenAddModal,
  onNavigate,
}: TopHeaderProps) {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveCycleContentId,
  } = useContentra();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Buka menu navigasi"
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden sm:inline text-slate-400">CONTENTRA</span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <h1 className="truncate font-semibold text-slate-900">
            {PAGE_TITLES[activePage]}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-violet-800 transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tambah Konten Baru</span>
          <span className="sm:hidden">Konten</span>
        </button>

        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            aria-label="Buka notifikasi"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-700 px-1 text-[10px] font-bold font-mono tabular-nums text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-xs font-semibold text-slate-900">
                  Notifikasi Aktivitas
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 hover:text-violet-900"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-slate-500">
                    Belum ada notifikasi baru.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.relatedContentId) {
                          setActiveCycleContentId(n.relatedContentId);
                          onNavigate('siklus');
                        }
                        setNotifOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {n.title}
                        </span>
                        {!n.read && (
                          <span className="text-[10px] font-semibold text-violet-700">
                            Baru
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-600">
                        {n.message}
                      </p>
                      <span className="mt-1.5 block font-mono text-[11px] text-slate-400">
                        {n.timestamp}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            aria-label="Profil Tim CONTENTRA"
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white py-1 pl-1.5 pr-2.5 hover:bg-slate-50 transition-colors"
          >
            {!avatarFailed ? (
              <img
                src="/src/assets/images/avatar_tim_humas_1795591350350.jpg"
                alt="Profil Tim Kehumasan CONTENTRA"
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="h-7 w-7 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white">
                TC
              </div>
            )}
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                Tim CONTENTRA
              </div>
              <div className="text-[11px] text-slate-500 leading-tight">
                Divisi Kehumasan
              </div>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    Tim Kehumasan
                  </div>
                  <div className="text-xs text-slate-500">
                    Koordinator Publikasi Digital
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <p>Periode Aktif: November 2026</p>
                <p>Kerangka Kerja: Siklus MUQOLIP</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  onNavigate('siklus');
                }}
                className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 transition-colors"
              >
                Kelola Siklus Literatif
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
