import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SYMPTOMS } from '../utils/constants';
import { predictionService } from '../services/predictionService';
import { Button } from '../components/common/Button';
import type { PredictionResult } from '../types/prediction.types';

export function Predict() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one symptom');
      return;
    }
    setLoading(true);
    try {
      const res = await predictionService.predict({
        symptoms: selected,
        language: i18n.language === 'ny' ? 'ny' : 'en',
      });
      setResult(res);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return <ResultsView result={result} onReset={() => { setResult(null); setSelected([]); }} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">{t('symptom.title')}</h1>
      <p className="mt-1 text-gray-600">{t('symptom.subtitle')}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SYMPTOMS.map((s) => {
          const isSelected = selected.includes(s.id);
          const label = i18n.language === 'ny' ? s.nameNy : s.name;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-900">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="secondary" onClick={() => navigate('/')}>
          {t('symptom.back')}
        </Button>
        <Button onClick={handleSubmit} loading={loading} disabled={selected.length === 0}>
          {t('symptom.submit')} ({selected.length})
        </Button>
      </div>
    </div>
  );
}

function ResultsView({ result, onReset }: { result: PredictionResult; onReset: () => void }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ny' ? 'Ny' : '';
  const disease = result.predictedDisease;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="card">
        <p className="text-sm font-medium text-gray-500">{t('result.title')}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          {lang === 'Ny' ? disease.nameNy : disease.name}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-gray-600">{t('result.confidence')}:</span>
          <span className="font-semibold text-primary-700">
            {(disease.confidence * 100).toFixed(1)}%
          </span>
        </div>
        <span
          className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            disease.severity === 'high'
              ? 'bg-red-100 text-red-700'
              : disease.severity === 'moderate'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {disease.severity.toUpperCase()}
        </span>
        <p className="mt-4 text-gray-700">{disease.description}</p>
      </div>

      {result.alternativeDiseases.length > 0 && (
        <div className="card mt-4">
          <h2 className="font-semibold text-gray-900">{t('result.alternatives')}</h2>
          <ul className="mt-3 space-y-2">
            {result.alternativeDiseases.map((alt) => (
              <li key={alt.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {lang === 'Ny' ? alt.nameNy : alt.name}
                </span>
                <span className="text-gray-500">
                  {(alt.confidence * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card mt-4">
        <h2 className="font-semibold text-gray-900">{t('result.prevention')}</h2>
        <ul className="mt-3 space-y-3">
          {result.prevention.map((p) => (
            <li key={p.id}>
              <p className="font-medium text-gray-900">
                {lang === 'Ny' ? p.titleNy : p.title}
              </p>
              <p className="text-sm text-gray-600">
                {lang === 'Ny' ? p.descriptionNy : p.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        ⚠️ {t('result.disclaimer')}
      </div>

      <div className="mt-6 flex justify-center">
        <Button onClick={onReset}>{t('result.new_check')}</Button>
      </div>
    </div>
  );
}