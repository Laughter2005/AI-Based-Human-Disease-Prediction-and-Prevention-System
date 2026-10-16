import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Info,
  Route,
  ListChecks,
  Hospital,
  AlertTriangle,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { infoService, type DiseaseInfo } from '../../services/infoService';
import { cn } from '../../utils/cn';

interface DiseaseInfoCardProps {
  diseaseName: string;
}

export function DiseaseInfoCard({ diseaseName }: DiseaseInfoCardProps) {
  const { t, i18n } = useTranslation();
  const [info, setInfo] = useState<DiseaseInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('about');

  const lang: 'en' | 'ny' = i18n.language === 'ny' ? 'ny' : 'en';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    (async () => {
      try {
        const data = await infoService.getDiseaseInfo(diseaseName);
        if (!cancelled) setInfo(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [diseaseName]);

  if (loading) {
    return (
      <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
            {t('result.info.loading')}
          </span>
        </div>
      </section>
    );
  }

  if (error || !info) {
    return null;  // silently hide if unavailable
  }

  const sections = [
    {
      key: 'about',
      label: t('result.info.about'),
      Icon: Info,
      content: (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
          {info.description[lang]}
        </p>
      ),
    },
    {
      key: 'transmission',
      label: t('result.info.transmission'),
      Icon: Route,
      content: (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
          {info.transmission[lang]}
        </p>
      ),
    },
    {
      key: 'symptoms',
      label: t('result.info.symptoms'),
      Icon: ListChecks,
      content: (
        <ul className="space-y-2">
          {info.typical_symptoms[lang].map((s) => (
            <li
              key={s}
              className="flex items-start gap-2 text-sm text-slate-700 dark:text-zinc-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary-500" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'care',
      label: t('result.info.when_to_seek'),
      Icon: Hospital,
      content: (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
          {info.when_to_seek_care[lang]}
        </p>
      ),
    },
    {
      key: 'complications',
      label: t('result.info.complications'),
      Icon: AlertTriangle,
      content: (
        <p className="text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
          {info.complications[lang]}
        </p>
      ),
    },
  ];

  return (
    <section className="animate-fade-in border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('result.info.label')}
          </p>
        </div>
        <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
          {t('result.info.title', { disease: info.name[lang] })}
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          {t('result.info.subtitle')}
        </p>
      </div>

      {/* Accordion sections */}
      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
        {sections.map(({ key, label, Icon, content }) => {
          const isOpen = openSection === key;
          return (
            <div key={key}>
              <button
                onClick={() => setOpenSection(isOpen ? null : key)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors sm:px-8',
                  isOpen
                    ? 'bg-slate-50 dark:bg-zinc-900/50'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-900/50'
                )}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {label}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>

              {isOpen && (
                <div className="animate-fade-in border-t border-slate-100 px-6 pb-6 pt-4 sm:px-8 dark:border-zinc-800">
                  {content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}