import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">{t('nav.about')}</h1>
      <p className="mt-4 text-gray-700">
        This system uses machine learning to help identify possible diseases based on
        reported symptoms, with prevention guidance tailored to Malawi. It is accessible
        via web and USSD on feature phones, in English and Chichewa.
      </p>
      <p className="mt-4 text-sm text-gray-500">{t('result.disclaimer')}</p>
    </div>
  );
}