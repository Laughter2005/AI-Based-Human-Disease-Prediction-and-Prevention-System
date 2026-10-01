import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="animate-fade-in">
        <p className="font-display text-8xl font-bold text-primary-500">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-zinc-100">
          {t('not_found.title')}
        </h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-zinc-400">
          {t('not_found.desc')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button variant="gradient" leftIcon={<HomeIcon className="h-4 w-4" />}>
              {t('not_found.cta')}
            </Button>
          </Link>
          <Link to="/predict">
            <Button variant="secondary" leftIcon={<Search className="h-4 w-4" />}>
              {t('nav.predict')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}