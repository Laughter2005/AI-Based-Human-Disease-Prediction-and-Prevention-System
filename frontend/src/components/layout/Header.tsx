import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary-600" />
          <span className="text-lg font-bold text-gray-900">{t('app.name')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={linkClass} end>{t('nav.home')}</NavLink>
          <NavLink to="/predict" className={linkClass}>{t('nav.predict')}</NavLink>
          <NavLink to="/history" className={linkClass}>{t('nav.history')}</NavLink>
          <NavLink to="/about" className={linkClass}>{t('nav.about')}</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/login" className="btn-primary text-sm">{t('nav.login')}</Link>
        </div>
      </div>
    </header>
  );
}