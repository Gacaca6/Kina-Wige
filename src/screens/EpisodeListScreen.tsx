import React from 'react';
import { motion } from 'motion/react';
import { Star, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/context';
import { useStars } from '../hooks/useStars';
import { images } from '../assets/images';
import BottomNav from '../components/ui/BottomNav';

export default function EpisodeListScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { stars } = useStars();

  const lockedEpisodes = [
    { title: "Menya Ibiryo Byiza", category: "\u{1F957} Imirire", teaser: "Learning about healthy food choices" },
    { title: "Tubyigane!", category: "\u{1F91D} Imyitwarire", teaser: "Sharing, kindness, and taking turns" },
    { title: "Barira Amenyo!", category: "\u{1FAE7} Isuku", teaser: "Daily tooth brushing habits" },
    { title: "Tubareho!", category: "\u{1F522} Kubara", teaser: "Counting 1\u201310 with Keza and Hirwa" },
    { title: "Amazina y'Amabara", category: "\u{1F3A8} Kwiga", teaser: "Learning colors in Kinyarwanda" },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-screen pb-24">
      <header className="bg-surface flex justify-between items-center w-full px-6 py-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-primary font-headline tracking-tight">{t('home.episodes')}</h1>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">1/6</div>
      </header>

      <main className="px-6 py-6 max-w-lg mx-auto space-y-6">
        {/* Active Episode 1 */}
        <button
          onClick={() => navigate('/episode/1')}
          className="group bg-white rounded-2xl p-2 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20"
        >
          <div className="aspect-video rounded-xl overflow-hidden relative mb-3">
            <img src={images.episode1Thumb} alt="Karaba Amaboko" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="px-2 pb-2">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-headline font-bold text-xl text-primary">Karaba Amaboko!</h4>
              <div className="bg-accent/20 px-2 py-1 rounded-full text-xs font-bold text-accent-warm flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> {stars > 0 ? '1/1' : '0/1'}
              </div>
            </div>
            <span className="text-sm font-bold text-secondary mb-3 block">{'\u{1FAE7}'} Isuku</span>
            <div className="w-full h-2 bg-surface-warm rounded-full overflow-hidden">
              <div className={`h-full bg-accent rounded-full ${stars > 0 ? 'w-full' : 'w-[5%]'}`} />
            </div>
          </div>
        </button>

        {/* Active Episode 2 (Combined Clip) */}
        <button
          onClick={() => navigate('/episode/1')}
          className="group bg-white rounded-2xl p-2 shadow-lg hover:scale-[1.02] transition-transform duration-300 text-left w-full border-2 border-transparent hover:border-primary/20"
        >
          <div className="aspect-video rounded-xl overflow-hidden relative mb-3">
            <img src={images.episode2Thumb} alt="Gukaraba no Kurya" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PlayCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="px-2 pb-2">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-headline font-bold text-xl text-primary">Gukaraba no Kurya</h4>
              <div className="bg-accent/20 px-2 py-1 rounded-full text-xs font-bold text-accent-warm flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" /> 0/1
              </div>
            </div>
            <span className="text-sm font-bold text-secondary mb-3 block">{'\u{1F957}'} Imirire & {'\u{1FAE7}'} Isuku</span>
            <div className="w-full h-2 bg-surface-warm rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[0%] rounded-full" />
            </div>
          </div>
        </button>

        {/* Locked Episodes */}
        {lockedEpisodes.map((ep, i) => (
          <div key={i} className="bg-white/50 rounded-2xl p-2 border-2 border-dashed border-primary/20 grayscale opacity-70 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 z-10 flex flex-col items-center justify-center backdrop-blur-[1px]">
              <div className="bg-dark/80 text-white p-3 rounded-full mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <span className="font-headline font-bold text-dark bg-white/80 px-4 py-1 rounded-full">{t('coming_soon')}</span>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden relative bg-surface-warm mb-3" />
            <div className="px-2 pb-2">
              <h4 className="font-headline font-bold text-xl text-dark mb-1">{ep.title}</h4>
              <span className="text-sm font-bold text-dark/60 block mb-1">{ep.category}</span>
              <p className="text-sm text-dark/50">{ep.teaser}</p>
            </div>
          </div>
        ))}
      </main>
      <BottomNav />
    </motion.div>
  );
}
