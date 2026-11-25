import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { useContentra } from '../../context/ContentraContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useContentra();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2.5 pointer-events-none"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'success'
            ? CheckCircle2
            : toast.type === 'warning' || toast.type === 'error'
              ? AlertTriangle
              : Info;

        const toneClasses =
          toast.type === 'success'
            ? 'border-emerald-200 bg-white text-slate-900'
            : toast.type === 'warning'
              ? 'border-amber-200 bg-white text-slate-900'
              : toast.type === 'error'
                ? 'border-rose-200 bg-white text-slate-900'
                : 'border-blue-200 bg-white text-slate-900';

        const iconColor =
          toast.type === 'success'
            ? 'text-emerald-600'
            : toast.type === 'warning'
              ? 'text-amber-600'
              : toast.type === 'error'
                ? 'text-rose-600'
                : 'text-blue-600';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-200 ${toneClasses}`}
          >
            <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
            <p className="flex-1 text-sm font-medium leading-snug text-slate-800">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Tutup notifikasi"
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
