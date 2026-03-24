import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Home, Eye, Target, Check, Hourglass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useParentData } from '../hooks/useParentData';
import { images } from '../assets/images';
import BottomNav from '../components/ui/BottomNav';

export default function ParentScreen() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const { activities, weeklyDays, toggleActivity, toggleDay, completedDays, progressMessage, progressPercent } = useParentData();

  const toggleLanguage = () => {
    const langs: ('KN' | 'EN' | 'FR')[] = ['KN', 'EN', 'FR'];
    const nextLang = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(nextLang);
  };

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[#FFF8E7] text-on-background pb-24">
      <header className="w-full top-0 sticky z-40 bg-[#FFF8E7]">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="hover:bg-surface-container-highest/20 transition-colors active:scale-95 p-2 rounded-full">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="font-headline font-bold text-xl tracking-tight text-primary">
              {t('parents.title')}
            </h1>
          </div>
          <button onClick={toggleLanguage} className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
            <span className="text-xs font-bold text-primary">{language}</span>
          </button>
        </div>
        <div className="bg-[#cdffe2] h-[1px] opacity-15" />
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center gap-8 bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-tertiary-fixed/30 px-4 py-1 rounded-full text-tertiary font-bold text-sm">
              <Sparkles className="w-4 h-4 fill-current" />
              {t('parents.welcome')}
            </div>
            <h2 className="font-nunito text-3xl font-extrabold text-on-surface leading-tight">
              {t('parents.subtitle')}
            </h2>
            <p className="font-nunito text-lg text-on-surface-variant leading-relaxed">
              {t('parents.description')}
            </p>
          </div>
          <div className="w-32 h-32 md:w-48 md:h-48 relative shrink-0">
            <div className="absolute inset-0 bg-primary-fixed rounded-full opacity-20 scale-110" />
            <img src={images.parentChild} alt="Parent and child" className="w-full h-full object-cover rounded-full border-4 border-surface-container-lowest" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-nunito text-2xl font-bold text-primary">{t('parents.episode1')}</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Active Lesson</span>
          </div>
          <div className="bg-surface-container-low rounded-lg overflow-hidden space-y-1">
            <details className="group bg-surface-container-lowest" open>
              <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <Target className="w-5 h-5" />
                </div>
                <span className="font-nunito text-lg font-bold flex-1">{t('parents.whatWelearned')}</span>
              </summary>
              <div className="px-20 pb-8 font-nunito text-on-surface-variant leading-relaxed">
                Today's session focused on the essential steps of hygiene. Your child learned how germs spread and why soap is our best friend in keeping our family healthy.
              </div>
            </details>

            <details className="group bg-surface-container-lowest">
              <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <Home className="w-5 h-5 fill-current" />
                </div>
                <span className="font-nunito text-lg font-bold flex-1">{t('parents.activities')}</span>
              </summary>
              <div className="px-20 pb-8 space-y-4 font-nunito">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-transparent hover:border-primary/20 transition-all">
                  <input
                    type="checkbox"
                    checked={!!activities['song']}
                    onChange={() => toggleActivity('song')}
                    className="w-6 h-6 rounded border-outline text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">Indirimbo y'amaboko</h4>
                    <p className="text-sm text-on-surface-variant italic">5 min &bull; Sing together during handwashing</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-container-low border border-transparent hover:border-primary/20 transition-all">
                  <input
                    type="checkbox"
                    checked={!!activities['questions']}
                    onChange={() => toggleActivity('questions')}
                    className="w-6 h-6 rounded border-outline text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-on-surface">Ibibazo ku dupfunyi</h4>
                    <p className="text-sm text-on-surface-variant italic">5 min &bull; Ask: "Where do germs hide?"</p>
                  </div>
                </div>
              </div>
            </details>

            <details className="group bg-surface-container-lowest">
              <summary className="flex items-center gap-4 p-6 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                  <Eye className="w-5 h-5 fill-current" />
                </div>
                <span className="font-nunito text-lg font-bold flex-1">{t('parents.changes')}</span>
              </summary>
              <div className="px-20 pb-8 font-nunito text-on-surface-variant leading-relaxed">
                Look for your child initiating handwashing without being asked, or reminding others to use soap. This shows they are internalizing the value of hygiene!
              </div>
            </details>
          </div>
        </section>

        <section className="bg-[#1B4332] text-white p-8 rounded-lg space-y-6">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h3 className="font-nunito text-xl font-bold">Incamake y'icyumweru</h3>
              <p className="text-primary-fixed opacity-90">{progressMessage}</p>
            </div>
            <div className="font-nunito text-3xl font-black text-tertiary-fixed">{progressPercent}%</div>
          </div>
          <div className="flex justify-between items-center gap-2">
            {dayLabels.map((day, i) => (
              <button key={day} onClick={() => toggleDay(i)} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${weeklyDays[i] ? 'bg-primary-container border-primary-fixed' : 'bg-white/10 border-white/20'}`}>
                  {weeklyDays[i] && <Check className="w-5 h-5" />}
                </div>
                <span className="text-[10px] uppercase font-bold opacity-60">{day}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="text-center py-10 opacity-60 space-y-4">
          <Hourglass className="w-10 h-10 text-primary mx-auto" />
          <p className="font-nunito font-bold text-primary">More episodes coming soon</p>
        </section>
      </main>

      <BottomNav />
    </motion.div>
  );
}
