// Ku Babyeyi — the grown-up dashboard.
//
// Deliberately a different product from the child's world: blue, plain, dense,
// no mascot, no chunky play buttons, no bottom nav. A child who lands here can
// tell in half a second that it is not for them.

import { useNavigate } from 'react-router-dom';
import { ParentShell, Card } from '../components/ui/Shell';
import { useI18n } from '../i18n/context';
import { useParentData } from '../hooks/useParentData';
import { useStars } from '../hooks/useStars';
import { useSkillEvidence } from '../hooks/useSkillEvidence';
import SkillReport from '../components/parent/SkillReport';
import ActivityReport from '../components/parent/ActivityReport';
import { useProgress } from '../hooks/useProgress';

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-body font-black text-[13px] tracking-[.1em] uppercase mb-3" style={{ color: '#1565C0' }}>
      {children}
    </h2>
  );
}

export default function ParentScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { activities, weeklyDays, toggleActivity, toggleDay, progressKey, progressPercent } = useParentData();
  const { stars } = useStars();
  const { store } = useSkillEvidence();
  const { progress } = useProgress();
  // Weekday initials are language-specific — English M T W T F S S meant nothing
  // to a parent reading the rest of the screen in Kinyarwanda.
  const DAYS = t('parents.dayLetters').split(',');

  return (
    <ParentShell title={t('parents.title')} hint={t('parents.hint')}>
      <div className="flex flex-col gap-4">
        {/* Welcome */}
        <Card tone="parent">
          <p className="font-body font-black text-[13px] tracking-[.08em] uppercase" style={{ color: '#42A5F5' }}>
            {t('parents.welcome')}
          </p>
          <h2 className="font-display font-extrabold text-[24px] leading-tight mt-1" style={{ color: '#0F2E45' }}>
            {t('parents.subtitle')}
          </h2>
          <p className="font-body font-bold text-[14px] leading-relaxed mt-2" style={{ color: '#5B7A94' }}>
            {t('parents.description')}
          </p>
        </Card>

        {/* What your child can do — deliberately the FIRST thing a grown-up
            reads. It is the only section on this screen that is about the
            child rather than about the app. */}
        <Card tone="parent">
          <Label>{t('report.title')}</Label>
          <SkillReport store={store} />
        </Card>

        {/* What they have been doing — the conversation starter. A parent who
            knows what their child is into has something to ask at dinner. */}
        <Card tone="parent">
          <Label>{t('report.activityTitle')}</Label>
          <ActivityReport progress={progress} />
        </Card>

        {/* This week */}
        <div className="rounded-[20px] p-5" style={{ background: '#1565C0', color: '#fff' }}>
          <div className="flex items-end justify-between gap-3">
            <div>
              <h3 className="font-display font-extrabold text-[20px]">{t('parents.weekTitle')}</h3>
              <p className="font-body font-bold text-[13px] opacity-85 mt-0.5">{t(progressKey)}</p>
            </div>
            <div className="font-display font-extrabold text-[30px] tabular-nums">{progressPercent}%</div>
          </div>

          {/* 7 equal columns — fixed circles in a flex row overflow a 375px phone. */}
          <div className="grid grid-cols-7 gap-1 mt-4">
            {DAYS.map((d, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                aria-label={`${t('parents.day')} ${i + 1}`}
                aria-pressed={!!weeklyDays[i]}
                className="flex flex-col items-center gap-1.5 min-w-0"
                style={{ minHeight: 68 }}
              >
                <span
                  className="rounded-full grid place-items-center"
                  style={{
                    width: 40,
                    height: 40,
                    background: weeklyDays[i] ? '#FFFFFF' : 'rgba(255,255,255,.14)',
                    border: `2px solid ${weeklyDays[i] ? '#FFFFFF' : 'rgba(255,255,255,.28)'}`,
                  }}
                >
                  {weeklyDays[i] && (
                    <span
                      className="block border-l-[3px] border-b-[3px] rounded-[1px]"
                      style={{
                        width: 13,
                        height: 7,
                        borderColor: '#1565C0',
                        transform: 'rotate(-45deg) translateY(-1px)',
                      }}
                    />
                  )}
                </span>
                <span className="font-body font-black text-[11px] opacity-75">{d}</span>
              </button>
            ))}
          </div>

          <p className="font-body font-bold text-[13px] opacity-85 mt-4">
            {t('parents.stars')}: <span className="font-black tabular-nums">{stars}</span> — {t('parents.starsNote')}.
          </p>
        </div>

        {/* Do together at home */}
        <Card tone="parent">
          <Label>{t('parents.activities')}</Label>
          {([
            { key: 'song', title: 'parents.activity1.title', desc: 'parents.activity1.desc' },
            { key: 'questions', title: 'parents.activity2.title', desc: 'parents.activity2.desc' },
          ] as const).map(({ key, title, desc }) => (
            <button
              key={key}
              onClick={() => toggleActivity(key)}
              aria-pressed={!!activities[key]}
              className="w-full flex items-start gap-3 text-left rounded-[14px] p-3 mb-2"
              style={{ background: activities[key] ? '#E3F2FD' : '#F7FAFC', minHeight: 64 }}
            >
              <span
                className="rounded-[8px] grid place-items-center flex-none mt-0.5"
                style={{
                  width: 26,
                  height: 26,
                  background: activities[key] ? '#1565C0' : '#FFFFFF',
                  border: '2px solid #90CAF9',
                }}
              >
                {activities[key] && (
                  <span
                    className="block border-l-[3px] border-b-[3px] border-white rounded-[1px]"
                    style={{ width: 11, height: 6, transform: 'rotate(-45deg) translateY(-1px)' }}
                  />
                )}
              </span>
              <span className="min-w-0">
                <span className="block font-body font-black text-[15px]" style={{ color: '#0F2E45' }}>
                  {t(title)}
                </span>
                <span className="block font-body font-bold text-[13px] mt-0.5" style={{ color: '#5B7A94' }}>
                  {t(desc)}
                </span>
              </span>
            </button>
          ))}
        </Card>

        {/* What they learned */}
        <Card tone="parent">
          <Label>{t('parents.whatWelearned')}</Label>
          <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: '#213B4A' }}>
            {t('parents.learnedBody')}
          </p>
        </Card>

        <Card tone="parent">
          <Label>{t('parents.changes')}</Label>
          <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: '#213B4A' }}>
            {t('parents.changesBody')}
          </p>
        </Card>

        {/* Grown-up destinations */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/plan')}
            className="rounded-[16px] font-body font-black text-[15px]"
            style={{ minHeight: 56, background: '#1565C0', color: '#fff' }}
          >
            {t('parents.plan')}
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="rounded-[16px] font-body font-black text-[15px]"
            style={{ minHeight: 56, background: '#FFFFFF', color: '#1565C0', border: '2px solid #90CAF9' }}
          >
            {t('settings.title')}
          </button>
        </div>
      </div>
    </ParentShell>
  );
}
