import {
  BarChart3,
  CalendarDays,
  FolderKanban,
  GitBranch,
  LayoutDashboard,
  RotateCcw,
  X,
} from 'lucide-react';
import type { NavPage } from '../../types/contentra';

interface SidebarProps {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onRequestResetDemo: () => void;
  totalItems: number;
}

const NAV_ITEMS: { id: NavPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'siklus', label: 'Siklus Literatif', icon: GitBranch },
  { id: 'kalender', label: 'Content Calendar', icon: CalendarDays },
  { id: 'analytics', label: 'Performance Analytics', icon: BarChart3 },
  { id: 'library', label: 'Content Library', icon: FolderKanban },
];

export function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  onRequestResetDemo,
  totalItems,
}: SidebarProps) {
  const navContent = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100">
      <div className="flex items-start justify-between border-b border-slate-800 px-5 py-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
              C
            </div>
            <span className="text-lg font-bold tracking-tight text-white">
              CONTENTRA
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            Plan Smart. Create with Purpose. Engage with Impact.
          </p>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Tutup menu navigasi"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Navigasi utama">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile();
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-violet-600/20 text-white ring-1 ring-inset ring-violet-500/40'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    isActive ? 'text-violet-300' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </span>
              {item.id === 'library' && (
                <span className="font-mono text-xs tabular-nums text-slate-400">
                  {totalItems}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4 space-y-3">
        <div className="rounded-lg bg-slate-800/60 px-3.5 py-3">
          <div className="text-xs font-semibold text-slate-200">
            Metode MUQOLIP
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            Siklus Literatif Tunggal Penyusunan Konten Kehumasan 7 Tahap.
          </p>
        </div>

        <button
          type="button"
          onClick={onRequestResetDemo}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Data Demo</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
