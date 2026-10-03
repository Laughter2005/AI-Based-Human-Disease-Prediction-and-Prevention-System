import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  Phone,
  AlertTriangle,
  Mail,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export function Footer() {
  const { t } = useTranslation();
  const { token, user } = useAuthStore();
  const isAuthed = !!token && !!user;

  const year = new Date().getFullYear();
  const appName = t('app.name');

  const quickLinks = isAuthed
    ? [
        { to: '/', label: t('footer.link_home') },
        { to: '/predict', label: t('footer.link_predict') },
        { to: '/about', label: t('footer.link_about') },
      ]
    : [
        { to: '/', label: t('footer.link_home') },
        { to: '/predict', label: t('footer.link_predict') },
        { to: '/about', label: t('footer.link_about') },
        { to: '/login', label: t('footer.link_login') },
        { to: '/register', label: t('footer.link_register') },
      ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Malawi flag accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background:
            'linear-gradient(90deg, #000000 0% 33.33%, #CE1126 33.33% 66.66%, #339E35 66.66% 100%)',
        }}
      />

      {/* Main footer content */}
      <div className="container-app grid gap-10 py-12 lg:grid-cols-4 lg:gap-8">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center bg-primary-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {appName}
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {t('footer.about_body')}
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-500">
            <MapPin className="h-3.5 w-3.5" />
            <span>{t('footer.flag_alt')}</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
            {t('footer.quick_links')}
          </h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {quickLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-slate-600 transition-colors hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
            {t('footer.contact_title')}
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  {t('footer.contact_helpline')}
                </p>
                <a
                  href={`tel:${t('footer.contact_helpline_number').replace(/\s/g, '')}`}
                  className="text-slate-700 transition-colors hover:text-primary-600 dark:text-zinc-300 dark:hover:text-primary-400"
                >
                  {t('footer.contact_helpline_number')}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  {t('footer.contact_ministry')}
                </p>
                <span className="text-slate-700 dark:text-zinc-300">
                  <a
                    href={t('footer.contact_ministry_value')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    {t('footer.contact_ministry_value')}
                  </a>
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
            {t('footer.disclaimer_title')}
          </h4>
          <div className="mt-5 flex items-start gap-3 border-l-4 border-amber-500 border-y border-r border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-300">
              {t('footer.disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200 dark:border-zinc-800">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <p className="text-slate-500 dark:text-zinc-500">
            {t('footer.copyright', { year, app: appName })}
          </p>
          <p className="flex items-center gap-2 text-slate-500 dark:text-zinc-500">
            <Mail className="h-3.5 w-3.5" />
            <span>{t('footer.built_by')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}