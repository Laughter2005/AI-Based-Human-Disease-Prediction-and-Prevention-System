import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Smartphone, Languages } from 'lucide-react';

export function Home() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {t('home.hero_title')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          {t('home.hero_subtitle')}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/predict" className="btn-primary">{t('home.cta_start')}</Link>
          <Link to="/about" className="btn-secondary">{t('home.cta_learn')}</Link>
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          { icon: Shield, title: 'AI-Powered', desc: 'Trained on Malawi-specific disease data.' },
          { icon: Smartphone, title: 'Works on Any Phone', desc: 'Access via USSD on feature phones.' },
          { icon: Languages, title: 'English & Chichewa', desc: 'Available in your language.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-center">
            <Icon className="mx-auto h-8 w-8 text-primary-600" />
            <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}