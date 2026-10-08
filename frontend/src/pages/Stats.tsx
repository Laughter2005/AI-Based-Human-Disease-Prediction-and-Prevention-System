import { useEffect, useState } from 'react';
import { translateDisease } from '../utils/diseaseNames';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Activity,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { statsService, type UserStats } from '../services/statsService';
import { cn } from '../utils/cn';

export function Stats() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await statsService.me();
        setStats(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-primary-600 dark:text-primary-400" />
        <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
          {t('stats.loading')}
        </span>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !stats) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <p className="text-sm text-slate-500 dark:text-zinc-500">
          {t('stats.error')}
        </p>
      </div>
    );
  }

  const maxMonth = Math.max(1, ...stats.monthly_trend.map((m) => m.predictions));
  const maxDisease = Math.max(1, ...stats.top_diseases.map((d) => d.count));

  const summaryCards = [
    {
      label: t('stats.summary.total'),
      value: stats.total_predictions,
      Icon: Activity,
      accent: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400',
    },
    {
      label: t('stats.summary.this_month'),
      value: stats.predictions_this_month,
      Icon: Calendar,
      accent: 'text-info-600 bg-info-50 dark:bg-info-500/10 dark:text-info-400',
    },
    {
      label: t('stats.summary.last_30'),
      value: stats.predictions_last_30_days,
      Icon: TrendingUp,
      accent: 'text-success-600 bg-success-50 dark:bg-success-500/10 dark:text-success-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        <div className="mx-auto max-w-5xl">
          {/* Back link */}
          <Link
            to="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors hover:text-primary-600 dark:text-zinc-500 dark:hover:text-primary-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t('stats.back')}
          </Link>

          {/* Heading */}
          <div className="mb-10 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 dark:bg-zinc-950 dark:text-primary-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {t('stats.eyebrow')}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
                {t('stats.title')}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-zinc-400">
                {t('stats.subtitle')}
              </p>
            </div>
          </div>

          {/* Empty state */}
          {stats.total_predictions === 0 ? (
            <div className="border border-dashed border-slate-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <BarChart3 className="mx-auto h-10 w-10 text-slate-300 dark:text-zinc-700" />
              <p className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {t('stats.empty.title')}
              </p>
              <p className="mx-auto mt-1 max-w-md px-4 text-sm text-slate-600 dark:text-zinc-400">
                {t('stats.empty.desc')}
              </p>
              <Link
                to="/predict"
                className="mt-6 inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md"
              >
                {t('stats.empty.cta')}
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary cards */}
              <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    {t('stats.summary.label')}
                  </p>
                </div>
                <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-zinc-800">
                  {summaryCards.map(({ label, value, Icon, accent }) => (
                    <div key={label} className="p-6 sm:p-8">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                          {label}
                        </span>
                        <div className={cn('flex h-9 w-9 items-center justify-center', accent)}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-zinc-100">
                        {value.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Monthly activity */}
              {stats.monthly_trend.length > 0 && (
                <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      {t('stats.monthly.label')}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                      {t('stats.monthly.title')}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                      {t('stats.monthly.subtitle')} · {t('stats.monthly.max', { max: maxMonth })}
                    </p>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* Chart */}
                    <div className="flex h-56 items-end justify-around gap-4 border-b border-slate-200 dark:border-zinc-800">
                      {stats.monthly_trend.map((m) => {
                        const heightPct = Math.max(4, (m.predictions / maxMonth) * 100);
                        return (
                          <div
                            key={m.month}
                            className="group flex h-full flex-col items-center justify-end gap-2"
                            style={{ minWidth: '48px', maxWidth: '80px', width: '100%' }}
                          >
                            <span className="text-xs font-bold tabular-nums text-slate-600 dark:text-zinc-400">
                              {m.predictions}
                            </span>
                            <div
                              className="w-full bg-primary-500 transition-colors group-hover:bg-primary-600"
                              style={{ height: `${heightPct}%` }}
                              title={t('stats.monthly.tooltip', {
                                month: m.month,
                                count: m.predictions,
                              })}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Month labels */}
                    <div className="mt-2 flex justify-around gap-4">
                      {stats.monthly_trend.map((m) => (
                        <div
                          key={m.month}
                          className="text-center"
                          style={{ minWidth: '48px', maxWidth: '80px', width: '100%' }}
                        >
                          <span className="font-mono text-xs text-slate-500 dark:text-zinc-500">
                            {m.month.slice(5)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* Top conditions */}
              {stats.top_diseases.length > 0 && (
                <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                      {t('stats.top.label')}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                      {t('stats.top.title')}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                      {t('stats.top.subtitle')}
                    </p>
                  </div>

                  <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {stats.top_diseases.map(({ disease, count }, i) => (
                      <li
                        key={disease}
                        className="flex items-center gap-4 px-6 py-4 sm:px-8"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-slate-200 font-mono text-xs font-bold text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-4">
                            <span className="truncate text-sm font-semibold capitalize text-slate-800 dark:text-zinc-200">
                              {translateDisease(disease, i18n.language)}
                            </span>
                            <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                              {t('stats.top.count', { count })}
                            </span>
                          </div>
                          <div className="mt-2 h-1 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                            <div
                              className="h-full bg-primary-500 transition-all duration-700"
                              style={{ width: `${(count / maxDisease) * 100}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}