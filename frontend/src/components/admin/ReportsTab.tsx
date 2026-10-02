import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  Loader2,
  Users as UsersIcon,
  Activity,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';
import { statsService, type DateRangeReport } from '../../services/statsService';

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function ReportsTab() {
  const [startDate, setStartDate] = useState(isoDaysAgo(30));
  const [endDate, setEndDate] = useState(isoDaysAgo(0));
  const [report, setReport] = useState<DateRangeReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState<'predictions' | 'users' | null>(null);

  async function runReport() {
    setLoading(true);
    try {
      const data = await statsService.report(startDate, endDate);
      setReport(data);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  }

  async function exportPredictions() {
    setExporting('predictions');
    try {
      await statsService.downloadPredictionsCsv(startDate, endDate);
      toast.success('Predictions CSV downloaded');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  }

  async function exportUsers() {
    setExporting('users');
    try {
      await statsService.downloadUsersCsv();
      toast.success('Users CSV downloaded');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(null);
    }
  }

  const maxDaily = report ? Math.max(1, ...report.daily_breakdown.map((d) => d.count)) : 1;

  return (
    <div className="space-y-6">
      {/* Date range controls */}
      <Card>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
            Report period
          </h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:items-end">
          <TextInput
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextInput
            label="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button
            variant="gradient"
            onClick={runReport}
            loading={loading}
            className="w-full sm:w-auto"
          >
            Generate report
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={exportPredictions}
            loading={exporting === 'predictions'}
            leftIcon={exporting !== 'predictions' && <FileSpreadsheet className="h-4 w-4" />}
          >
            Export predictions (CSV)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={exportUsers}
            loading={exporting === 'users'}
            leftIcon={exporting !== 'users' && <Download className="h-4 w-4" />}
          >
            Export all users (CSV)
          </Button>
        </div>
      </Card>

      {loading && (
        <Card className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        </Card>
      )}

      {report && !loading && (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">
                  Total predictions
                </span>
                <Activity className="h-5 w-5 text-primary-500" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {report.total_predictions}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                {report.start_date} → {report.end_date}
              </p>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">
                  Unique users
                </span>
                <UsersIcon className="h-5 w-5 text-info-500" />
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
                {report.unique_users}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                Users who made predictions in this period
              </p>
            </Card>
          </div>

          {/* Daily breakdown */}
          {report.daily_breakdown.length > 0 && (
  <Card>
    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
      Daily predictions
    </h3>
    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
      Max: {maxDaily}
    </p>

    <div className="mt-6 flex h-56 items-end justify-around gap-1 border-b border-slate-200 dark:border-zinc-800">
      {report.daily_breakdown.map((d) => {
        const heightPct = Math.max(4, (d.count / maxDaily) * 100);
        return (
          <div
            key={d.date}
            className="group flex h-full flex-col items-center justify-end gap-1"
            style={{ minWidth: '20px', maxWidth: '60px', width: '100%' }}
            title={`${d.date}: ${d.count}`}
          >
            <div
              className="w-full rounded-t bg-gradient-to-t from-primary-600 to-primary-400 transition-all duration-500 ease-out group-hover:from-primary-700 group-hover:to-primary-500"
              style={{ height: `${heightPct}%` }}
            />
          </div>
        );
      })}
    </div>

    <div className="mt-2 flex justify-around gap-1">
      {report.daily_breakdown.map((d, i) => {
        const showLabel = i % Math.ceil(report.daily_breakdown.length / 8) === 0;
        return (
          <div
            key={d.date}
            className="text-center"
            style={{ minWidth: '20px', maxWidth: '60px', width: '100%' }}
          >
            {showLabel ? (
              <span className="text-[10px] text-slate-500 dark:text-zinc-500">
                {d.date.slice(5)}
              </span>
            ) : (
              <span className="text-[10px]">&nbsp;</span>
            )}
          </div>
        );
      })}
    </div>
  </Card>
)}
          {/* Top diseases */}
          {report.top_diseases.length > 0 && (
            <Card>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                Top predicted conditions
              </h3>
              <ul className="mt-5 space-y-2">
                {report.top_diseases.map((d) => (
                  <li
                    key={d.disease}
                    className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0 dark:border-zinc-800"
                  >
                    <span className="capitalize text-slate-800 dark:text-zinc-200">
                      {d.disease}
                    </span>
                    <span className="font-semibold text-slate-600 dark:text-zinc-400">
                      {d.count}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Language split */}
          {Object.keys(report.language_split).length > 0 && (
            <Card>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                Language distribution
              </h3>
              <div className="mt-4 flex gap-6">
                {Object.entries(report.language_split).map(([lang, count]) => (
                  <div key={lang}>
                    <p className="text-sm text-slate-500 dark:text-zinc-500">
                      {lang === 'ny' ? 'Chichewa' : 'English'}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-zinc-100">
                      {count}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}