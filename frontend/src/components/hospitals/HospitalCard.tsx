import { useTranslation } from 'react-i18next';
import { Phone, MapPin, Navigation, Building2, ExternalLink } from 'lucide-react';
import type { Hospital } from '../../services/hospitalService';
import { cn } from '../../utils/cn';

interface HospitalCardProps {
  hospital: Hospital;
}

const TYPE_COLORS: Record<string, string> = {
  'Central Hospital':
    'border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-500/30 dark:bg-danger-500/10 dark:text-danger-400',
  'District Hospital':
    'border-primary-200 bg-primary-50 text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300',
  'Mission Hospital':
    'border-info-200 bg-info-50 text-info-700 dark:border-info-500/30 dark:bg-info-500/10 dark:text-info-400',
  'Health Centre':
    'border-success-200 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400',
};

export function HospitalCard({ hospital }: HospitalCardProps) {
  const { t } = useTranslation();

  const typeColor =
    TYPE_COLORS[hospital.type] ??
    'border-slate-200 bg-slate-50 text-slate-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400';

  const mapsUrl =
    hospital.latitude !== null && hospital.longitude !== null
      ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name)}`;

  const phoneDigits = hospital.phone?.replace(/\s/g, '');

  return (
    <div className="group border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-primary-700">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-base font-bold text-slate-900 dark:text-zinc-100">
              {hospital.name}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">
                {hospital.district}, {hospital.region}
              </span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span
            className={cn(
              'border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              typeColor
            )}
          >
            {hospital.type.replace(' Hospital', '')}
          </span>
          {hospital.distance_km !== null && (
            <span className="text-xs font-bold tabular-nums text-primary-600 dark:text-primary-400">
              {hospital.distance_km} km
            </span>
          )}
        </div>
      </div>

      {/* Services */}
      {hospital.services.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {hospital.services.slice(0, 5).map((s) => (
            <span
              key={s}
              className="border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
            >
              {s}
            </span>
          ))}
          {hospital.services.length > 5 && (
            <span className="px-2 py-0.5 text-[10px] font-medium text-slate-400 dark:text-zinc-600">
              +{hospital.services.length - 5}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-zinc-800">
        {hospital.phone && (
          <a
            href={`tel:${phoneDigits}`}
            className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-primary-700 dark:hover:bg-primary-950/30 dark:hover:text-primary-300"
          >
            <Phone className="h-3.5 w-3.5" />
            {hospital.phone}
          </a>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-info-300 hover:bg-info-50 hover:text-info-700 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-info-700 dark:hover:bg-info-950/30 dark:hover:text-info-300"
        >
          <Navigation className="h-3.5 w-3.5" />
          {t('hospitals.directions')}
        </a>
        {!hospital.phone && (
          <span className="inline-flex items-center gap-1.5 border border-dashed border-slate-200 px-3 py-1.5 text-xs font-medium italic text-slate-400 dark:border-zinc-800 dark:text-zinc-600">
            <ExternalLink className="h-3.5 w-3.5" />
            {t('hospitals.no_phone')}
          </span>
        )}
      </div>
    </div>
  );
}