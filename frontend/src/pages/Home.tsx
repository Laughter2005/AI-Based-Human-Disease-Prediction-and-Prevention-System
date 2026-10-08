import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { translateDisease } from '../utils/diseaseNames';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Brain,
  Smartphone,
  Languages,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Activity,
  Users,
  Globe,
  Stethoscope,
  ClipboardList,
  TrendingUp,
  Phone,
  Quote,
  ChevronDown,
  Plus,
  Minus,
  Star,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { statsService, type PublicStats } from '../services/statsService';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../utils/cn';

import heroImage from '../assets/hero-image.jpg';
const HERO_IMAGE_URL = heroImage;

const MALAWI_DISEASE_IDS = [
  'Malaria',
  'Typhoid',
  'Tuberculosis',
  'Dengue',
  'Hepatitis A',
  'Hepatitis B',
  'Hepatitis C',
  'Hepatitis D',
  'Hepatitis E',
  'Gastroenteritis',
  'Pneumonia',
  'Hypothyroidism',
  'Hypertension',
  'Diabetes',
  'Cholera'
];

export function Home() {
  return (
    <div className="bg-white dark:bg-zinc-950">
      <HeroSection />
      <TrustBar />
      <StatsSection />
      <HowItWorksSection />
      <DiseasesSection />
      <USSDSection />
      <CTABand />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}

/* ============================================================
   SECTION SPACING SCALE (consistent rhythm)
   - Outer section padding: py-20 lg:py-28
   - Inner heading block: max-w-2xl mx-auto
   - Below heading to content: mt-14 lg:mt-16
   ============================================================ */

/* ============================================
   1. HERO
   ============================================ */
function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-950">
      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            `linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container-app relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        {/* Left: copy */}
        <div className="order-2 lg:order-1">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border-l-4 border-primary-600 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
            <Stethoscope className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
            <span>{t('home.hero.eyebrow')}</span>
          </div>

          {/* Headline — smaller on mobile, larger on desktop */}
          <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl dark:text-zinc-100">
            {t('home.hero.title_line1')}{' '}
            <span className="text-primary-600 dark:text-primary-400">
              {t('home.hero.title_line2')}
            </span>{' '}
            {t('home.hero.title_line3')}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-zinc-400">
            {t('home.hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/predict">
              <Button
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                rightIcon={<ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />}
              >
                {t('home.hero.cta_primary')}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                {t('home.hero.cta_secondary')}
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-5 dark:border-zinc-800">
            {[
              t('home.hero.trust_free'),
              t('home.hero.trust_no_app'),
              t('home.hero.trust_private'),
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300"
              >
                <CheckCircle2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image */}
        <div className="relative order-1 lg:order-2">
          <div className="relative border-4 border-white bg-white shadow-xl dark:border-zinc-900 dark:bg-zinc-900">
            <img
              src={HERO_IMAGE_URL}
              alt={t('home.hero.image_alt')}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 border-l-4 border-primary-600 bg-white px-2.5 py-1.5 text-xs font-semibold shadow-md dark:bg-zinc-900">
              <Activity className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
              <span className="text-slate-800 dark:text-zinc-200">
              {t('home.hero.image_badge')}
            </span>
            </div>
          </div>

          <div className="absolute -right-3 -top-3 hidden h-16 w-16 border-4 border-primary-600 bg-transparent lg:block" aria-hidden="true" />
          <div className="absolute -bottom-3 -left-3 hidden h-12 w-12 border-4 border-slate-900 bg-transparent lg:block dark:border-zinc-100" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

/* ============================================
   2. TRUST BAR
   ============================================ */
function TrustBar() {
  const { t } = useTranslation();

  const items = [
    { Icon: Smartphone, label: t('home.hero.trust_no_app') },
    { Icon: Languages, label: 'English · Chichewa' },
    { Icon: ShieldCheck, label: t('home.hero.trust_private') },
    { Icon: TrendingUp, label: 'Model accuracy 97%' },
  ];

  return (
    <section className="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-app flex flex-wrap items-center justify-center gap-x-12 gap-y-4 py-6">
        {items.map(({ Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400"
          >
            <Icon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============================================
   3. STATS
   ============================================ */
function StatsSection() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    (async () => {
      try {
        const data = await statsService.public();
        setStats(data);
      } catch {
        setStats({
          total_users: 0,
          total_predictions: 0,
          diseases_detected: 0,
          supported_languages: 2,
        });
      }
    })();
  }, []);

  const users = useCountUp(stats?.total_users ?? 0, 1400);
  const predictions = useCountUp(stats?.total_predictions ?? 0, 1600);
  const diseases = useCountUp(stats?.diseases_detected ?? 0, 1200);

  const items = [
    { value: users, label: t('home.stats.users'), Icon: Users },
    { value: predictions, label: t('home.stats.predictions'), Icon: Activity },
    { value: diseases, label: t('home.stats.diseases'), Icon: Stethoscope },
    { value: stats?.supported_languages ?? 2, label: t('home.stats.languages'), Icon: Globe },
  ];

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28"
    >
      <div className="container-app">
        <p className="mb-10 text-center text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {t('home.stats.label')}
        </p>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map(({ value, label, Icon }, i) => (
            <div
              key={label}
              className={cn(
                'group relative border border-slate-200 bg-white p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center border border-primary-200 bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:border-primary-800 dark:bg-primary-950 dark:text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
                {value.toLocaleString()}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   4. HOW IT WORKS
   ============================================ */
function HowItWorksSection() {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const steps = [
    { Icon: ClipboardList, title: t('home.how.step1_title'), desc: t('home.how.step1_desc') },
    { Icon: Brain, title: t('home.how.step2_title'), desc: t('home.how.step2_desc') },
    { Icon: ShieldCheck, title: t('home.how.step3_title'), desc: t('home.how.step3_desc') },
  ];

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('home.how.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('home.how.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
            {t('home.how.subtitle')}
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16">
          {steps.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className={cn(
                'group relative border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Step number watermark */}
              <span className="absolute right-6 top-6 font-mono text-4xl font-bold text-slate-100 transition-colors group-hover:text-primary-100 dark:text-zinc-800 dark:group-hover:text-primary-950">
                0{i + 1}
              </span>

              <div className="flex h-12 w-12 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-zinc-950 dark:text-primary-400">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="mt-6 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link to="/predict">
            <Button
              size="lg"
              className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              rightIcon={<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
            >
              {t('home.how.cta')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   5. DISEASES
   ============================================ */
function DiseasesSection() {
  const { t, i18n } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('home.diseases.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('home.diseases.title')}
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
            {t('home.diseases.subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-16 lg:grid-cols-4">
          {MALAWI_DISEASE_IDS.map((id, i) => (
            <div
              key={id}
              className={cn(
                'group flex items-center gap-3 border border-slate-200 bg-white px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-600',
                visible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className="h-2 w-2 bg-primary-500 transition-transform duration-300 group-hover:scale-150" />
              <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                {translateDisease(id, i18n.language)}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm italic text-slate-500 dark:text-zinc-500">
          {t('home.diseases.note')}
        </p>
      </div>
    </section>
  );
}

/* ============================================
   6. USSD
   ============================================ */
function USSDSection() {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28"
    >
      <div className="container-app grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={cn('transition-all duration-700', visible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0')}>
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('home.ussd.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('home.ussd.title')}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
            {t('home.ussd.subtitle')}
          </p>

          <div className="mt-8 border-l-4 border-primary-600 bg-slate-50 p-5 transition-colors hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              {t('home.ussd.dial_label')}
            </p>
            <p className="mt-2 font-mono text-4xl font-bold tracking-wider text-slate-900 dark:text-zinc-100">
              {t('home.ussd.code')}
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {[t('home.ussd.feature1'), t('home.ussd.feature2'), t('home.ussd.feature3')].map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn('flex justify-center transition-all duration-700', visible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0')}>
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative">
      <div className="relative w-[270px] border-[10px] border-slate-900 bg-slate-100 transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="bg-white p-3 pt-6 dark:bg-zinc-950">
          <div className="border-b border-slate-200 pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
            Malawi Health AI
          </div>
          <div className="mt-3 font-mono text-xs leading-relaxed text-slate-800 dark:text-zinc-200">
            <p className="font-bold">Select language:</p>
            <p className="mt-1">1. English</p>
            <p>2. Chichewa</p>
            <div className="my-3 border-t border-dashed border-slate-300 dark:border-zinc-700" />
            <p className="font-bold">Choose symptom:</p>
            <p className="mt-1">1. Fever</p>
            <p>2. Headache</p>
            <p>3. Cough</p>
            <p>4. Vomiting</p>
            <p className="text-slate-500 dark:text-zinc-500">5. More...</p>
          </div>
          <div className="mt-3 border-t border-dashed border-slate-300 pt-2 text-center text-[10px] text-slate-500 dark:border-zinc-700 dark:text-zinc-500">
            Reply with number
          </div>
        </div>
        <div className="grid grid-cols-3 gap-px border-t border-slate-200 bg-slate-200 font-mono text-sm font-semibold dark:border-zinc-800 dark:bg-zinc-800">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <div key={k} className="bg-white py-2.5 text-center text-slate-800 dark:bg-zinc-950 dark:text-zinc-200">
              {k}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-slate-900/10 blur-md" />
    </div>
  );
}

/* ============================================
   6b. CTA BAND (between USSD and Features)
   ============================================ */
function CTABand() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-slate-200 bg-primary-600 dark:border-zinc-800">
      <div className="container-app flex flex-col items-center justify-between gap-6 py-12 sm:flex-row">
        <div>
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {t('home.cta_band.title')}
          </h3>
          <p className="mt-1.5 text-primary-50">
            {t('home.cta_band.subtitle')}
          </p>
        </div>
        <Link to="/predict">
          <button className="group inline-flex items-center gap-2 bg-white px-7 py-4 text-base font-bold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            {t('home.cta_band.button')}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </section>
  );
}

/* ============================================
   7. FEATURES
   ============================================ */
function FeaturesSection() {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const features = [
    { Icon: Brain, title: t('home.features.ai_title'), desc: t('home.features.ai_desc') },
    { Icon: Smartphone, title: t('home.features.channels_title'), desc: t('home.features.channels_desc') },
    { Icon: Languages, title: t('home.features.language_title'), desc: t('home.features.language_desc') },
    { Icon: ShieldCheck, title: t('home.features.security_title'), desc: t('home.features.security_desc') },
  ];

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('home.features.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('home.features.title')}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16">
          {features.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className={cn(
                'group border border-slate-200 bg-white p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700',
                visible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 transition-all duration-300 group-hover:bg-primary-600 group-hover:text-white dark:bg-zinc-950 dark:text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   8. TESTIMONIALS
   ============================================ */
function TestimonialsSection() {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const testimonials = [
    { quote: t('home.testimonials.quote1'), name: t('home.testimonials.quote1_name'), role: t('home.testimonials.quote1_role') },
    { quote: t('home.testimonials.quote2'), name: t('home.testimonials.quote2_name'), role: t('home.testimonials.quote2_role') },
    { quote: t('home.testimonials.quote3'), name: t('home.testimonials.quote3_name'), role: t('home.testimonials.quote3_role') },
  ];

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28"
    >
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('home.testimonials.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('home.testimonials.title')}
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16">
          {testimonials.map((item, i) => (
            <div
              key={item.name}
              className={cn(
                'group relative flex flex-col border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Quote icon */}
              <Quote className="absolute right-6 top-6 h-8 w-8 text-slate-100 transition-colors group-hover:text-primary-100 dark:text-zinc-800 dark:group-hover:text-primary-950" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-primary-500 text-primary-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-5 flex-1 text-sm leading-relaxed text-slate-700 dark:text-zinc-300">
                "{item.quote}"
              </p>

              {/* Author */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-zinc-800">
                <p className="font-semibold text-slate-900 dark:text-zinc-100">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   9. FAQ
   ============================================ */
function FAQSection() {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t('home.faq.q1'), a: t('home.faq.a1') },
    { q: t('home.faq.q2'), a: t('home.faq.a2') },
    { q: t('home.faq.q3'), a: t('home.faq.a3') },
    { q: t('home.faq.q4'), a: t('home.faq.a4') },
    { q: t('home.faq.q5'), a: t('home.faq.a5') },
    { q: t('home.faq.q6'), a: t('home.faq.a6') },
  ];

  return (
    <section
      ref={ref}
      className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28"
    >
      <div className="container-app">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('home.faq.label')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('home.faq.title')}
            </h2>
          </div>

          <div className="mt-12 space-y-3 lg:mt-14">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={faq.q}
                  className={cn(
                    'border bg-white transition-all duration-300 dark:bg-zinc-950',
                    isOpen
                      ? 'border-primary-300 shadow-md dark:border-primary-700'
                      : 'border-slate-200 hover:border-primary-200 dark:border-zinc-800 dark:hover:border-primary-800',
                    visible ? 'opacity-100' : 'opacity-0'
                  )}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base font-bold text-slate-900 dark:text-zinc-100">
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center border transition-all duration-300',
                        isOpen
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-slate-300 bg-white text-slate-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                      )}
                    >
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-out',
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    )}
                  >
                    <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   10. FINAL CTA
   ============================================ */
function FinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 text-white dark:bg-zinc-900 lg:py-28">
      {/* Malawi flag accent bar */}
      <div className="absolute left-0 right-0 top-0 h-1"
        style={{
          background:
            'linear-gradient(90deg, #000000 0% 33.33%, #CE1126 33.33% 66.66%, #339E35 66.66% 100%)',
        }}
      />

      <div className="container-app text-center">
        <div className="mx-auto max-w-3xl">
          <Phone className="mx-auto h-8 w-8 text-primary-400" />
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t('home.final_cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            {t('home.final_cta.subtitle')}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/predict">
              <Button
                size="lg"
                className="group bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-lg"
                rightIcon={<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
              >
                {t('home.final_cta.cta')}
              </Button>
            </Link>
            <a href="tel:*XXX#">
              <button className="inline-flex items-center gap-2 border-2 border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10">
                <PhoneCall className="h-5 w-5" />
                {t('home.final_cta.cta_ussd')}
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}