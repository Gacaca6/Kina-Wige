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

const INCLUDED = [
  'All 12 units, 40 stories, offline download',
  'Printable flashcards every week',
  'Mobile Money · MTN & Airtel',
  'Cancel any time, no questions',
];

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

  return (
    <div className="min-h-screen bg-forest flex flex-col">
      <header className="px-6 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/parents')}
          className="w-11 h-11 rounded-[14px] bg-forest-deep grid place-items-center text-white font-body font-black"
          aria-label="Back to parent area"
        >
          ‹
        </button>
        <div>
          <h1 className="font-body font-black text-[26px] text-white leading-tight">Kina Wige Family</h1>
          <p className="font-body font-bold text-sm text-mint-ink mt-0.5">
            Up to 4 children · all three languages
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto px-6 pb-6 flex flex-col gap-4">
        {/* Price card */}
        <section className="bg-white rounded-[18px] p-6">
          <div className="flex items-baseline gap-2">
            <span className="font-body font-black text-4xl text-ink tabular-nums">2 000</span>
            <span className="font-body font-extrabold text-sm text-ink-muted">RWF / month</span>
          </div>
          <p className="font-body font-bold text-xs text-ink-faint mt-1">
            Or 20 000 RWF a year · 2 months free
          </p>
          <ul className="flex flex-col gap-3 border-t border-[#EDEFEC] mt-4 pt-4">
            {INCLUDED.map((line) => (
              <li key={line} className="flex gap-3 items-center">
                <Tick />
                <span className="font-body font-bold text-[13px] text-ink-soft">{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Free tier — stated plainly, because trust is the pitch */}
        <section className="bg-forest-deep rounded-[18px] p-5">
          <h2 className="font-body font-extrabold text-[15px] text-white mb-3">Free forever</h2>
          <p className="font-body font-bold text-[13px] leading-relaxed text-mint-ink">
            Unit 1, five stories and the whole play hub stay free. No ads and no timers in the
            free tier either.
          </p>
        </section>

        {/* Schools / umudugudu */}
        <section className="flex items-center gap-3.5 bg-forest-deep rounded-[18px] p-4.5" style={{ padding: 18 }}>
          <span className="w-11 h-11 rounded-xl bg-sun grid place-items-center flex-none font-body font-black text-lg text-ink">
            S
          </span>
          <p className="font-body font-bold text-[13px] leading-snug text-[#CFEBDC]">
            Schools and umudugudu groups: 10 children for 15 000 RWF a month.
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
          Start 14-day trial
        </ChunkyButton>
        <p className="font-body font-extrabold text-[13px] text-[#7FD3A5] text-center">
          No card needed · we remind you before it ends
        </p>
      </div>
    </div>
  );
}
