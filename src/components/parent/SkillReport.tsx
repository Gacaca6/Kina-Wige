// What your child can do — the parent-facing half of assessment.
//
// This component is the whole reason the evidence layer exists. Architecture
// §13.2: "The PARENT is the audience for it — not us."
//
// Three rules govern everything here, and they are easier to break than to keep:
//
//   1. NEVER a number. No percentage, no score, no "12 of 20 skills". A number
//      invites a parent to compare their child to someone else's, which is the
//      exact thing §13.1 forbids. Bands and plain sentences only.
//   2. NEVER a gap. We show what a child CAN do. We do not list what they
//      cannot — a parent reading a deficit list is not helped, and a
//      three-year-old has not failed at anything.
//   3. NEVER jargon. `PARENT_WORDING`, not `statement`. "counts five things and
//      says how many", not "cardinality to 5".
//
// Ordering is deliberate: strongest first. The first thing a parent reads about
// their child should be something the child has genuinely mastered.

import { useI18n } from '../../i18n/context';
import type { TranslationKey } from '../../i18n/translations';
import {
  BANDS,
  DOMAINS,
  PARENT_WORDING,
  SKILLS,
  type BandId,
  type DomainId,
  type SkillId,
} from '../../data/curriculum';
import { bandFor, type EvidenceStore } from '../../hooks/useSkillEvidence';

const BAND_PHRASE: Record<BandId, TranslationKey> = {
  emerging: 'report.band.emerging',
  developing: 'report.band.developing',
  demonstrated: 'report.band.demonstrated',
  applying: 'report.band.applying',
};

/** Strongest first — a parent should meet their child's best work first. */
const BAND_RANK: Record<BandId, number> = {
  applying: 0,
  demonstrated: 1,
  developing: 2,
  emerging: 3,
};

const BAND_ICON: Record<BandId, string> = Object.fromEntries(
  BANDS.map((b) => [b.id, b.icon]),
) as Record<BandId, string>;

export default function SkillReport({ store }: { store: EvidenceStore }) {
  const { t, language } = useI18n();

  // Only skills with real evidence, and only those we can say in a parent's
  // own words. The build check guarantees the second condition holds for
  // anything reachable, so this filter should never actually drop a skill —
  // it is here so a missed one degrades into silence rather than into jargon.
  const rows = (Object.keys(store) as SkillId[])
    .map((id) => ({ id, band: bandFor(store[id]) }))
    .filter((r): r is { id: SkillId; band: BandId } => r.band !== null)
    .filter((r) => Boolean(PARENT_WORDING[r.id]))
    .sort((a, b) => BAND_RANK[a.band] - BAND_RANK[b.band]);

  /** Off-screen challenges a grown-up marked done. */
  const challengesDone = (Object.values(store) as EvidenceStore[SkillId][]).reduce(
    (n, attempts) => n + (attempts ?? []).filter((a) => a.source.startsWith('offline:')).length,
    0,
  );

  if (rows.length === 0) {
    return (
      <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: '#5B7A94' }}>
        {t('report.empty')}
      </p>
    );
  }

  // Group into domains so a parent sees breadth — "she is doing well at numbers
  // AND at looking after herself" — rather than one undifferentiated list.
  const byDomain = new Map<DomainId, typeof rows>();
  for (const row of rows) {
    const d = SKILLS[row.id].domain;
    byDomain.set(d, [...(byDomain.get(d) ?? []), row]);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-body font-bold text-[13px] leading-relaxed" style={{ color: '#5B7A94' }}>
        {t('report.hint')}
      </p>

      {/* Domains are ordered by the child's BEST band inside each one, not by
          D1–D6. Sorting rows without sorting groups just hides the strongest
          work under whichever domain happens to come first in the taxonomy. */}
      {DOMAINS.filter((d) => byDomain.has(d.id))
        .sort((a, b) => {
          const best = (d: DomainId) =>
            Math.min(...(byDomain.get(d) ?? []).map((r) => BAND_RANK[r.band]));
          return best(a.id) - best(b.id);
        })
        .map((domain) => (
        <div key={domain.id}>
          <h3 className="font-body font-black text-[12px] tracking-[.08em] uppercase mb-2" style={{ color: '#42A5F5' }}>
            {domain.name}
          </h3>
          <ul className="flex flex-col gap-2">
            {(byDomain.get(domain.id) ?? []).map(({ id, band }) => (
              <li
                key={id}
                className="flex items-start gap-3 rounded-[14px] p-3"
                style={{ background: '#F7FAFC' }}
              >
                <span style={{ fontSize: 20, lineHeight: 1.2 }} aria-hidden>
                  {BAND_ICON[band]}
                </span>
                <span className="min-w-0">
                  {/* The sentence reads as one thought:
                      "can do this on their own — counts five things and says how many" */}
                  <span className="block font-body font-black text-[14px]" style={{ color: '#0F2E45' }}>
                    {t(BAND_PHRASE[band])}
                  </span>
                  <span className="block font-body font-bold text-[14px] mt-0.5" style={{ color: '#3E6D8A' }}>
                    {PARENT_WORDING[id]?.[language]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {challengesDone > 0 && (
        <p className="font-body font-black text-[14px]" style={{ color: '#1565C0' }}>
          🌱 {t('report.challenges')}: {challengesDone}
        </p>
      )}

      {/* The promise, stated where it matters most — next to the data itself. */}
      <p className="font-body font-bold text-[12px] leading-relaxed" style={{ color: '#5B7A94' }}>
        {t('report.private')}
      </p>
    </div>
  );
}
