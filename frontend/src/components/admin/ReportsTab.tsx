import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Calendar,
  Download,
  FileSpreadsheet,
  Loader2,
  Users as UsersIcon,
  Activity,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { TextInput } from '../ui/TextInput';
import { statsService, type DateRangeReport } from '../../services/statsService';
import { cn } from '../../utils/cn';

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export function ReportsTab() {
  const { t } = useTranslation();
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
      toast.success(t('admin.reports.export_success_predictions'));
    } catch {
      toast.error(t('admin.reports.export_failed'));
    } finally {
      setExporting(null);
    }
  }

  async function exportUsers() {
    setExporting('users');
    try {
      await statsService.downloadUsersCsv();
      toast.success(t('admin.reports.export_success_users'));
    } catch {
      toast.error(t('admin.reports.export_failed'));
    } finally {
      setExporting(null);
    }
  }

  const maxDaily = report ? Math.max(1, ...report.daily_breakdown.map((d) => d.count)) : 1;
  const maxDisease = report ? Math.max(1, ...report.top_diseases.map((d) => d.count)) : 1;

  return (
    <div className="space-y-6">
      {/* Date range controls */}
      <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('admin.reports.label')}
            </p>
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
            {t('admin.reports.date_range_title')}
          </h2>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
            <TextInput
              label={t('admin.reports.start_date')}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextInput
              label={t('admin.reports.end_date')}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <Button
              onClick={runReport}
              loading={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 sm:w-auto"
            >
              {loading ? t('admin.reports.generating') : t('admin.reports.generate')}
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200 pt-6 dark:border-zinc-800">
            <Button
              variant="secondary"
              size="sm"
              onClick={exportPredictions}
              loading={exporting === 'predictions'}
              leftIcon={
                exporting !== 'predictions' && <FileSpreadsheet className="h-4 w-4" />
              }
            >
              {t('admin.reports.export_predictions')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={exportUsers}
              loading={exporting === 'users'}
              leftIcon={exporting !== 'users' && <Download className="h-4 w-4" />}
            >
              {t('admin.reports.export_users')}
            </Button>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center border border-slate-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-950">
          <Loader2 className="h-6 w-6 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
            {t('admin.reports.loading_report')}
          </span>
        </div>
      )}

      {report && !loading && (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  {t('admin.reports.summary_total')}
                </span>
                <div className="flex h-9 w-9 items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-zinc-100">
                {report.total_predictions.toLocaleString()}
              </p>
              <p className="mt-2 font-mono text-xs text-slate-500 dark:text-zinc-500">
                {report.start_date} → {report.end_date}
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                  {t('admin.reports.summary_users')}
                </span>
                <div className="flex h-9 w-9 items-center justify-center bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400">
                  <UsersIcon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-zinc-100">
                {report.unique_users.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-zinc-500">
                {t('admin.reports.summary_users')}
              </p>
            </div>
          </div>

          {/* Daily activity */}
          {report.daily_breakdown.length > 0 && (
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {t('admin.reports.daily_title')}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                  {t('admin.reports.daily_max', { max: maxDaily })}
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex h-48 items-end gap-1 border-b border-slate-200 dark:border-zinc-800">
                  {report.daily_breakdown.map((d) => {
                    const heightPct = Math.max(4, (d.count / maxDaily) * 100);
                    return (
                      <div
                        key={d.date}
                        className="group flex h-full flex-1 flex-col items-center justify-end"
                        title={`${d.date}: ${d.count}`}
                      >
                        <div
                          className="w-full bg-primary-500 transition-colors group-hover:bg-primary-600"
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-1">
                  {report.daily_breakdown.map((d, i) => {
                    const step = Math.max(
                      1,
                      Math.ceil(report.daily_breakdown.length / 8)
                    );
                    return (
                      <div key={d.date} className="flex-1 text-center">
                        {i % step === 0 ? (
                          <span className="font-mono text-[10px] text-slate-500 dark:text-zinc-500">
                            {d.date.slice(5)}
                          </span>
                        ) : (
                          <span className="text-[10px]">&nbsp;</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Top diseases */}
          {report.top_diseases.length > 0 && (
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {t('admin.reports.top_diseases_title')}
                </h3>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
                {report.top_diseases.map((d, i) => (
                  <li
                    key={d.disease}
                    className="flex items-center gap-4 px-6 py-4 sm:px-8"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-slate-200 font-mono text-xs font-bold text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="truncate text-sm font-semibold capitalize text-slate-800 dark:text-zinc-200">
                          {d.disease}
                        </span>
                        <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-slate-600 dark:text-zinc-400">
                          {d.count}
                        </span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                        <div
                          className="h-full bg-primary-500 transition-all duration-700"
                          style={{ width: `${(d.count / maxDisease) * 100}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Language split */}
          {Object.keys(report.language_split).length > 0 && (
            <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {t('admin.reports.language_title')}
                </h3>
              </div>
              <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-zinc-800">
                {Object.entries(report.language_split).map(([lang, count]) => (
                  <div key={lang} className="p-6 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                      {lang === 'ny'
                        ? t('admin.reports.language_ny')
                        : t('admin.reports.language_en')}
                    </p>
                    <p className="mt-3 font-display text-3xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-zinc-100">
                      {count.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {report.total_predictions === 0 && (
            <div className="border border-dashed border-slate-300 py-16 text-center dark:border-zinc-700">
              <p className="text-sm text-slate-500 dark:text-zinc-500">
                {t('admin.reports.empty')}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}