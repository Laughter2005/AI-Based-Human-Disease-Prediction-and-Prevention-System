import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BookOpen,
  ClipboardList,
  Brain,
  ShieldCheck,
  Smartphone,
  Users,
  MapPin,
  GraduationCap,
  Calendar,
  Mail,
  AlertTriangle,
  Code2,
  Database,
  Server,
  Layers,
} from 'lucide-react';

export function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="container-app py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 dark:bg-zinc-950 dark:text-primary-400">
              <Activity className="h-6 w-6" />
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('about.eyebrow')}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-zinc-100">
              {t('about.title')}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
              {t('about.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28">
        <div className="container-app">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('about.mission.label')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('about.mission.title')}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
              {t('about.mission.body')}
            </p>

            {/* Stat strip */}
            <div className="mt-10 grid grid-cols-3 gap-px border border-slate-200 bg-slate-200 dark:border-zinc-800 dark:bg-zinc-800">
              {[
                { value: t('about.mission.stat1_value'), label: t('about.mission.stat1_label') },
                { value: t('about.mission.stat2_value'), label: t('about.mission.stat2_label') },
                { value: t('about.mission.stat3_value'), label: t('about.mission.stat3_label') },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="bg-white px-4 py-6 text-center dark:bg-zinc-950"
                >
                  <p className="font-display text-3xl font-bold tracking-tight text-primary-600 dark:text-primary-400">
                    {value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How the system works */}
      <section className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('about.how.label')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('about.how.title')}
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:mt-16">
            {[
              { Icon: ClipboardList, title: t('about.how.step1_title'), desc: t('about.how.step1_desc') },
              { Icon: Brain, title: t('about.how.step2_title'), desc: t('about.how.step2_desc') },
              { Icon: ShieldCheck, title: t('about.how.step3_title'), desc: t('about.how.step3_desc') },
              { Icon: Smartphone, title: t('about.how.step4_title'), desc: t('about.how.step4_desc') },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="group flex gap-5 border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary-600 bg-white text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-zinc-950 dark:text-primary-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('about.tech.label')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('about.tech.title')}
            </h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-px border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:mt-16 dark:border-zinc-800 dark:bg-zinc-800">
            {[
              { Icon: Layers, label: t('about.tech.frontend'), value: t('about.tech.frontend_detail') },
              { Icon: Server, label: t('about.tech.backend'), value: t('about.tech.backend_detail') },
              { Icon: Code2, label: t('about.tech.ml'), value: t('about.tech.ml_detail') },
              { Icon: Database, label: t('about.tech.database'), value: t('about.tech.database_detail') },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                className="bg-white p-6 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:hover:bg-zinc-900"
              >
                <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-zinc-200">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Contact */}
      <section className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28">
        <div className="container-app">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('about.contact.label')}
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
              {t('about.contact.title')}
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
              {t('about.contact.body')}
            </p>

            <a
              href="mailto:isaacmandah3@gmail.com"
              className="mt-8 inline-flex items-center gap-2 border-2 border-primary-600 bg-white px-6 py-3.5 text-base font-semibold text-primary-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white dark:bg-zinc-950 dark:text-primary-400 dark:hover:bg-primary-600 dark:hover:text-white"
            >
              <Mail className="h-5 w-5" />
              {t('about.contact.email')}
            </a>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-slate-900 py-16 text-white dark:bg-zinc-900">
        <div className="container-app">
          <div className="mx-auto flex max-w-3xl items-start gap-4 border-l-4 border-l-amber-500 pl-6">
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
            <div>
              <h3 className="font-display text-xl font-bold">
                {t('about.disclaimer.title')}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {t('about.disclaimer.body')}
              </p>
              <Link
                to="/predict"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-300"
              >
                {t('home.hero.cta_primary')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}