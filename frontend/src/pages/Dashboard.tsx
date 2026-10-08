import { useEffect, useState } from 'react';
import { translateDisease } from '../utils/diseaseNames';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  ArrowRight,
  BarChart3,
  History as HistoryIcon,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { predictionService, type HistoryItem } from '../services/predictionService';
import { cn } from '../utils/cn';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthStore();
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const items = await predictionService.history(3);
        setRecent(items.slice(0, 3));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const firstName = (user?.full_name || user?.email || 'there').split(/[\s@.]+/)[0];

  const quickActions = [
    {
      Icon: Sparkles,
      title: t('dashboard.quick_actions.new_check_title'),
      desc: t('dashboard.quick_actions.new_check_desc'),
      cta: t('dashboard.quick_actions.new_check_cta'),
      to: '/predict',
      accent: 'text-primary-600 bg-primary-50 dark:bg-primary-900/30 dark:text-primary-400',
      ctaColor: 'text-primary-600 dark:text-primary-400',
    },
    {
      Icon: HistoryIcon,
      title: t('dashboard.quick_actions.history_title'),
      desc: t('dashboard.quick_actions.history_desc'),
      cta: t('dashboard.quick_actions.history_cta'),
      to: '/history',
      accent: 'text-info-600 bg-info-50 dark:bg-info-500/10 dark:text-info-400',
      ctaColor: 'text-info-600 dark:text-info-400',
    },
    {
      Icon: BarChart3,
      title: t('dashboard.quick_actions.stats_title'),
      desc: t('dashboard.quick_actions.stats_desc'),
      cta: t('dashboard.quick_actions.stats_cta'),
      to: '/stats',
      accent: 'text-success-600 bg-success-50 dark:bg-success-500/10 dark:text-success-400',
      ctaColor: 'text-success-600 dark:text-success-400',
    },
    {
      Icon: Settings,
      title: t('dashboard.quick_actions.settings_title'),
      desc: t('dashboard.quick_actions.settings_desc'),
      cta: t('dashboard.quick_actions.settings_cta'),
      to: '/settings',
      accent: 'text-slate-600 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-400',
      ctaColor: 'text-slate-600 dark:text-zinc-400',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        {/* Greeting */}
        <div className="mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('nav.dashboard')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('dashboard.greeting', { name: firstName })}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            {t('dashboard.subtitle')}
          </p>
        </div>

        {/* Welcome banner for users with no history */}
        {!loading && recent.length === 0 && (
          <div className="mb-8 flex flex-col items-start gap-4 border-l-4 border-primary-600 border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {t('dashboard.welcome_banner.title')}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                  {t('dashboard.welcome_banner.body')}
                </p>
              </div>
            </div>
            <Link
              to="/predict"
              className="group inline-flex shrink-0 items-center gap-2 bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md"
            >
              {t('dashboard.welcome_banner.cta')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Quick actions */}
        <div className="mb-12">
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {t('dashboard.quick_actions.label')}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                {t('dashboard.quick_actions.title')}
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map(({ Icon, title, desc, cta, to, accent, ctaColor }) => (
              <Link
                key={title}
                to={to}
                className="group flex h-full flex-col border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700"
              >
                <div className={cn('flex h-11 w-11 items-center justify-center transition-transform duration-300 group-hover:scale-105', accent)}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-slate-900 dark:text-zinc-100">
                  {title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {desc}
                </p>
                <div className={cn('mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider', ctaColor)}>
                  {cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {t('dashboard.recent.label')}
              </p>
              <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                {t('dashboard.recent.title')}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                {t('dashboard.recent.subtitle')}
              </p>
            </div>
            {recent.length > 0 && (
              <Link
                to="/history"
                className="hidden text-xs font-bold uppercase tracking-wider text-primary-600 hover:underline sm:inline-block dark:text-primary-400"
              >
                {t('dashboard.recent.view_all')}
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center border border-slate-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
              <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
                {t('dashboard.recent.loading')}
              </span>
            </div>
          ) : recent.length === 0 ? (
            <div className="border border-dashed border-slate-300 bg-white py-16 text-center dark:border-zinc-700 dark:bg-zinc-950">
              <Search className="mx-auto h-8 w-8 text-slate-300 dark:text-zinc-700" />
              <p className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {t('dashboard.recent.empty_title')}
              </p>
              <p className="mt-1 max-w-md mx-auto px-4 text-sm text-slate-600 dark:text-zinc-400">
                {t('dashboard.recent.empty_desc')}
              </p>
              <Link
                to="/predict"
                className="mt-5 inline-flex items-center gap-2 bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md"
              >
                {t('dashboard.recent.empty_cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
                {recent.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold capitalize text-slate-900 dark:text-zinc-100">
                          {translateDisease(item.top_disease, i18n.language)}
                        </p>
                        <p className="truncate text-xs text-slate-500 dark:text-zinc-500">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-bold tabular-nums text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300">
                      {(item.top_confidence * 100).toFixed(0)}%
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}