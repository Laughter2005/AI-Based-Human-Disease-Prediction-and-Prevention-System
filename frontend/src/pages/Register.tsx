import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { UserPlus, Check } from 'lucide-react';
import { TextInput } from '../components/ui/TextInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { AuthSidebar } from '../components/auth/AuthSidebar';
import { authService } from '../services/authService';
import { cn } from '../utils/cn';

function scorePassword(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const score = useMemo(() => scorePassword(password), [password]);
  const strengthLabel = t(
    ['auth.register.strength_weak', 'auth.register.strength_fair', 'auth.register.strength_good', 'auth.register.strength_strong'][
      Math.max(0, score - 1)
    ]
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = t('auth.register.error_name_required');
    if (!email) e.email = t('auth.register.error_email_required');
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t('auth.register.error_email_invalid');
    if (!password) e.password = t('auth.register.error_password_required');
    else if (password.length < 8) e.password = t('auth.register.error_password_short');
    if (password !== confirm) e.confirm = t('auth.register.error_password_mismatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authService.register({
        email,
        password,
        full_name: fullName,
        preferred_language: 'en',
      });
      toast.success(t('auth.register.success'));
      navigate('/login');
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Registration failed');
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
            {t('auth.register.eyebrow')}
          </p>

          {/* Heading */}
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('auth.register.title')}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
            {t('auth.register.subtitle')}
          </p>

          {/* Form */}
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <TextInput
              label={t('auth.register.name')}
              autoComplete="name"
              placeholder={t('auth.register.name_placeholder')}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
            />

            <TextInput
              label={t('auth.register.email')}
              type="email"
              autoComplete="email"
              placeholder={t('auth.register.email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <div>
              <PasswordInput
                label={t('auth.register.password')}
                autoComplete="new-password"
                placeholder={t('auth.register.password_placeholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 transition-colors',
                          i < score
                            ? score === 1
                              ? 'bg-danger-500'
                              : score === 2
                              ? 'bg-warning-500'
                              : score === 3
                              ? 'bg-info-500'
                              : 'bg-success-500'
                            : 'bg-slate-200 dark:bg-zinc-800'
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-500">
                    {t('auth.register.strength_label')}:{' '}
                    <span className="font-semibold">{strengthLabel}</span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <PasswordInput
                label={t('auth.register.confirm')}
                autoComplete="new-password"
                placeholder={t('auth.register.confirm_placeholder')}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={errors.confirm}
              />
              {confirm && password === confirm && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success-600 dark:text-success-500">
                  <Check className="h-3.5 w-3.5" />
                  {t('auth.register.matches')}
                </div>
              )}
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-primary-600 hover:bg-primary-700"
              leftIcon={!loading && <UserPlus className="h-4 w-4" />}
            >
              {loading ? t('auth.register.submitting') : t('auth.register.submit')}
            </Button>

            <p className="text-center text-xs text-slate-500 dark:text-zinc-500">
              {t('auth.register.terms_note')}
            </p>
          </form>

          {/* Bottom link */}
          <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
            {t('auth.register.have_account')}{' '}
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:underline dark:text-primary-400"
            >
              {t('auth.register.sign_in')}
            </Link>
          </p>
        </div>
      </div>

      {/* Right: sidebar */}
      <AuthSidebar />
    </div>
  );
}