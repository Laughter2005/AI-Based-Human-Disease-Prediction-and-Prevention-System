import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Brain,
  Smartphone,
  Languages,
  ShieldCheck,
  PhoneCall,
  Stethoscope,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Home() {
  const { t } = useTranslation();

  const features = [
    { Icon: Brain, key: 'ai' },
    { Icon: Smartphone, key: 'channels' },
    { Icon: Languages, key: 'language' },
    { Icon: ShieldCheck, key: 'privacy' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="container-app py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>{t('home.hero.trust_line')}</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-zinc-100 text-balance">
              {t('home.hero.title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-600 dark:text-zinc-400">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/predict">
                <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  {t('home.hero.cta_primary')}
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg">
                  {t('home.hero.cta_secondary')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero visual — inline SVG illustration */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-100 via-primary-50 to-transparent blur-3xl dark:from-primary-900/30 dark:via-transparent" />
            <svg viewBox="0 0 400 400" className="h-full w-full max-w-md" fill="none">
              <circle cx="200" cy="200" r="180" fill="url(#heroGradient)" opacity="0.15" />
              <circle cx="200" cy="200" r="130" fill="url(#heroGradient)" opacity="0.25" />
              <circle cx="200" cy="200" r="80" fill="url(#heroGradient)" opacity="0.5" />
              <g transform="translate(200 200)">
                <rect x="-20" y="-20" width="40" height="40" rx="6" fill="#F97316" />
                <path d="M-15 0h6l3-8 5 16 4-12 3 4h9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              <defs>
                <radialGradient id="heroGradient">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="100%" stopColor="#EA580C" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-16 dark:bg-zinc-900/50">
        <div className="container-app">
          <h2 className="text-center font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
            {t('home.features.title')}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ Icon, key }) => (
              <Card key={key} interactive className="animate-fade-in">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {t(`home.features.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
                  {t(`home.features.${key}.desc`)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases covered */}
      <section className="container-app py-16">
        <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-primary-50 p-8 sm:p-12 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
          <h2 className="text-center font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-zinc-100">
            {t('home.diseases.title')}
          </h2>
          <p className="mt-3 text-center text-slate-600 dark:text-zinc-400">
            {t('home.diseases.subtitle')}
          </p>
        </div>
      </section>

      {/* USSD CTA */}
      <section className="container-app pb-16">
        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded bg-white/20 backdrop-blur">
                <PhoneCall className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold sm:text-3xl">
                {t('home.ussd_cta.title')}
              </h2>
              <p className="mt-3 max-w-md text-primary-50">
                {t('home.ussd_cta.desc')}
              </p>
            </div>
            <div className="rounded border border-white/20 bg-white/10 p-6 backdrop-blur sm:p-8">
              <p className="text-sm font-medium uppercase tracking-wider text-primary-100">
                {t('home.ussd_cta.code_label')}
              </p>
              <p className="mt-2 font-mono text-4xl font-bold tracking-wider sm:text-5xl">
                *XXX#
              </p>
              <p className="mt-3 text-sm text-primary-50">
                Works on any phone — no internet needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-app pb-20 text-center">
        <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
          {t('home.final_cta.title')}
        </h2>
        <p className="mt-3 text-slate-600 dark:text-zinc-400">
          {t('home.final_cta.desc')}
        </p>
        <Link to="/predict" className="mt-6 inline-block">
          <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
            {t('home.final_cta.button')}
          </Button>
        </Link>
      </section>
    </div>
  );
}