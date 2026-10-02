import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { UserPlus, Check } from 'lucide-react';
import { TextInput } from '../components/ui/TextInput';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authService } from '../services/authService';
import { cn } from '../utils/cn';

function scorePassword(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'bg-danger-500',
    'bg-warning-500',
    'bg-info-500',
    'bg-success-500',
  ];
  return {
    score: s,
    label: labels[Math.max(0, s - 1)],
    color: colors[Math.max(0, s - 1)],
  };
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

  const pwStrength = useMemo(() => scorePassword(password), [password]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirm) e.confirm = 'Passwords do not match';
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
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-10">
      <Card className="w-full max-w-md animate-fade-in">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            It's free and takes less than a minute
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <TextInput
            label="Full name"
            autoComplete="name"
            placeholder="e.g. John Banda"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
          />

          <TextInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div>
            <PasswordInput
              label="Password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
                        'h-1 flex-1 rounded-full transition-colors',
                        i < pwStrength.score ? pwStrength.color : 'bg-slate-200 dark:bg-zinc-800'
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                  Strength: <span className="font-medium">{pwStrength.label}</span>
                </p>
              </div>
            )}
          </div>

          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />

          {confirm && password === confirm && (
            <div className="flex items-center gap-2 text-sm text-success-600 dark:text-success-500">
              <Check className="h-4 w-4" />
              Passwords match
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            loading={loading}
            className="w-full"
            leftIcon={!loading && <UserPlus className="h-4 w-4" />}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-zinc-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}