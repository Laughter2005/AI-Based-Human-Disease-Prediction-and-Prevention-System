import { Activity, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { SeverityBadge } from '../ui/SeverityBadge';
import type { PredictionResult } from '../../types/prediction.types';
import { useTranslation } from 'react-i18next';

interface ResultCardProps {
  result: PredictionResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const { t } = useTranslation();
  const { predictedDisease } = result;
  const pct = (predictedDisease.confidence * 100).toFixed(1);

  return (
    <Card className="animate-slide-up border-l-4 border-l-primary-500" padded>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            {t('result.title')}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold capitalize text-slate-900 dark:text-zinc-100">
            {predictedDisease.name}
          </h2>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          <Activity className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SeverityBadge severity={predictedDisease.severity} />
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm text-slate-600 dark:text-zinc-400">
            {t('result.confidence')}:
          </span>
          <span className="font-display text-lg font-bold text-primary-600 dark:text-primary-400">
            {pct}%
          </span>
        </div>
      </div>

      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      {predictedDisease.severity === 'high' && (
        <div className="mt-5 flex items-start gap-3 rounded border border-danger-200 bg-danger-50 p-4 dark:border-danger-500/30 dark:bg-danger-500/10">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600 dark:text-danger-400" />
          <p className="text-sm text-danger-800 dark:text-danger-300">
            Symptoms suggest a serious condition. Please seek medical care promptly.
          </p>
        </div>
      )}
    </Card>
  );
}