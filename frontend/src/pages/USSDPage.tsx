import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PhoneCall,
  Smartphone,
  WifiOff,
  Languages,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function USSDPage() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="bg-white dark:bg-zinc-950">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28">
        <div className="container-app grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 border-l-4 border-primary-600 bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm dark:bg-zinc-900 dark:text-zinc-300">
              <Smartphone className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
              <span>{t('ussd_page.eyebrow')}</span>
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-zinc-100">
              {t('ussd_page.title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-zinc-400">
              {t('ussd_page.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:*384*12345%23" className="inline-block">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700" leftIcon={<PhoneCall className="h-5 w-5" />}>
                  {t('ussd_page.cta_dial')}
                </Button>
              </a>
              <a href="#simulator" className="inline-block">
                <Button variant="secondary" size="lg">
                  {t('ussd_page.cta_simulate')}
                </Button>
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <PhoneSimulator activeStep={activeStep} setActiveStep={setActiveStep} />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-slate-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950 lg:py-28">
        <div className="container-app">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            {t('ussd_page.how_title')}
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { num: '1', title: t('ussd_page.step1_title'), desc: t('ussd_page.step1_desc') },
              { num: '2', title: t('ussd_page.step2_title'), desc: t('ussd_page.step2_desc') },
              { num: '3', title: t('ussd_page.step3_title'), desc: t('ussd_page.step3_desc') },
            ].map((step) => (
              <div key={step.num} className="relative border border-slate-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
                <span className="absolute right-6 top-6 font-mono text-4xl font-bold text-slate-100 dark:text-zinc-800">
                  0{step.num}
                </span>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-200 bg-slate-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/40 lg:py-28">
        <div className="container-app">
          <h2 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            {t('ussd_page.features_title')}
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { Icon: WifiOff, title: t('ussd_page.feat1_title'), desc: t('ussd_page.feat1_desc') },
              { Icon: Smartphone, title: t('ussd_page.feat2_title'), desc: t('ussd_page.feat2_desc') },
              { Icon: Languages, title: t('ussd_page.feat3_title'), desc: t('ussd_page.feat3_desc') },
            ].map((feat, i) => (
              <Card key={i} className="group hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg transition-all">
                <div className="flex h-12 w-12 items-center justify-center bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400">
                  <feat.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-slate-900 dark:text-zinc-100">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                  {feat.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================
   Interactive Phone Simulator
   ============================================ */
function PhoneSimulator({ activeStep, setActiveStep }: { activeStep: number, setActiveStep: (s: number) => void }) {
  const screens = [
    {
      text: "Malawi Health AI\nCheck symptoms. Get guidance.\n\n1. English\n2. Chichewa",
      options: ["1", "2"]
    },
    {
      text: "Main menu:\n1. Check symptoms\n2. About\n3. Exit",
      options: ["1", "2", "3"]
    },
    {
      text: "Select symptom (1/3):\n1. Fever\n2. Headache\n3. Cough\n4. Vomiting\n5. Diarrhoea\n0. Next page",
      options: ["1", "2", "3", "0"]
    },
    {
      text: "Malaria (87.3% confidence)\n\nSleep under a net. Seek test\nif fever persists.\n\n1. Next\n2. Start over",
      options: ["1", "2"]
    }
  ];

  const currentScreen = screens[activeStep] || screens[0];

  return (
    <div className="relative">
      <div className="relative w-[280px] border-[10px] border-slate-900 bg-slate-100 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="bg-white p-3 pt-6 dark:bg-zinc-950 min-h-[320px] flex flex-col">
          <div className="border-b border-slate-200 pb-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
            USSD Session
          </div>
          <div className="mt-3 flex-1 font-mono text-xs leading-relaxed text-slate-800 dark:text-zinc-200 whitespace-pre-wrap">
            {currentScreen.text}
          </div>
        </div>
        
        {/* Keypad */}
        <div className="grid grid-cols-3 gap-px border-t border-slate-200 bg-slate-200 font-mono text-sm font-semibold dark:border-zinc-800 dark:bg-zinc-800">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
            <button 
              key={k} 
              onClick={() => {
                if (currentScreen.options.includes(k)) {
                  setActiveStep(activeStep + 1);
                }
              }}
              className="bg-white py-3 text-center text-slate-800 hover:bg-slate-50 active:bg-slate-200 transition-colors dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              {k}
            </button>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 bg-slate-900/10 blur-md" />
      
      {/* Reset button if at end */}
      {activeStep > 0 && (
        <button 
          onClick={() => setActiveStep(0)}
          className="absolute -right-4 top-0 bg-white p-2 text-xs text-primary-600 shadow-md border border-slate-200 rounded dark:bg-zinc-900 dark:border-zinc-800"
        >
          Reset
        </button>
      )}
    </div>
  );
}