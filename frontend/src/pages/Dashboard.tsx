import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, ArrowRight, History, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';

interface HistoryItem {
  id: number;
  top_disease: string;
  top_confidence: number;
  created_at: string;
}

export function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<HistoryItem[]>('/predictions/history');
        setRecent(data.slice(0, 3));
      } catch {
        // History endpoint not built yet — silently ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const firstName = (user?.full_name || user?.email || '').split(/[\s@.]+/)[0];

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-2 text-slate-600 dark:text-zinc-400">
          Track your health checks and stay ahead of symptoms.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/predict">
          <Card interactive className="h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              Start a new check
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Enter your symptoms and get AI-powered guidance.
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400">
              Begin <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>

        <Link to="/history">
          <Card interactive className="h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-info-50 text-info-600 dark:bg-info-500/15 dark:text-info-500">
              <History className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              View history
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              See all your past symptom checks in one place.
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-info-600 dark:text-info-500">
              Open <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>

        <Link to="/settings">
          <Card interactive className="h-full">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              Account settings
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Update your profile, email, or password.
            </p>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-success-600 dark:text-success-500">
              Manage <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
            Recent checks
          </h2>
          <Link to="/history" className="text-sm font-semibold text-primary-600 hover:underline dark:text-primary-400">
            View all
          </Link>
        </div>

        {loading ? (
          <Card>
            <p className="text-sm text-slate-500 dark:text-zinc-500">Loading...</p>
          </Card>
        ) : recent.length === 0 ? (
          <Card className="text-center">
            <Search className="mx-auto h-10 w-10 text-slate-300 dark:text-zinc-700" />
            <p className="mt-3 font-medium text-slate-900 dark:text-zinc-100">
              No checks yet
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Your past symptom checks will appear here.
            </p>
            <Link to="/predict" className="mt-4 inline-block">
              <Button variant="primary" size="sm">Start your first check</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {recent.map((item) => (
              <Card key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold capitalize text-slate-900 dark:text-zinc-100">
                      {item.top_disease}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-zinc-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  {(item.top_confidence * 100).toFixed(0)}%
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}