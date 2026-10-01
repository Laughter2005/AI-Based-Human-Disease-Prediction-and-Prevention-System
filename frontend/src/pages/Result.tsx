import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowLeft, RefreshCw, ShieldCheck, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ResultCard } from '../components/prediction/ResultCard';
import { Badge } from '../components/ui/Badge';
import type { PredictionResult } from '../types/prediction.types';

export function Result() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const result = (location.state as { result?: PredictionResult } | null)?.result;

  // If someone lands here directly without a result, send them to predict
  useEffect(() => {
    if (!result) {
      navigate('/predict', { replace: true });
    }
  }, [result, navigate]);

  if (!result) return null;

  return (
    <div className="container-app py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/predict">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              {t('predict.buttons.back')}
            </Button>
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            Model: {result.model}
          </span>
        </div>

        {/* Top prediction */}
        <ResultCard result={result} />

        {/* Alternatives */}
        {result.alternativeDiseases.length > 0 && (
          <Card className="animate-fade-in">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              {t('result.alt_title')}
            </h3>
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-zinc-800">
              {result.alternativeDiseases.map((alt) => (
                <li key={alt.disease} className="flex items-center justify-between py-3">
                  <span className="font-medium capitalize text-slate-800 dark:text-zinc-200">
                    {alt.disease}
                  </span>
                  <Badge variant="default" size="sm">
                    {(alt.confidence * 100).toFixed(1)}%
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Prevention */}
        {result.prevention.length > 0 && (
          <Card className="animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {t('result.prevention_title')}
              </h3>
            </div>
            <ul className="mt-5 space-y-4">
              {result.prevention.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-zinc-100">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Unknown symptoms warning */}
        {result.unknownSymptoms.length > 0 && (
          <Card className="border-warning-200 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/10">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-600 dark:text-warning-400" />
              <div>
                <p className="font-semibold text-warning-900 dark:text-warning-300">
                  Some symptoms were not recognized
                </p>
                <p className="mt-1 text-sm text-warning-800 dark:text-warning-400">
                  {result.unknownSymptoms.join(', ')}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <Stethoscope className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-900 dark:text-amber-300">
            {t('result.disclaimer')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Link to="/predict">
            <Button variant="gradient" leftIcon={<RefreshCw className="h-4 w-4" />}>
              {t('result.new_check')}
            </Button>
          </Link>
          <a href="tel:+2651000000">
            <Button variant="secondary" leftIcon={<AlertTriangle className="h-4 w-4" />}>
              {t('result.call_helpline')}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}