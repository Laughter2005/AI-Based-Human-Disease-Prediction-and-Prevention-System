import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { statsService, type PublicStats } from '../../services/statsService';

export function AuthSidebar() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    statsService.public().then(setStats).catch(() => {});
  }, []);

  const bullets = [
    t('auth.sidebar.bullet1'),
    t('auth.sidebar.bullet2'),
    t('auth.sidebar.bullet3'),
    t('auth.sidebar.bullet4'),
  ];

  return (
    <aside className="relative hidden overflow-hidden bg-slate-900 text-white lg:flex lg:flex-col">
      {/* Malawi flag accent */}
      <div
        className="absolute left-0 top-0 h-1 w-full"
        style={{
          background:
            'linear-gradient(90deg, #000000 0% 33.33%, #CE1126 33.33% 66.66%, #339E35 66.66% 100%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative flex flex-1 flex-col justify-between p-12">
        {/* Top: brand + tagline */}
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center bg-primary-600 text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              {t('auth.sidebar.heading')}
            </span>
          </Link>

          <p className="mt-12 max-w-md font-display text-3xl font-bold leading-tight">
            {t('auth.sidebar.tagline')}
          </p>
        </div>

        {/* Middle: bullets */}
        <ul className="my-12 space-y-4">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-400" />
              <span className="text-slate-200">{b}</span>
            </li>
          ))}
        </ul>

        {/* Bottom: live stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('auth.sidebar.stats_users')}
              </p>
              <p className="mt-1 font-display text-3xl font-bold tabular-nums">
                {stats.total_users.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('auth.sidebar.stats_checks')}
              </p>
              <p className="mt-1 font-display text-3xl font-bold tabular-nums">
                {stats.total_predictions.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Security badge */}
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Data protected under Malawi Data Protection Act</span>
        </div>
      </div>
    </aside>
  );
}