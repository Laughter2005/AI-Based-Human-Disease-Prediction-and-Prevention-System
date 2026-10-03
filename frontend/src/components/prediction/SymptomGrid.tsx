import { useMemo, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SymptomCard } from './SymptomCard';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface SymptomGridProps {
  symptoms: string[];
  selected: string[];
  onToggle: (id: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

/**
 * Categorize symptoms by keyword. Falls back to "other" for anything else.
 * Categories are shown as section headers when a search query isn't active.
 */
const CATEGORIES: { key: string; label: string; keywords: string[] }[] = [
  {
    key: 'general',
    label: 'General',
    keywords: ['fever', 'fatigue', 'chills', 'body', 'malaise', 'weakness', 'weight'],
  },
  {
    key: 'respiratory',
    label: 'Respiratory',
    keywords: ['cough', 'nose', 'throat', 'breath', 'chest', 'sneeze', 'congestion', 'phlegm'],
  },
  {
    key: 'gastro',
    label: 'Digestive',
    keywords: ['vomit', 'nausea', 'stomach', 'diarrh', 'constipat', 'abdomen', 'appetite', 'belly'],
  },
  {
    key: 'neuro',
    label: 'Neurological',
    keywords: ['head', 'dizz', 'confus', 'seizure', 'vision', 'memory', 'numb'],
  },
  {
    key: 'skin',
    label: 'Skin',
    keywords: ['rash', 'itch', 'skin', 'spot', 'bruis', 'sweat', 'yellow'],
  },
  {
    key: 'joint',
    label: 'Muscular & Joint',
    keywords: ['joint', 'muscle', 'back', 'neck', 'stiff', 'swell'],
  },
];

function categorize(symptom: string): string {
  const s = symptom.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.keywords.some((kw) => s.includes(kw))) return cat.key;
  }
  return 'other';
}

export function SymptomGrid({
  symptoms,
  selected,
  onToggle,
  onClear,
  loading,
}: SymptomGridProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, '_');
    if (!q) return symptoms;
    return symptoms.filter((s) => s.toLowerCase().includes(q));
  }, [symptoms, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, string[]> = {};
    for (const s of filtered) {
      const cat = categorize(s);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    }
    return groups;
  }, [filtered]);

  const hasQuery = query.trim().length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
        <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
          {t('common.loading')}
        </span>
      </div>
    );
  }

  return (
    <div>
      {/* Search + clear bar */}
      <div className="sticky top-0 z-10 -mx-1 mb-4 flex items-center gap-2 bg-white px-1 pb-3 dark:bg-zinc-950">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('predict.step1.search')}
            className="input pl-10 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {onClear && selected.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="whitespace-nowrap border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-danger-300 hover:bg-danger-50 hover:text-danger-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-danger-700 dark:hover:bg-danger-950/30 dark:hover:text-danger-400"
          >
            {t('predict.step1.clear')}
          </button>
        )}
      </div>

      {/* Selected summary */}
      {selected.length > 0 && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {t('predict.step1.selected_count', { count: selected.length })}
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="border border-dashed border-slate-300 py-12 text-center dark:border-zinc-700">
          <Search className="mx-auto h-6 w-6 text-slate-300 dark:text-zinc-700" />
          <p className="mt-3 text-sm text-slate-500 dark:text-zinc-500">
            {t('predict.step1.empty', { query })}
          </p>
        </div>
      )}

      {/* Grouped grid */}
      {!hasQuery &&
        CATEGORIES.concat([{ key: 'other', label: 'Other', keywords: [] }]).map((cat) => {
          const items = grouped[cat.key];
          if (!items || items.length === 0) return null;
          return (
            <div key={cat.key} className="mb-6 last:mb-0">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  {cat.label}
                </h3>
                <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((s) => (
                  <SymptomCard
                    key={s}
                    id={s}
                    label={s}
                    selected={selected.includes(s)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </div>
          );
        })}

      {/* Flat grid when searching */}
      {hasQuery && filtered.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {filtered.map((s) => (
            <SymptomCard
              key={s}
              id={s}
              label={s}
              selected={selected.includes(s)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}