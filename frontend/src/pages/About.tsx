import { useTranslation } from 'react-i18next';
import { Activity, Users, Cpu, BookOpen, MapPin } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function About() {
  const { t } = useTranslation();

  const cards = [
    { Icon: Users, title: t('about.mission_title'), body: t('about.mission') },
    { Icon: Cpu, title: t('about.tech_title'), body: t('about.tech_body') },
  ];

  return (
    <div className="container-app py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded bg-primary-500 text-white">
            <Activity className="h-7 w-7" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold text-slate-900 dark:text-zinc-100">
            {t('about.title')}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
            {t('about.intro')}
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {cards.map(({ Icon, title, body }) => (
            <Card key={title} className="animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                    {title}
                  </h3>
                  <p className="mt-2 text-slate-600 dark:text-zinc-400">{body}</p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="border-l-4 border-l-primary-500">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {t('about.team_title')}
                </h3>
                <p className="mt-2 text-slate-600 dark:text-zinc-400">
                  Academic project developed as part of a Computer Science program, focused on
                  accessible health technology for Malawi.
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-zinc-500">
                  <MapPin className="h-4 w-4" />
                  <span>Malawi</span>
                </div>
              </div>
            </div>
          </Card>

          <p className="text-center text-sm text-slate-500 dark:text-zinc-500">
            {t('about.disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}