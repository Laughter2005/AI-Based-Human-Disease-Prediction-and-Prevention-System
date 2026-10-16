import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Hospital as HospitalIcon,
  MapPin,
  Loader2,
  Navigation,
  ChevronDown,
} from 'lucide-react';
import {
  hospitalService,
  getUserLocation,
  type Hospital,
} from '../../services/hospitalService';
import { HospitalCard } from './HospitalCard';
import { cn } from '../../utils/cn';

interface HospitalListProps {
  /** If provided, used as a filter hint to prioritize hospitals in this district */
  district?: string;
}

const REGIONS = ['All', 'Northern', 'Central', 'Southern'] as const;
type Region = (typeof REGIONS)[number];

export function HospitalList({ district }: HospitalListProps) {
  const { t } = useTranslation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [region, setRegion] = useState<Region>('All');
  const [usedGeolocation, setUsedGeolocation] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const INITIAL_LIMIT = 4;
  const FULL_LIMIT = 30;

  async function loadHospitals(withLocation: boolean) {
    setLoading(true);
    let lat: number | undefined;
    let lng: number | undefined;

    if (withLocation) {
      setLocating(true);
      const loc = await getUserLocation();
      setLocating(false);
      if (loc) {
        lat = loc.lat;
        lng = loc.lng;
        setUsedGeolocation(true);
      }
    }

    try {
      const list = await hospitalService.list({
        lat,
        lng,
        region: region === 'All' ? undefined : region,
        limit: expanded ? FULL_LIMIT : INITIAL_LIMIT,
      });
      setHospitals(list);
    } catch {
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHospitals(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, expanded]);

  return (
    <section className="animate-fade-in border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-slate-200 p-6 dark:border-zinc-800 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HospitalIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {t('hospitals.label')}
              </p>
            </div>
            <h2 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-zinc-100">
              {t('hospitals.title')}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              {usedGeolocation
                ? t('hospitals.subtitle_sorted')
                : t('hospitals.subtitle')}
            </p>
          </div>

          {!usedGeolocation && (
            <button
              onClick={() => loadHospitals(true)}
              disabled={locating}
              className="hidden shrink-0 items-center gap-2 border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary-700 transition-colors hover:bg-primary-100 disabled:opacity-60 sm:inline-flex dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300 dark:hover:bg-primary-950/60"
            >
              {locating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {t('hospitals.locating')}
                </>
              ) : (
                <>
                  <Navigation className="h-3.5 w-3.5" />
                  {t('hospitals.use_location')}
                </>
              )}
            </button>
          )}
        </div>

        {/* Region filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                'border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors',
                region === r
                  ? 'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:text-primary-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:border-primary-700 dark:hover:text-primary-400'
              )}
            >
              {t(`hospitals.region_${r.toLowerCase()}`)}
            </button>
          ))}

          <button
            onClick={() => loadHospitals(true)}
            disabled={locating}
            className="ml-auto inline-flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:border-primary-300 hover:text-primary-600 disabled:opacity-60 sm:hidden dark:border-zinc-800 dark:text-zinc-400"
          >
            {locating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Navigation className="h-3 w-3" />
            )}
            {t('hospitals.near_me')}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-6 sm:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-5 w-5 animate-spin text-primary-600 dark:text-primary-400" />
            <span className="ml-3 text-sm text-slate-600 dark:text-zinc-400">
              {t('hospitals.loading')}
            </span>
          </div>
        ) : hospitals.length === 0 ? (
          <div className="border border-dashed border-slate-300 py-10 text-center dark:border-zinc-700">
            <MapPin className="mx-auto h-6 w-6 text-slate-300 dark:text-zinc-700" />
            <p className="mt-3 text-sm text-slate-500 dark:text-zinc-500">
              {t('hospitals.empty')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              {hospitals.map((h) => (
                <HospitalCard key={h.id} hospital={h} />
              ))}
            </div>

            {!expanded && hospitals.length >= INITIAL_LIMIT && (
              <button
                onClick={() => setExpanded(true)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-slate-200 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:border-primary-300 hover:text-primary-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-primary-700 dark:hover:text-primary-400"
              >
                <ChevronDown className="h-4 w-4" />
                {t('hospitals.show_more')}
              </button>
            )}
          </>
        )}
      </div>

      {/* Footer note */}
      <div className="border-t border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:px-8">
        <p className="text-xs italic text-slate-500 dark:text-zinc-500">
          {t('hospitals.disclaimer')}
        </p>
      </div>
    </section>
  );
}