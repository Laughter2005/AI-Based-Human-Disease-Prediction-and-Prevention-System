import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Calendar, TrendingUp, Activity, ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { statsService, type UserStats } from '../services/statsService';

export function Stats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await statsService.me();
        setStats(data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container-app flex min-h-[60vh] items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container-app py-10">
        <p className="text-center text-slate-500 dark:text-zinc-500">
          Failed to load statistics.
        </p>
      </div>
    );
  }

  const maxMonth = Math.max(1, ...stats.monthly_trend.map((m) => m.predictions));
  const maxDisease = Math.max(1, ...stats.top_diseases.map((d) => d.count));

  return (
    <div className="container-app py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
              Your statistics
            </h1>
            <p className="text-slate-600 dark:text-zinc-400">
              A summary of your health checks over time.
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">
                Total checks
              </span>
              <Activity className="h-5 w-5 text-primary-500" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
              {stats.total_predictions}
            </p>
          </Card>

          <Card className="animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">
                This month
              </span>
              <Calendar className="h-5 w-5 text-info-500" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
              {stats.predictions_this_month}
            </p>
          </Card>

          <Card className="animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">
                Last 30 days
              </span>
              <TrendingUp className="h-5 w-5 text-success-500" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
              {stats.predictions_last_30_days}
            </p>
          </Card>
        </div>

        {/* Monthly trend */}
{stats.monthly_trend.length > 0 && (
  <Card className="mt-8">
    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
      Monthly activity
    </h2>

    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-500">
      <span>Predictions per month</span>
      <span className="text-slate-400">·</span>
      <span>Max: {maxMonth}</span>
    </div>

    {/* Chart container */}
    <div className="mt-6 flex h-56 items-end justify-around gap-4 border-b border-slate-200 dark:border-zinc-800">
      {stats.monthly_trend.map((m) => {
        const heightPct = Math.max(4, (m.predictions / maxMonth) * 100);

        return (
          <div
            key={m.month}
            className="group flex h-full flex-col items-center justify-end gap-2"
            style={{ minWidth: '48px', maxWidth: '80px', width: '100%' }}
          >
            <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
              {m.predictions}
            </span>
            <div
              className="w-full rounded-t bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-700 ease-out group-hover:from-primary-700 group-hover:to-primary-500"
              style={{ height: `${heightPct}%` }}
              title={`${m.month}: ${m.predictions} prediction${m.predictions !== 1 ? 's' : ''}`}
            />
          </div>
        );
      })}
    </div>

    {/* Month labels */}
    <div className="mt-2 flex justify-around gap-4">
      {stats.monthly_trend.map((m) => (
        <div
          key={m.month}
          className="text-center"
          style={{ minWidth: '48px', maxWidth: '80px', width: '100%' }}
        >
          <span className="text-xs text-slate-500 dark:text-zinc-500">
            {m.month.slice(5)}
          </span>
        </div>
      ))}
    </div>
  </Card>
)}
        {/* Top diseases */}
        {stats.top_diseases.length > 0 && (
          <Card className="mt-8">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
              Your top conditions
            </h2>
            <ul className="mt-5 space-y-3">
              {stats.top_diseases.map(({ disease, count }) => (
                <li key={disease}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium capitalize text-slate-800 dark:text-zinc-200">
                      {disease}
                    </span>
                    <Badge variant="primary" size="sm">{count}</Badge>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                      style={{ width: `${(count / maxDisease) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {stats.total_predictions === 0 && (
          <Card className="mt-8 text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-slate-300 dark:text-zinc-700" />
            <p className="mt-4 font-medium text-slate-900 dark:text-zinc-100">
              No statistics yet
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Start using the prediction tool to build your history.
            </p>
            <Link to="/predict" className="mt-5 inline-block">
              <Button variant="primary">Start a check</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}