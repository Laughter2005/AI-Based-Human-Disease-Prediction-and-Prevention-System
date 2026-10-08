import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translateSymptom } from '../utils/symptomNames';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Check,
  User as UserIcon,
  Clock,
} from 'lucide-react';
import { SymptomGrid } from '../components/prediction/SymptomGrid';
import { Button } from '../components/ui/Button';
import { usePrediction } from '../hooks/usePrediction';
import api from '../services/api';
import { cn } from '../utils/cn';
import i18n from '../utils/i18n';

const DURATIONS = ['less_1', '1_3', '4_7', 'more_1w'] as const;
const GENDERS = ['male', 'female', 'other'] as const;

export function Predict() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { predict, loading } = usePrediction();

  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

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

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const clearAll = () => setSelected([]);

  const handleNext = () => {
    if (step === 1 && selected.length === 0) {
      toast.error(t('predict.step1.no_selection_warning'));
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error(t('predict.step1.no_selection_warning'));
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

  const stepTitles = [
    t('predict.step_titles.symptoms'),
    t('predict.step_titles.details'),
    t('predict.step_titles.review'),
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        <div className="mx-auto max-w-3xl">
          {/* Page heading */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('predict.step_label', { current: step, total: 3 })}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-zinc-100">
              {stepTitles[step - 1]}
            </h1>
          </div>

          {/* Progress */}
          <WizardProgress current={step} total={3} labels={stepTitles} />

          {/* Step card */}
          <div className="mt-8 border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Card header */}
            <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
                {t(`predict.step${step}.title`)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                {t(`predict.step${step}.subtitle`)}
              </p>
            </div>

            {/* Card body */}
            <div className="p-6 sm:p-8">
              {step === 1 && (
                <SymptomGrid
                  symptoms={allSymptoms}
                  selected={selected}
                  onToggle={toggle}
                  onClear={clearAll}
                  loading={loadingSymptoms}
                />
              )}

              {step === 2 && (
                <Step2Form
                  age={age}
                  setAge={setAge}
                  gender={gender}
                  setGender={setGender}
                  duration={duration}
                  setDuration={setDuration}
                />
              )}

              {step === 3 && (
                <Step3Review
                  selected={selected}
                  age={age}
                  gender={gender}
                  duration={duration}
                />
              )}
            </div>

            {/* Card footer — actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                {step > 1 && (
                  <Button
                    variant="secondary"
                    onClick={handleBack}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                  >
                    {t('predict.buttons.back')}
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {step < 3 ? (
                  <Button
                    onClick={handleNext}
                    disabled={step === 1 && selected.length === 0}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    className="w-full sm:w-auto"
                  >
                    {t('predict.buttons.next')}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    loading={loading}
                    leftIcon={!loading && <Sparkles className="h-4 w-4" />}
                    className="w-full bg-primary-600 hover:bg-primary-700 sm:w-auto"
                  >
                    {loading ? t('predict.buttons.loading') : t('predict.buttons.submit')}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-center text-xs italic text-slate-500 dark:text-zinc-500">
            {t('predict.disclaimer_short')}
          </p>
        </div>
      </div>

      {/* Sticky mobile action bar (only on step 1 to keep Next always reachable) */}
      {step === 1 && selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white p-3 shadow-lg sm:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('predict.step1.selected_count', { count: selected.length })}
            </span>
            <Button
              onClick={handleNext}
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {t('predict.buttons.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================
   Wizard progress indicator
   ============================================ */
function WizardProgress({
  current,
  total,
  labels,
}: {
  current: number;
  total: number;
  labels: string[];
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isDone = step < current;
        const isActive = step === current;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold transition-all',
                  isDone || isActive
                    ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
                    : 'border-slate-300 bg-white text-slate-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500'
                )}
              >
                {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : step}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-semibold uppercase tracking-wider sm:inline',
                  isActive
                    ? 'text-primary-700 dark:text-primary-300'
                    : isDone
                    ? 'text-slate-700 dark:text-zinc-300'
                    : 'text-slate-400 dark:text-zinc-600'
                )}
              >
                {labels[i]}
              </span>
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  'h-px flex-1 transition-colors',
                  isDone ? 'bg-primary-600 dark:bg-primary-500' : 'bg-slate-200 dark:bg-zinc-800'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================
   Step 2: Details form
   ============================================ */
function Step2Form({
  age,
  setAge,
  gender,
  setGender,
  duration,
  setDuration,
}: {
  age: string;
  setAge: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Age */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          {t('predict.step2.age')}
          <span className="ml-2 text-xs font-normal uppercase tracking-wider text-slate-400 dark:text-zinc-600">
            {t('predict.step2.optional')}
          </span>
        </label>
        <input
          type="number"
          min={0}
          max={120}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="input"
          placeholder={t('predict.step2.age_placeholder')}
        />
        <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-500">
          {t('predict.step2.age_hint')}
        </p>
      </div>

      {/* Gender */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          {t('predict.step2.gender')}
          <span className="ml-2 text-xs font-normal uppercase tracking-wider text-slate-400 dark:text-zinc-600">
            {t('predict.step2.optional')}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(gender === g ? '' : g)}
              className={cn(
                'border px-3 py-3 text-sm font-medium transition-all duration-200',
                gender === g
                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/40 dark:text-primary-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-primary-700'
              )}
            >
              {t(`predict.step2.gender_${g}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-zinc-300">
          {t('predict.step2.duration')}
          <span className="ml-2 text-xs font-normal uppercase tracking-wider text-slate-400 dark:text-zinc-600">
            {t('predict.step2.optional')}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(duration === d ? '' : d)}
              className={cn(
                'border px-3 py-3 text-sm font-medium transition-all duration-200',
                duration === d
                  ? 'border-primary-600 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-950/40 dark:text-primary-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-primary-700'
              )}
            >
              {t(`predict.step2.duration_${d}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================
   Step 3: Review
   ============================================ */
function Step3Review({
  selected,
  age,
  gender,
  duration,
}: {
  selected: string[];
  age: string;
  gender: string;
  duration: string;
}) {
  const { t } = useTranslation();

  const hasDetails = !!age || !!gender || !!duration;

  return (
    <div className="space-y-6">
      {/* Symptoms */}
      <div className="border border-slate-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            {t('predict.step3.symptoms_selected')}
          </h3>
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
            {selected.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 p-4">
          {selected.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-zinc-500">
              {t('predict.step3.no_symptoms')}
            </p>
          ) : (
            selected.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 border border-primary-200 bg-primary-50 px-2.5 py-1 text-xs font-medium capitalize text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300"
              >
                {translateSymptom(s, i18n.language)}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Details */}
      <div className="border border-slate-200 dark:border-zinc-800">
        <div className="border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
            {t('predict.step3.details_section')}
          </h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-zinc-800">
          <ReviewRow
            icon={<UserIcon className="h-4 w-4" />}
            label={t('predict.step3.age_label')}
            value={age || t('predict.step3.not_provided')}
            provided={!!age}
          />
          <ReviewRow
            icon={<UserIcon className="h-4 w-4" />}
            label={t('predict.step3.gender_label')}
            value={gender ? t(`predict.step2.gender_${gender}`) : t('predict.step3.not_provided')}
            provided={!!gender}
          />
          <ReviewRow
            icon={<Clock className="h-4 w-4" />}
            label={t('predict.step3.duration_label')}
            value={duration ? t(`predict.step2.duration_${duration}`) : t('predict.step3.not_provided')}
            provided={!!duration}
          />
        </div>
      </div>

      {!hasDetails && (
        <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-900 dark:text-amber-300">
            No additional details provided. The prediction will still work, but adding age, gender, or symptom duration improves accuracy.
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewRow({
  icon,
  label,
  value,
  provided,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  provided: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-zinc-400">
        <span className="text-slate-400 dark:text-zinc-600">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span
        className={cn(
          'text-sm',
          provided
            ? 'font-semibold text-slate-900 dark:text-zinc-100'
            : 'italic text-slate-400 dark:text-zinc-600'
        )}
      >
        {value}
      </span>
    </div>
  );
}