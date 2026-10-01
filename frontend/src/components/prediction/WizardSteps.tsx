import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface WizardStepsProps {
  current: number; // 1-indexed
  total: number;
  labels: string[];
}

export function WizardSteps({ current, total, labels }: WizardStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1;
          const isDone = step < current;
          const isActive = step === current;

          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all',
                  isDone
                    ? 'bg-primary-500 text-white'
                    : isActive
                    ? 'bg-primary-500 text-white ring-4 ring-primary-500/20'
                    : 'bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500'
                )}
              >
                {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
              </div>
              {i < total - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 rounded transition-colors',
                    isDone ? 'bg-primary-500' : 'bg-slate-200 dark:bg-zinc-800'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-between">
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              'text-xs font-medium uppercase tracking-wider sm:text-sm',
              i + 1 === current
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-slate-500 dark:text-zinc-500'
            )}
            style={{ width: `${100 / total}%`, textAlign: i === 0 ? 'left' : i === total - 1 ? 'right' : 'center' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}