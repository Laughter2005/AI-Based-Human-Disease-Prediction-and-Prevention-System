import { useEffect } from 'react';
import { translateDisease } from '../utils/diseaseNames';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Phone,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ResultCard } from '../components/prediction/ResultCard';
import { useAuthStore } from '../store/authStore';
import type { PredictionResult } from '../types/prediction.types';
import { cn } from '../utils/cn';

export function Result() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const result = (location.state as { result?: PredictionResult } | null)?.result;

  useEffect(() => {
    if (!result) {
      navigate('/predict', { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  const maxAltConfidence = Math.max(
    ...result.alternativeDiseases.map((a) => a.confidence),
    0.01
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link to="/predict">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                {t('predict.buttons.back')}
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-500">
              <Lock className="h-3 w-3" />
              <span>
                {t('result.model_label')}: {result.model}
              </span>
            </div>
          </div>

          {/* Hero result card */}
          <ResultCard result={result} />

          {/* Alternatives */}
          {result.alternativeDiseases.length > 0 && (
            <Section
              label={t('result.alt_label')}
              title={t('result.alt_title')}
              subtitle={t('result.alt_subtitle')}
            >
              <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
                {result.alternativeDiseases.map((alt, i) => (
                  <li
                    key={alt.disease}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-slate-200 font-mono text-xs font-bold text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                        {i + 2}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold ...">
                          {translateDisease(alt.disease, i18n.language)}
                        </p>
                        <div className="mt-1.5 h-1 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                          <div
                            className="h-full bg-slate-400 transition-all duration-700 dark:bg-zinc-600"
                            style={{
                              width: `${(alt.confidence / maxAltConfidence) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-slate-700 dark:text-zinc-300">
                      {(alt.confidence * 100).toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Prevention */}
          {result.prevention.map((item, i) => {
  const lang: 'en' | 'ny' = i18n.language === 'ny' ? 'ny' : 'en';
  return (
    <li
      key={item.id}
      className="group flex gap-4 border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-primary-600 font-mono text-xs font-bold text-white">
        {i + 1}
      </span>
      <div>
        <p className="font-semibold text-slate-900 dark:text-zinc-100">
          {item.title[lang]}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
          {item.description[lang]}
        </p>
      </div>
    </li>
  );
})}

          {/* Unknown symptoms */}
          {result.unknownSymptoms.length > 0 && (
            <div className="flex items-start gap-3 border border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400" />
              <div>
                <p className="font-semibold text-warning-900 dark:text-warning-300">
                  {t('result.unknown_title')}
                </p>
                <p className="mt-1 text-sm text-warning-800 dark:text-warning-400">
                  {t('result.unknown_desc')}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.unknownSymptoms.map((s) => (
                    <span
                      key={s}
                      className="border border-warning-300 bg-white px-2 py-0.5 text-xs font-medium text-warning-800 dark:border-warning-500/40 dark:bg-warning-950/40 dark:text-warning-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="border-l-4 border-l-amber-500 border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:border-l-amber-500 dark:bg-amber-500/10">
            <div className="flex items-start gap-3">
              <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-300">
                  {t('result.disclaimer_title')}
                </p>
                <p className="mt-1 text-sm text-amber-900/90 dark:text-amber-300/90">
                  {t('result.disclaimer')}
                </p>
              </div>
            </div>
          </div>

          {/* Anonymous nudge */}
          {!user && (
            <div className="animate-fade-in border border-primary-200 bg-primary-50 p-5 dark:border-primary-500/30 dark:bg-primary-500/10">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-600 text-white">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary-900 dark:text-primary-200">
                      {t('result.signin_nudge_title')}
                    </p>
                    <p className="mt-1 text-sm text-primary-800 dark:text-primary-300">
                      {t('result.signin_nudge_desc')}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link to="/register">
                    <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                      {t('result.signin_nudge_cta')}
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="secondary" size="sm">
                      {t('result.signin_nudge_login')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <Section
            label={t('result.actions')}
            title={t('result.actions_desc')}
            noPadding
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <Link to="/predict" className="block">
                <button className="group flex h-full w-full flex-col items-center justify-center gap-2 border border-slate-200 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700">
                  <RefreshCw className="h-5 w-5 text-primary-600 transition-transform duration-300 group-hover:rotate-180 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                    {t('result.new_check')}
                  </span>
                </button>
              </Link>

              <a href="tel:+265983327425" className="block">
                <button className="group flex h-full w-full flex-col items-center justify-center gap-2 border border-slate-200 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-info-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-info-700">
                  <Phone className="h-5 w-5 text-info-600 dark:text-info-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                    {t('result.call_helpline')}
                  </span>
                </button>
              </a>

              <Link to="/" className="block">
                <button className="group flex h-full w-full flex-col items-center justify-center gap-2 border border-slate-200 bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-600">
                  <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-zinc-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
                    {t('result.back_home')}
                  </span>
                </button>
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Reusable section wrapper — sharp, medical
   ============================================ */
function Section({
  label,
  title,
  subtitle,
  icon,
  children,
  noPadding,
}: {
  label: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <section className="animate-fade-in border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-primary-600 dark:text-primary-400">{icon}</span>
          )}
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {label}
          </p>
        </div>
        <h2 className="mt-2 font-display text-xl font-bold text-slate-900 sm:text-2xl dark:text-zinc-100">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
      <div className={noPadding ? '' : 'p-6 sm:p-8'}>{children}</div>
    </section>
  );
}