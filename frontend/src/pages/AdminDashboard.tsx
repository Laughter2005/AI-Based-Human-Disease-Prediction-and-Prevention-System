import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
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
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { adminService, type DashboardStats } from '../services/adminService';
import { ReportsTab } from '../components/admin/ReportsTab';
import { useAuthStore } from '../store/authStore';
import type { User, UserRole } from '../types/user.types';
import { cn } from '../utils/cn';

type Tab = 'overview' | 'reports';

export function AdminDashboard() {
  const me = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Administrator
          </span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-slate-600 dark:text-zinc-400">
          Monitor users, predictions, and system activity.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-slate-200 dark:border-zinc-800">
        {[
          { key: 'overview' as const, label: 'Overview', Icon: LayoutDashboard },
          { key: 'reports' as const, label: 'Reports', Icon: FileText },
        ].map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors',
              tab === key
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewTab me={me} />}
      {tab === 'reports' && <ReportsTab />}
    </div>
  );
}

// ============= Overview tab =============
function OverviewTab({ me }: { me: User | null }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [statsData, usersData] = await Promise.all([
        adminService.stats(),
        adminService.listUsers({
          q: search || undefined,
          role: roleFilter === 'all' ? undefined : roleFilter,
          limit: 100,
        }),
      ]);
      setStats(statsData);
      setUsers(usersData.users);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    loadAll();
  }

  async function toggleActive(user: User) {
    setActionLoading(user.id);
    try {
      const updated = await adminService.updateUser(user.id, { is_active: !user.is_active });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.success(updated.is_active ? 'User activated' : 'User deactivated');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Update failed');
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
      toast.success(`Role changed to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Update failed');
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteUser(user: User) {
    if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    setActionLoading(user.id);
    try {
      await adminService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      toast.success('User deleted');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Delete failed');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading && !stats) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const maxCount = Math.max(1, ...(stats?.top_diseases.map((d) => d.count) ?? [1]));

  return (
    <>
      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total users', value: stats?.total_users ?? 0, Icon: Users, color: 'text-primary-600 bg-primary-100 dark:bg-primary-900/30' },
          { label: 'Active users', value: stats?.active_users ?? 0, Icon: Activity, color: 'text-success-600 bg-success-50 dark:bg-success-500/15' },
          { label: 'Predictions', value: stats?.total_predictions ?? 0, Icon: TrendingUp, color: 'text-info-600 bg-info-50 dark:bg-info-500/15' },
          { label: 'Today', value: stats?.predictions_today ?? 0, Icon: Calendar, color: 'text-warning-600 bg-warning-50 dark:bg-warning-500/15' },
        ].map(({ label, value, Icon, color }) => (
          <Card key={label} className="animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-zinc-500">{label}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-slate-900 dark:text-zinc-100">
              {value}
            </p>
          </Card>
        ))}
      </div>

      {stats && stats.top_diseases.length > 0 && (
        <Card className="mt-8">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
            Top predicted conditions
          </h2>
          <ul className="mt-5 space-y-3">
            {stats.top_diseases.map(({ disease, count }) => (
              <li key={disease}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize text-slate-800 dark:text-zinc-200">
                    {disease}
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-zinc-400">{count}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
            Users ({users.length})
          </h2>
          <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or name..."
                className="input pl-10 text-sm"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="input w-28 text-sm"
            >
              <option value="all">All</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
          </form>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-zinc-800">
                <th className="pb-3 font-semibold text-slate-500 dark:text-zinc-500">User</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-zinc-500">Role</th>
                <th className="pb-3 font-semibold text-slate-500 dark:text-zinc-500">Status</th>
                <th className="pb-3 text-right font-semibold text-slate-500 dark:text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {users.map((u) => {
                const isSelf = u.id === me?.id;
                return (
                  <tr key={u.id} className="align-middle">
                    <td className="py-3">
                      <p className="font-medium text-slate-900 dark:text-zinc-100">
                        {u.full_name || '—'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-zinc-500">{u.email}</p>
                    </td>
                    <td className="py-3">
                      <Badge variant={u.role === 'admin' ? 'primary' : 'default'} size="sm">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={u.is_active ? 'success' : 'danger'} size="sm">
                        {u.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={isSelf || actionLoading === u.id}
                          title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                        >
                          {u.role === 'admin' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => toggleActive(u)}
                          disabled={isSelf || actionLoading === u.id}
                          title={u.is_active ? 'Deactivate' : 'Activate'}
                          className="rounded p-1.5 text-warning-600 hover:bg-warning-50 disabled:opacity-30 dark:hover:bg-warning-500/10"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(u)}
                          disabled={isSelf || actionLoading === u.id}
                          title="Delete user"
                          className="rounded p-1.5 text-danger-600 hover:bg-danger-50 disabled:opacity-30 dark:hover:bg-danger-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500 dark:text-zinc-500">
              No users found.
            </p>
          )}
        </div>
      </Card>
    </>
  );
}