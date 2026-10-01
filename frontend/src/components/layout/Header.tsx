import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/cn';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'rounded px-3 py-2 text-sm font-medium transition-colors',
      isActive
        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
        : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
    );

  const navLinks = (
    <>
      <NavLink to="/" className={linkClass} end onClick={() => setOpen(false)}>
        {t('nav.home')}
      </NavLink>
      <NavLink to="/predict" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.predict')}
      </NavLink>
      <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
        {t('nav.about')}
      </NavLink>
    </>
  );

  return (
    <header className="border-b border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flag-bar" />
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-primary-500 text-white">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            {t('app.name')}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">{navLinks}</nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 md:hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <div className="container-app flex flex-col gap-1 py-3">
            {navLinks}
            <div className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-3 dark:border-zinc-800">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}