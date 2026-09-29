import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ny' : 'en');
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      {i18n.language === 'en' ? 'Chichewa' : 'English'}
    </button>
  );
}