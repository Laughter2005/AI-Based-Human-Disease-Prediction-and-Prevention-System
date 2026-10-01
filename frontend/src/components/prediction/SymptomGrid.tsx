import { useMemo, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { SymptomCard } from './SymptomCard';

interface SymptomGridProps {
  symptoms: string[];
  selected: string[];
  onToggle: (id: string) => void;
  loading?: boolean;
}

export function SymptomGrid({ symptoms, selected, onToggle, loading }: SymptomGridProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, '_');
    if (!q) return symptoms;
    return symptoms.filter((s) => s.toLowerCase().includes(q));
  }, [symptoms, query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        <span className="ml-3 text-slate-600 dark:text-zinc-400">Loading symptoms...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symptoms..."
          className="input pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-slate-500 dark:text-zinc-500">
          No symptoms match "{query}".
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
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