import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {t('app.name')}. {t('result.disclaimer')}
      </div>
    </footer>
  );
}