import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateSymptom } from '../../utils/symptomNames';
import { cn } from '../../utils/cn';

interface SymptomCardProps {
  id: string;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function SymptomCard({ id, selected, onToggle }: SymptomCardProps) {
  const { i18n } = useTranslation();
  const label = translateSymptom(id, i18n.language);

  return (
    <button
      type="button"
      onClick={() => onToggle(id)}
      aria-pressed={selected}
      className={cn(
        'group relative flex w-full items-center gap-3 border px-4 py-3 text-left transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        selected
          ? 'border-primary-600 bg-primary-50 shadow-sm dark:border-primary-500 dark:bg-primary-950/40'
          : 'border-slate-200 bg-white hover:border-primary-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700'
      )}
    >
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-200',
          selected
            ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
            : 'border-slate-300 bg-white group-hover:border-primary-400 dark:border-zinc-700 dark:bg-zinc-900'
        )}
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3.5} />}
      </span>
      <span
        className={cn(
          'text-sm font-medium transition-colors',
          selected
            ? 'text-primary-900 dark:text-primary-100'
            : 'text-slate-800 group-hover:text-slate-900 dark:text-zinc-200 dark:group-hover:text-zinc-100'
        )}
      >
        {label}
      </span>
    </button>
  );
}