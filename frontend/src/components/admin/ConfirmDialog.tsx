import { useTranslation } from 'react-i18next';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md border border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
        <button
          onClick={onCancel}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center',
                variant === 'danger'
                  ? 'bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-400'
                  : 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
              )}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                {body}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onCancel}
              disabled={loading}
              className="border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                'px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50',
                variant === 'danger'
                  ? 'bg-danger-600 hover:bg-danger-700'
                  : 'bg-primary-600 hover:bg-primary-700'
              )}
            >
              {loading ? '...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}