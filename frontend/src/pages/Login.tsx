import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { LogIn, Shield, User as UserIcon } from 'lucide-react';
import { TextInput } from '../components/ui/TextInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { AuthSidebar } from '../components/auth/AuthSidebar';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import type { UserRole } from '../types/user.types';
import { cn } from '../utils/cn';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [role, setRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const from = (location.state as { from?: string } | null)?.from;

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = t('auth.login.error_email_required');
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t('auth.login.error_email_invalid');
    if (!password) e.password = t('auth.login.error_password_required');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login({ email, password, role });
      setAuth(res.access_token, res.user);
      toast.success(
        t('auth.login.welcome_back', {
          name: res.user.full_name || res.user.email,
        })
      );
      const dest = from || (res.user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : t('auth.login.error_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center bg-white px-4 py-12 dark:bg-zinc-950 sm:px-8">
        <div className="w-full max-w-md">
          {/* Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('auth.login.eyebrow')}
          </p>

          {/* Heading */}
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('auth.login.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {t('auth.login.subtitle')}
          </p>

          {/* Role selector */}
          <div className="mt-8">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
              {t('auth.login.role_label')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: 'user' as const, label: t('auth.login.role_user'), Icon: UserIcon },
                  { value: 'admin' as const, label: t('auth.login.role_admin'), Icon: Shield },
                ]
              ).map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={cn(
                    'flex items-center justify-center gap-2 border px-3 py-3 text-sm font-semibold transition-all duration-200',
                    role === value
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm dark:border-primary-500 dark:bg-primary-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-primary-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <TextInput
              label={t('auth.login.email')}
              type="email"
              autoComplete="email"
              placeholder={t('auth.login.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <PasswordInput
              label={t('auth.login.password')}
              autoComplete="current-password"
              placeholder={t('auth.login.password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400"
              >
                {t('auth.login.forgot')}
              </Link>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-primary-600 hover:bg-primary-700"
              leftIcon={!loading && <LogIn className="h-4 w-4" />}
            >
              {loading ? t('auth.login.submitting') : t('auth.login.submit')}
            </Button>
          </form>

          {/* Bottom link */}
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-zinc-400">
            {t('auth.login.no_account')}{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('auth.login.create_account')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right: sidebar */}
      <AuthSidebar />
    </div>
  );
}