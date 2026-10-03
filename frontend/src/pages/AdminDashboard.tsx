import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Users as UsersIcon,
  Activity,
  TrendingUp,
  Calendar,
  Trash2,
  Shield,
  ShieldOff,
  Search,
  Loader2,
  LayoutDashboard,
  FileText,
  UserCog,
  Mail,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { adminService, type DashboardStats } from '../services/adminService';
import { ReportsTab } from '../components/admin/ReportsTab';
import { ConfirmDialog } from '../components/admin/ConfirmDialog';
import { useAuthStore } from '../store/authStore';
import type { User, UserRole } from '../types/user.types';
import { cn } from '../utils/cn';

type Tab = 'overview' | 'users' | 'reports';

export function AdminDashboard() {
  const { t } = useTranslation();
  const me = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminService.stats();
        setStats(data);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || 'Failed to load stats');
      } finally {
        setLoadingStats(false);
      }
    })();
  }, []);

  const tabs = [
    { key: 'overview' as const, label: t('admin.tabs.overview'), Icon: LayoutDashboard },
    { key: 'users' as const, label: t('admin.tabs.users'), Icon: UserCog },
    { key: 'reports' as const, label: t('admin.tabs.reports'), Icon: FileText },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-zinc-950">
      <div className="container-app py-10 lg:py-14">
        {/* Page heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('admin.eyebrow')}
            </p>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-100">
            {t('admin.title')}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            {t('admin.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-1 border-b border-slate-200 dark:border-zinc-800">
          {tabs.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors',
                tab === key
                  ? 'border-primary-600 text-primary-700 dark:border-primary-500 dark:text-primary-300'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <OverviewTab stats={stats} loading={loadingStats} me={me} />
        )}
        {tab === 'users' && <UsersTab me={me} />}
        {tab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}

/* ============================================
   Overview
   ============================================ */
function OverviewTab({
  stats,
  loading,
  me,
}: {
  stats: DashboardStats | null;
  loading: boolean;
  me: User | null;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary-600 dark:text-primary-400" />
      </div>
    );
  }

  const cards = [
    { label: t('admin.stats.total_users'), value: stats?.total_users ?? 0, Icon: UsersIcon, color: 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' },
    { label: t('admin.stats.active_users'), value: stats?.active_users ?? 0, Icon: Activity, color: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400' },
    { label: t('admin.stats.total_predictions'), value: stats?.total_predictions ?? 0, Icon: TrendingUp, color: 'bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400' },
    { label: t('admin.stats.predictions_today'), value: stats?.predictions_today ?? 0, Icon: Calendar, color: 'bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400' },
  ];

  const maxCount = Math.max(1, ...(stats?.top_diseases.map((d) => d.count) ?? [1]));

  return (
    <div className="space-y-8">
      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, Icon, color }) => (
          <div
            key={label}
            className="border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                {label}
              </span>
              <div className={cn('flex h-9 w-9 items-center justify-center', color)}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-zinc-100">
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Top diseases */}
      {stats && stats.top_diseases.length > 0 && (
        <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('admin.top_diseases.label')}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
              {t('admin.top_diseases.title')}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              {t('admin.top_diseases.subtitle')}
            </p>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
            {stats.top_diseases.map(({ disease, count }, i) => (
              <li key={disease} className="flex items-center gap-4 px-6 py-4 sm:px-8">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-slate-200 font-mono text-xs font-bold text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="truncate text-sm font-semibold capitalize text-slate-800 dark:text-zinc-200">
                      {disease}
                    </span>
                    <span className="shrink-0 font-mono text-sm font-bold tabular-nums text-slate-600 dark:text-zinc-400">
                      {count}
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden bg-slate-100 dark:bg-zinc-800">
                    <div
                      className="h-full bg-primary-500 transition-all duration-700"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent users */}
      {stats && stats.recent_users.length > 0 && (
        <section className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {t('admin.recent_users.label')}
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
              {t('admin.recent_users.title')}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              {t('admin.recent_users.subtitle')}
            </p>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
            {stats.recent_users.map((u) => (
              <li
                key={u.id}
                className="flex items-center gap-4 px-6 py-4 sm:px-8"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-slate-100 font-mono text-sm font-bold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                  {(u.full_name || u.email)[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {u.full_name || u.email}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-zinc-500">
                    {u.email}
                  </p>
                </div>
                <span className="hidden font-mono text-xs text-slate-500 sm:block dark:text-zinc-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ============================================
   Users tab — table + management
   ============================================ */
function UsersTab({ me }: { me: User | null }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminService.listUsers({
        q: search || undefined,
        role: roleFilter === 'all' ? undefined : roleFilter,
        limit: 100,
      });
      setUsers(data.users);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  async function toggleActive(user: User) {
    setActionLoading(user.id);
    try {
      const updated = await adminService.updateUser(user.id, { is_active: !user.is_active });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(t('admin.actions.update_success'));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || t('admin.actions.update_failed'));
    } finally {
      setActionLoading(null);
    }
  }

  async function toggleRole(user: User) {
    const newRole: UserRole = user.role === 'admin' ? 'user' : 'admin';
    setActionLoading(user.id);
    try {
      const updated = await adminService.updateUser(user.id, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(t('admin.actions.update_success'));
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || t('admin.actions.update_failed'));
    } finally {
      setActionLoading(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      await adminService.deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success(t('admin.actions.delete_success'));
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || t('admin.actions.delete_failed'));
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            {t('admin.users_table.label')}
          </p>
          <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
            {t('admin.users_table.title')}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            {t('admin.users_table.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:px-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('admin.users_table.search_placeholder')}
              className="input pl-10 text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="input w-full text-sm sm:w-40"
          >
            <option value="all">{t('admin.users_table.filter_all')}</option>
            <option value="user">{t('admin.users_table.filter_user')}</option>
            <option value="admin">{t('admin.users_table.filter_admin')}</option>
          </select>
          <button
            type="submit"
            className="hidden px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 transition-colors hover:bg-primary-700 sm:inline-block"
          >
            Search
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
              <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
                {t('admin.users_table.loading')}
              </span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500 dark:text-zinc-500">
              {t('admin.users_table.empty')}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-zinc-800 dark:bg-zinc-900">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 sm:px-8">
                    {t('admin.users_table.col_user')}
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 sm:table-cell dark:text-zinc-500">
                    {t('admin.users_table.col_role')}
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 md:table-cell dark:text-zinc-500">
                    {t('admin.users_table.col_status')}
                  </th>
                  <th className="hidden px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 lg:table-cell dark:text-zinc-500">
                    {t('admin.users_table.col_created')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 sm:px-8">
                    {t('admin.users_table.col_actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {users.map((u) => {
                  const isSelf = u.id === me?.id;
                  const busy = actionLoading === u.id;
                  return (
                    <tr
                      key={u.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                    >
                      <td className="px-6 py-4 sm:px-8">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 font-mono text-xs font-bold text-slate-600 dark:bg-zinc-900 dark:text-zinc-400">
                            {(u.full_name || u.email)[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-900 dark:text-zinc-100">
                              {u.full_name || '—'}
                            </p>
                            <p className="flex items-center gap-1 truncate text-xs text-slate-500 dark:text-zinc-500">
                              <Mail className="h-3 w-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                            u.role === 'admin'
                              ? 'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950 dark:text-primary-300'
                              : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
                          )}
                        >
                          {u.role === 'admin'
                            ? t('admin.users_table.role_admin')
                            : t('admin.users_table.role_user')}
                        </span>
                      </td>
                      <td className="hidden px-4 py-4 md:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                            u.is_active
                              ? 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400'
                              : 'border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-400'
                          )}
                        >
                          {u.is_active ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {u.is_active
                            ? t('admin.users_table.status_active')
                            : t('admin.users_table.status_inactive')}
                        </span>
                      </td>
                      <td className="hidden px-4 py-4 font-mono text-xs text-slate-500 lg:table-cell dark:text-zinc-500">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right sm:px-8">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => toggleRole(u)}
                            disabled={isSelf || busy}
                            title={
                              u.role === 'admin'
                                ? t('admin.users_table.action_demote')
                                : t('admin.users_table.action_promote')
                            }
                            className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 dark:hover:text-primary-400"
                          >
                            {u.role === 'admin' ? (
                              <ShieldOff className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleActive(u)}
                            disabled={isSelf || busy}
                            title={
                              u.is_active
                                ? t('admin.users_table.action_deactivate')
                                : t('admin.users_table.action_activate')
                            }
                            className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 transition-colors hover:border-warning-300 hover:bg-warning-50 hover:text-warning-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-warning-700 dark:hover:bg-warning-950/30 dark:hover:text-warning-400"
                          >
                            {busy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : u.is_active ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            disabled={isSelf || busy}
                            title={t('admin.users_table.action_delete')}
                            className="flex h-8 w-8 items-center justify-center border border-slate-200 text-slate-500 transition-colors hover:border-danger-300 hover:bg-danger-50 hover:text-danger-600 disabled:cursor-not-allowed disabled:opacity-30 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-danger-700 dark:hover:bg-danger-950/30 dark:hover:text-danger-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {isSelf && (
                          <p className="mt-1 text-[10px] italic text-slate-400 dark:text-zinc-600">
                            {t('admin.users_table.self_hint')}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title={t('admin.confirm_delete_title')}
        body={t('admin.confirm_delete_body', {
          name: deleteTarget?.full_name || deleteTarget?.email || '',
        })}
        confirmLabel={t('admin.confirm_delete_yes')}
        cancelLabel={t('admin.confirm_delete_no')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={actionLoading === deleteTarget?.id}
        variant="danger"
      />
    </div>
  );
}