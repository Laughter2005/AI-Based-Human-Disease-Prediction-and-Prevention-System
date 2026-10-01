import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Phone, AlertTriangle } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container-app grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary-500 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              {t('app.name')}
            </span>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
            {t('app.tagline')}
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
            {t('footer.quick_links')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/" className="text-slate-600 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/predict" className="text-slate-600 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400">
                {t('nav.predict')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-slate-600 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400">
                {t('nav.about')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
            {t('footer.contact')}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-slate-600 dark:text-zinc-400">
              <Phone className="h-4 w-4" />
              <span>+265 1 XXX XXXX</span>
            </li>
            <li className="flex items-start gap-2 text-slate-600 dark:text-zinc-400">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning-500" />
              <span>{t('footer.disclaimer')}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-zinc-800">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-6 text-sm text-slate-500 sm:flex-row dark:text-zinc-500">
          <p>© {year} {t('app.name')}. {t('footer.rights')}</p>
          <p>{t('footer.ministry')}</p>
        </div>
      </div>
    </footer>
  );
}