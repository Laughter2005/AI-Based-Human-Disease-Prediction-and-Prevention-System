import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { statsService, type PublicStats } from '../services/statsService';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../utils/cn';

// Hero image — replace with your own by changing this path
// Option A: local file → import heroImg from '../assets/hero-image.jpg';
// Option B: remote URL → keep as string
import heroImage from '../assets/hero-image.jpg';
const HERO_IMAGE_URL = heroImage;

// The 11 Malawi-priority diseases
const MALAWI_DISEASES = [
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
      <FeaturesSection />
      <FinalCTASection />
    </div>
  );
}

/* ============================================
   1. HERO — clean, clinical, split layout
   ============================================ */
function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-app grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        {/* Left: copy */}
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 border-l-4 border-primary-500 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
            <Stethoscope className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
            <span>{t('home.hero.eyebrow')}</span>
          </div>

          {/* Headline */}
          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-zinc-100">
            {t('home.hero.title_line1')}
            <br />
            <span className="text-primary-600 dark:text-primary-400">
              {t('home.hero.title_line2')}
            </span>
            <br />
            {t('home.hero.title_line3')}
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
            {t('home.hero.subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/predict">
              <Button
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 shadow-sm"
                rightIcon={<ArrowRight className="h-5 w-5" />}
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
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 dark:border-zinc-800">
            {[
              t('home.hero.trust_free'),
              t('home.hero.trust_no_app'),
              t('home.hero.trust_private'),
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300">
                <CheckCircle2 className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: image with medical framing */}
        <div className="relative">
          {/* Sharp border frame */}
          <div className="relative border-4 border-white bg-white shadow-xl dark:border-zinc-900 dark:bg-zinc-900">
            <img
              src={HERO_IMAGE_URL}
              alt={t('home.hero.image_alt')}
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
            />
            {/* Overlay badge — bottom-left */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 border-l-4 border-primary-500 bg-white px-3 py-2 text-xs font-semibold shadow-md dark:bg-zinc-900">
              <Activity className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <span className="text-slate-800 dark:text-zinc-200">Real-time AI inference</span>
            </div>
          </div>

          {/* Small accent square top-right */}
          <div className="absolute -right-3 -top-3 h-16 w-16 border-4 border-primary-500 bg-transparent" aria-hidden="true" />

          {/* Small accent square bottom-left */}
          <div className="absolute -bottom-3 -left-3 h-12 w-12 border-4 border-slate-900 bg-transparent dark:border-zinc-100" aria-hidden="true" />
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
      <div className="container-app flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-5">
        {items.map(({ Icon, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400">
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
    <section ref={ref} className="border-b border-slate-200 bg-slate-50 py-14 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="container-app">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
          {t('home.stats.label')}
        </p>

        <div className="grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 dark:border-zinc-800 dark:bg-zinc-800 lg:grid-cols-4">
          {items.map(({ value, label, Icon }, i) => (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center bg-white px-4 py-8 text-center transition-all duration-700 dark:bg-zinc-950',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <p className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
                {value.toLocaleString()}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-500">
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
    {
      Icon: ClipboardList,
      title: t('home.how.step1_title'),
      desc: t('home.how.step1_desc'),
    },
    {
      Icon: Brain,
      title: t('home.how.step2_title'),
      desc: t('home.how.step2_desc'),
    },
    {
      Icon: ShieldCheck,
      title: t('home.how.step3_title'),
      desc: t('home.how.step3_desc'),
    },
  ];

  return (
    <section ref={ref} className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
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

        <div className="mt-16 grid gap-px border border-slate-200 bg-slate-200 dark:border-zinc-800 dark:bg-zinc-800 md:grid-cols-3">
          {steps.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className={cn(
                'relative bg-white p-8 transition-all duration-700 dark:bg-zinc-950',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 dark:bg-zinc-950 dark:text-primary-400">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-4xl font-bold text-slate-200 dark:text-zinc-800">
                  0{i + 1}
                </span>
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

        <div className="mt-12 text-center">
          <Link to="/predict">
            <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
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
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40">
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

        <div className="mt-12 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-800">
          {MALAWI_DISEASES.map((name, i) => (
            <div
              key={name}
              className={cn(
                'flex items-center gap-3 bg-white p-4 transition-all duration-500 dark:bg-zinc-950',
                visible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <div className="flex h-2 w-2 items-center justify-center bg-primary-500" />
              <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                {name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm italic text-slate-500 dark:text-zinc-500">
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
    <section ref={ref} className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-app grid items-center gap-12 lg:grid-cols-2">
        {/* Left: content */}
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

          {/* Dial box */}
          <div className="mt-8 border-l-4 border-primary-600 bg-slate-50 p-5 dark:bg-zinc-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              {t('home.ussd.dial_label')}
            </p>
            <p className="mt-2 font-mono text-4xl font-bold tracking-wider text-slate-900 dark:text-zinc-100">
              {t('home.ussd.code')}
            </p>
          </div>

          <ul className="mt-6 space-y-2.5">
            {[
              t('home.ussd.feature1'),
              t('home.ussd.feature2'),
              t('home.ussd.feature3'),
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: phone mockup */}
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
      <div className="relative w-[270px] border-[10px] border-slate-900 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="bg-white p-3 pt-6 dark:bg-zinc-950">
          {/* Screen header */}
          <div className="border-b border-slate-200 pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
            Malawi Health AI
          </div>

          {/* USSD content */}
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

          {/* Footer */}
          <div className="mt-3 border-t border-dashed border-slate-300 pt-2 text-center text-[10px] text-slate-500 dark:border-zinc-700 dark:text-zinc-500">
            Reply with number
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-px border-t border-slate-200 bg-slate-200 font-mono text-sm font-semibold dark:border-zinc-800 dark:bg-zinc-800">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <div key={k} className="bg-white py-2.5 text-center text-slate-800 dark:bg-zinc-950 dark:text-zinc-200">
              {k}
            </div>
          ))}
        </div>
      </div>

      {/* Shadow */}
      <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-slate-900/10 blur-md" />
    </div>
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
    <section ref={ref} className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="container-app">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('home.features.label')}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('home.features.title')}
          </h2>
        </div>

        <div className="mt-12 grid gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-800">
          {features.map(({ Icon, title, desc }, i) => (
            <div
              key={title}
              className={cn(
                'bg-white p-8 transition-all duration-700 dark:bg-zinc-950',
                visible ? 'opacity-100' : 'opacity-0'
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 dark:bg-zinc-950 dark:text-primary-400">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
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
   8. FINAL CTA
   ============================================ */
function FinalCTASection() {
  const { t } = useTranslation();

  return (
    <section className="bg-slate-900 py-20 text-white dark:bg-zinc-900">
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
                className="bg-primary-600 hover:bg-primary-700"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                {t('home.final_cta.cta')}
              </Button>
            </Link>
            <a href="tel:*XXX#">
              <button className="inline-flex items-center gap-2 border-2 border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10">
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