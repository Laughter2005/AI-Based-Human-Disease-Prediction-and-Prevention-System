import { Activity, AlertTriangle } from 'lucide-react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { useTranslation } from 'react-i18next';
import type { PredictionResult } from '../../types/prediction.types';
import { cn } from '../../utils/cn';

interface ResultCardProps {
  result: PredictionResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { t } = useTranslation();
  const { predictedDisease } = result;
  const pct = predictedDisease.confidence * 100;

  const accent =
    predictedDisease.severity === 'high'
      ? 'border-l-danger-500'
      : predictedDisease.severity === 'moderate'
      ? 'border-l-warning-500'
      : 'border-l-info-500';

  const barColor =
    predictedDisease.severity === 'high'
      ? 'bg-danger-500'
      : predictedDisease.severity === 'moderate'
      ? 'bg-warning-500'
      : 'bg-info-500';

  const confidenceLabel = t(
    predictedDisease.confidence >= 0.75
      ? 'result.confidence_high'
      : predictedDisease.confidence >= 0.45
      ? 'result.confidence_moderate'
      : 'result.confidence_low'
  );

  return (
    <div
      className={cn(
        'animate-slide-up border border-slate-200 border-l-4 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
        accent
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('result.label')}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400 dark:text-zinc-600">
            {t('result.title')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold capitalize leading-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {predictedDisease.name}
          </h2>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center border-2 border-primary-600 bg-primary-50 text-primary-600 dark:border-primary-500 dark:bg-primary-950 dark:text-primary-400">
          <Activity className="h-6 w-6" />
        </div>
      </div>

      {/* Confidence block */}
      <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              {t('result.confidence')}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
              {confidenceLabel}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-zinc-100">
              {pct.toFixed(1)}
              <span className="text-xl text-slate-400 dark:text-zinc-600">%</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
          <div
            className={cn('h-full transition-all duration-1000 ease-out', barColor)}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Severity inline */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            {t('result.severity_label')}:
          </span>
          <SeverityBadge
            severity={predictedDisease.severity}
            label={t(`result.severity_${predictedDisease.severity}`)}
          />
        </div>
      </div>

      {/* High severity warning */}
      {predictedDisease.severity === 'high' && (
        <div className="flex items-start gap-3 border-l-4 border-l-danger-500 bg-danger-50 p-5 dark:bg-danger-500/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400" />
          <p className="text-sm font-medium text-danger-800 dark:text-danger-300">
            {t('result.severity_high_warning')}
          </p>
        </div>
      )}
    </div>
  );
}