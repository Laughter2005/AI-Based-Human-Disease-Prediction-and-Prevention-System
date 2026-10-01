import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { WizardSteps } from '../components/prediction/WizardSteps';
import { SymptomGrid } from '../components/prediction/SymptomGrid';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { predictionService } from '../services/predictionService';
import { usePrediction } from '../hooks/usePrediction';
import api from '../services/api';

const DURATIONS = ['less_1', '1_3', '4_7', 'more_1w'] as const;

export function Predict() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { predict, loading } = usePrediction();

  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [duration, setDuration] = useState<string>('');
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  // Load symptoms from backend on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get('/predictions/symptoms');
        if (!cancelled) setAllSymptoms(data.symptoms ?? []);
      } catch {
        if (!cancelled) toast.error('Could not load symptoms. Is the backend running?');
      } finally {
        if (!cancelled) setLoadingSymptoms(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
    const result = await predict({
      symptoms: selected,
      top_k: 5,
      language: i18n.language === 'ny' ? 'ny' : 'en',
    });
    if (result) {
      navigate('/result', { state: { result } });
    }
  };

  const stepLabels = ['Symptoms', 'Details', 'Review'];

  return (
    <div className="container-app py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('predict.step_label', { current: step, total: 3 })}
          </p>
        </div>

        <WizardSteps current={step} total={3} labels={stepLabels} />

        <Card className="animate-fade-in">
          {/* STEP 1 — Symptoms */}
          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-zinc-100">
                {t('predict.step1.title')}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-zinc-400">
                {t('predict.step1.subtitle')}
              </p>

              <div className="mt-6">
                <SymptomGrid
                  symptoms={allSymptoms}
                  selected={selected}
                  onToggle={toggle}
                  loading={loadingSymptoms}
                />
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-zinc-500">
                  {selected.length} selected
                </span>
                <Button
                  onClick={() => setStep(2)}
                  disabled={selected.length === 0}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {t('predict.buttons.next')}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 — Details */}
          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-zinc-100">
                {t('predict.step2.title')}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-zinc-400">
                {t('predict.step2.subtitle')}
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {t('predict.step2.age')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input"
                    placeholder="e.g. 25"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {t('predict.step2.gender')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: 'male', l: t('predict.step2.gender_male') },
                      { v: 'female', l: t('predict.step2.gender_female') },
                      { v: 'other', l: t('predict.step2.gender_other') },
                    ].map(({ v, l }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setGender(v)}
                        className={`rounded border px-3 py-2.5 text-sm font-medium transition-colors ${
                          gender === v
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-zinc-300">
                    {t('predict.step2.duration')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`rounded border px-3 py-2.5 text-sm font-medium transition-colors ${
                          duration === d
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {t(`predict.step2.duration_${d}`)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setStep(1)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  {t('predict.buttons.back')}
                </Button>
                <Button onClick={() => setStep(3)} rightIcon={<ArrowRight className="h-4 w-4" />}>
                  {t('predict.buttons.next')}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-zinc-100">
                {t('predict.step3.title')}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-zinc-400">
                {t('predict.step3.subtitle')}
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                    {t('predict.step3.symptoms_selected')}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-zinc-500">
                        {t('predict.step3.no_symptoms')}
                      </p>
                    ) : (
                      selected.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium capitalize text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        >
                          {s.replace(/_/g, ' ')}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {(age || gender || duration) && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                      Details
                    </h3>
                    <dl className="mt-3 space-y-1 text-sm text-slate-700 dark:text-zinc-300">
                      {age && <div><dt className="inline font-medium">Age: </dt><dd className="inline">{age}</dd></div>}
                      {gender && <div><dt className="inline font-medium">Gender: </dt><dd className="inline capitalize">{gender}</dd></div>}
                      {duration && <div><dt className="inline font-medium">Duration: </dt><dd className="inline">{t(`predict.step2.duration_${duration}`)}</dd></div>}
                    </dl>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => setStep(2)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  {t('predict.buttons.back')}
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  loading={loading}
                  leftIcon={!loading && <Sparkles className="h-4 w-4" />}
                >
                  {loading ? t('predict.buttons.loading') : t('predict.buttons.submit')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}