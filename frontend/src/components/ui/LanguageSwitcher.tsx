import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/cn';

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ny', label: 'Chichewa', short: 'NY' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = i18n.language?.startsWith('ny') ? 'ny' : 'en';
  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const change = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2',
          'text-sm font-medium text-slate-700 transition-colors',
          'hover:bg-slate-50 hover:text-primary-600',
          'dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-primary-400'
        )}
        aria-label="Switch language"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang.label}</span>
        <span className="sm:hidden">{currentLang.short}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className={cn(
            'absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded border',
            'border-slate-200 bg-white shadow-lifted',
            'dark:border-zinc-800 dark:bg-zinc-900',
            'animate-fade-in'
          )}
        >
          {LANGUAGES.map((lang) => {
            const isActive = lang.code === current;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isActive}
                onClick={() => change(lang.code)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800'
                )}
              >
                <span>{lang.label}</span>
                {isActive && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}