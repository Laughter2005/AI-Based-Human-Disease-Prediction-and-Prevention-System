import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SymptomCardProps {
  id: string;
  label: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function SymptomCard({ id, label, selected, onToggle }: SymptomCardProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full items-start gap-3 rounded border p-4 text-left transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-lifted',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        selected
          ? 'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-900/20'
          : 'border-slate-200 bg-white hover:border-primary-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-700'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
          selected
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-slate-300 bg-white dark:border-zinc-600 dark:bg-zinc-800'
        )}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span
        className={cn(
          'text-base font-medium capitalize',
          selected
            ? 'text-primary-900 dark:text-primary-100'
            : 'text-slate-800 dark:text-zinc-200'
        )}
      >
        {label.replace(/_/g, ' ')}
      </span>
    </button>
  );
}