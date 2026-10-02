import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { LogIn, Mail, Shield, User as UserIcon } from 'lucide-react';
import { TextInput } from '../components/ui/TextInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
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
    if (!email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
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
      toast.success(`Welcome back, ${res.user.full_name || res.user.email}`);
      const dest = from || (res.user.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-10">
      <Card className="w-full max-w-md animate-fade-in">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Sign in to your account
          </p>
        </div>

        {/* Role selector */}
        <div className="mt-6 grid grid-cols-2 gap-2 rounded border border-slate-200 p-1 dark:border-zinc-800">
          {(
            [
              { value: 'user', label: 'User', Icon: UserIcon },
              { value: 'admin', label: 'Admin', Icon: Shield },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRole(value)}
              className={cn(
                'flex items-center justify-center gap-2 rounded px-3 py-2.5 text-sm font-semibold transition-all',
                role === value
                  ? 'bg-primary-500 text-white shadow-soft'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="gradient"
            loading={loading}
            className="w-full"
            leftIcon={!loading && <LogIn className="h-4 w-4" />}
          >
            {loading ? 'Signing in...' : `Sign in as ${role}`}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}