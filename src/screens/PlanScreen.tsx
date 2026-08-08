// 24 · Plan & payment — the subscription screen.
//
// Lives in the GROWN-UP area, behind the parent gate. Design-system rule:
// "anything that leaves the app or costs money sits behind the parent gate."
// A child must never reach a price.
//
// Priced in RWF, paid by Mobile Money, and honest about what stays free —
// trust is the whole pitch to a parent.

import { useNavigate } from 'react-router-dom';
import ChunkyButton from '../components/ui/ChunkyButton';
import { useI18n } from '../i18n/context';
import type { TranslationKey } from '../i18n/translations';

const INCLUDED: TranslationKey[] = ['plan.inc1', 'plan.inc2', 'plan.inc3', 'plan.inc4'];

function Tick() {
  return (
    <span className="w-5 h-5 rounded-md bg-grass grid place-items-center flex-none">
      <span
        className="block w-[9px] h-[5px] border-l-[2.5px] border-b-[2.5px] border-white"
        style={{ transform: 'rotate(-45deg) translateY(-1px)' }}
      />
    </span>
  );
}

export default function PlanScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-forest flex flex-col">
      <header className="px-6 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/parents')}
          className="w-11 h-11 rounded-[14px] bg-forest-deep grid place-items-center text-white font-body font-black"
          aria-label={t('common.back')}
        >
          ‹
        </button>
        <div>
          <h1 className="font-body font-black text-[26px] text-white leading-tight">{t('plan.title')}</h1>
          <p className="font-body font-bold text-sm text-mint-ink mt-0.5">
{t('plan.subtitle')}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 pb-6 flex flex-col gap-4">
        {/* Price card */}
        <section className="bg-white rounded-[18px] p-6">
          <div className="flex items-baseline gap-2">
            <span className="font-body font-black text-4xl text-ink tabular-nums">2 000</span>
            <span className="font-body font-extrabold text-sm text-ink-muted">{t('plan.perMonth')}</span>
          </div>
          <p className="font-body font-bold text-xs text-ink-faint mt-1">
{t('plan.yearly')}
          </p>
          <ul className="flex flex-col gap-3 border-t border-[#EDEFEC] mt-4 pt-4">
            {INCLUDED.map((key) => (
              <li key={key} className="flex gap-3 items-center">
                <Tick />
                <span className="font-body font-bold text-[13px] text-ink-soft">{t(key)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Free tier — stated plainly, because trust is the pitch */}
        <section className="bg-forest-deep rounded-[18px] p-5">
          <h2 className="font-body font-extrabold text-[15px] text-white mb-3">{t('plan.freeTitle')}</h2>
          <p className="font-body font-bold text-[13px] leading-relaxed text-mint-ink">
{t('plan.freeBody')}
          </p>
        </section>

        {/* Schools / umudugudu */}
        <section className="flex items-center gap-3.5 bg-forest-deep rounded-[18px] p-4.5" style={{ padding: 18 }}>
          <span className="w-11 h-11 rounded-xl bg-sun grid place-items-center flex-none font-body font-black text-lg text-ink">
            S
          </span>
          <p className="font-body font-bold text-[13px] leading-snug text-[#CFEBDC]">
{t('plan.schools')}
          </p>
        </section>
      </div>

      <div className="px-6 pb-8 flex flex-col gap-3">
        <ChunkyButton
          tone="grass"
          depth={0}
          className="w-full text-xl"
          style={{ borderRadius: 16, minHeight: 62 }}
          onClick={() => navigate('/parents')}
        >
{t('plan.trial')}
        </ChunkyButton>
        <p className="font-body font-extrabold text-[13px] text-[#7FD3A5] text-center">
{t('plan.trialNote')}
        </p>
      </div>
    </div>
  );
}
