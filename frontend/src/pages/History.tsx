import { useEffect, useMemo, useState } from 'react';
import { translateDisease } from '../utils/diseaseNames';
import { translateSymptom } from '../utils/symptomNames';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  History as HistoryIcon,
  Search,
  ArrowRight,
  ChevronDown,
  Loader2,
  Activity,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { predictionService, type HistoryItem } from '../services/predictionService';
import { cn } from '../utils/cn';

type SeverityFilter = 'all' | 'low' | 'moderate' | 'high';

function deriveSeverity(confidence: number): 'low' | 'moderate' | 'high' {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.45) return 'moderate';
  return 'low';
}

export function History() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await predictionService.history(100);
        setItems(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (q && !item.top_disease.toLowerCase().includes(q)) return false;
      if (severityFilter !== 'all') {
        const sev = deriveSeverity(item.top_confidence);
        if (sev !== severityFilter) return false;
      }
      return true;
    });
  }, [items, search, severityFilter]);

  const filters: { value: SeverityFilter; label: string }[] = [
    { value: 'all', label: t('history.filter_all') },
    { value: 'low', label: t('history.filter_low') },
    { value: 'moderate', label: t('history.filter_moderate') },
    { value: 'high', label: t('history.filter_high') },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        <div className="mx-auto max-w-4xl">
          {/* Heading */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('history.eyebrow')}
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('history.title')}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-zinc-400">
              {t('history.subtitle')}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center border border-slate-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
              <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
                {t('history.loading')}
              </span>
            </div>
          )}

          {/* Empty */}
          {!loading && items.length === 0 && (
            <div className="border border-dashed border-slate-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <HistoryIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-zinc-700" />
              <p className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {t('history.empty_title')}
              </p>
              <p className="mx-auto mt-1 max-w-md px-4 text-sm text-slate-600 dark:text-zinc-400">
                {t('history.empty_desc')}
              </p>
              <Link
                to="/predict"
                className="mt-6 inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md"
              >
                {t('history.empty_cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Content */}
          {!loading && items.length > 0 && (
            <>
              {/* Toolbar */}
              <div className="mb-6 border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="border-b border-slate-200 p-4 dark:border-zinc-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t('history.search_placeholder')}
                      className="input pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 p-4">
                  {filters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setSeverityFilter(f.value)}
                      className={cn(
                        'border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors',
                        severityFilter === f.value
                          ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-primary-700 dark:hover:text-primary-400'
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                  <span className="ml-auto text-xs font-medium text-slate-500 dark:text-zinc-500">
                    {search || severityFilter !== 'all'
                      ? t('history.filtered_count', {
                          shown: filtered.length,
                          total: items.length,
                        })
                      : t('history.count_label', { count: items.length })}
                  </span>
                </div>
              </div>

              {/* List */}
              {filtered.length === 0 ? (
                <div className="border border-dashed border-slate-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
                  <Search className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-700" />
                  <p className="mt-3 text-sm text-slate-500 dark:text-zinc-500">
                    {t('history.no_match')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((item) => {
                    const severity = deriveSeverity(item.top_confidence);
                    const expanded = expandedId === item.id;

                    const sevConfig = {
                      low: 'border-info-200 bg-info-50 text-info-700 dark:border-info-500/30 dark:bg-info-500/10 dark:text-info-400',
                      moderate: 'border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400',
                      high: 'border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-400',
                    }[severity];

                    const accent = {
                      low: 'border-l-info-500',
                      moderate: 'border-l-warning-500',
                      high: 'border-l-danger-500',
                    }[severity];

                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'animate-fade-in border border-slate-200 border-l-4 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950',
                          accent
                        )}
                      >
                        <button
                          onClick={() => setExpandedId(expanded ? null : item.id)}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                          aria-expanded={expanded}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                              <Activity className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                
                               <h3 className="truncate font-display text-lg font-bold ...">
                                 {translateDisease(item.top_disease, i18n.language)}
                               </h3>
                                     <span className={cn('border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', sevConfig)}>
                                  {t(`result.severity_${severity}`)}
                                </span>
                              </div>
                              <p className="mt-1 truncate font-mono text-xs text-slate-500 dark:text-zinc-500">
                                {new Date(item.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-4">
                            <div className="text-right">
                              <p className="font-display text-2xl font-bold tabular-nums leading-none text-slate-900 dark:text-zinc-100">
                                {(item.top_confidence * 100).toFixed(0)}
                                <span className="text-sm text-slate-400 dark:text-zinc-600">%</span>
                              </p>
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                {t('history.detail_confidence')}
                              </p>
                            </div>
                            <ChevronDown
                              className={cn(
                                'h-5 w-5 text-slate-400 transition-transform duration-200',
                                expanded && 'rotate-180'
                              )}
                            />
                          </div>
                        </button>

                        {expanded && (
                          <div className="animate-fade-in border-t border-slate-200 p-5 sm:p-6 dark:border-zinc-800">
                            <div className="grid gap-6 sm:grid-cols-2">
                              {/* Symptoms */}
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                  {t('history.detail_symptoms')}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                 {item.symptoms.map((s) => (
                                   <span
                                     key={s}
                                     className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                                   >
                                     {translateSymptom(s, i18n.language)}
                                   </span>
                                 ))}                                 
                                </div>

                                {item.unknown_symptoms.length > 0 && (
                                  <div className="mt-4">
                                    <p className="text-xs font-bold uppercase tracking-wider text-warning-600 dark:text-warning-400">
                                      {t('history.detail_unknown')}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {item.unknown_symptoms.map((s) => (
                                        <span
                                          key={s}
                                          className="border border-warning-200 bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400"
                                        >
                                          {translateSymptom(s, i18n.language)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Meta */}
                              <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                  {t('history.detail_model')}
                                </p>
                                <p className="mt-2 font-mono text-sm text-slate-800 dark:text-zinc-200">
                                  {item.model_name}
                                </p>

                                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                  {t('history.detail_severity')}
                                </p>
                                <span className={cn('mt-2 inline-block border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', sevConfig)}>
                                  {t(`result.severity_${severity}`)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}