import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, LayoutDashboard, Settings, LogOut, Shield, BarChart3} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

function initials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join('');
}

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const dashboardPath = user.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded border border-slate-200 bg-white p-1 pr-2.5 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.full_name || user.email}
            className="h-8 w-8 rounded object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary-500 text-sm font-bold text-white">
            {initials(user.full_name, user.email)}
          </div>
        )}
        <ChevronDown className="h-4 w-4 text-slate-500 dark:text-zinc-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded border border-slate-200 bg-white shadow-lifted dark:border-zinc-800 dark:bg-zinc-900 animate-fade-in"
        >
          <div className="border-b border-slate-200 p-3 dark:border-zinc-800">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
              {user.full_name || user.email}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-zinc-500">
              {user.email}
            </p>
            <span
              className={cn(
                'mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold',
                user.role === 'admin'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
              )}
            >
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </span>
          </div>

          <div className="p-1">
            <Link
              to={dashboardPath}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {user.role === 'admin' ? (
                <Shield className="h-4 w-4" />
              ) : (
                <LayoutDashboard className="h-4 w-4" />
              )}
              {user.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
            </Link>

            <Link
              to="/stats"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <BarChart3 className="h-4 w-4" />
              My statistics
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Settings className="h-4 w-4" />
              Account settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10"
            >
              <LogOut className="h-4 w-4" />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}