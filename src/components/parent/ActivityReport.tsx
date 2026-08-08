// What your child has actually been doing — and what they love.
//
// SkillReport answers "what can my child do?". This answers a different and,
// for most parents, more immediately useful question: "what is my child into
// right now?"
//
// That is the difference between a report card and a conversation starter. A
// parent who knows their daughter has played the counting game nine times has
// something to say at dinner — and §15.2 is explicit that our job is to CREATE
// those exchanges, not to replace them.
//
// Same three rules as SkillReport (§13.1): no scores, no gaps, no jargon. Play
// counts are not a score — they are what happened, and a bigger number is not a
// better child. They are ordered by count purely so the favourite is on top.

import { useI18n } from '../../i18n/context';
import { games } from '../../data/games';
import { episodes } from '../../data/episodes';
import { comics } from '../../data/comics';

interface Progress {
  episodesWatched: Record<string, true>;
  gamesCompleted: Record<string, number>;
  comicsRead: Record<string, true>;
  lessonsCompleted: Record<string, number>;
}

export default function ActivityReport({ progress }: { progress: Progress }) {
  const { t, language } = useI18n();

  const playedGames = games
    .map((g) => ({ title: g.title[language], emoji: g.emoji, count: progress.gamesCompleted[g.id] ?? 0 }))
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count);

  const watched = episodes
    .filter((e) => progress.episodesWatched[e.id])
    .map((e) => ({ title: e.title[language], emoji: '🎬' }));

  const read = comics
    .filter((c) => progress.comicsRead[c.id])
    .map((c) => ({ title: c.title[language], emoji: '📖' }));

  const nothingYet = playedGames.length === 0 && watched.length === 0 && read.length === 0;

  if (nothingYet) {
    return (
      <p className="font-body font-bold text-[14px] leading-relaxed" style={{ color: '#5B7A94' }}>
        {t('report.activityEmpty')}
      </p>
    );
  }

  // The favourite is simply the most-played game. Naming it gives a parent one
  // concrete thing to ask about, which is the entire point of this card.
  const favourite = playedGames[0];

  return (
    <div className="flex flex-col gap-4">
      {favourite && (
        <div className="rounded-[16px] p-4" style={{ background: '#E3F2FD' }}>
          <p className="font-body font-black text-[12px] tracking-[.08em] uppercase" style={{ color: '#1565C0' }}>
            {t('report.favourite')}
          </p>
          <p className="font-body font-black text-[19px] mt-1" style={{ color: '#0F2E45' }}>
            {favourite.emoji} {favourite.title}
          </p>
          <p className="font-body font-bold text-[13px] mt-1.5" style={{ color: '#3E6D8A' }}>
            {favourite.count} {t('report.times')} · {t('report.talkAbout')}
          </p>
        </div>
      )}

      {playedGames.length > 0 && (
        <Section title={t('report.games')}>
          {playedGames.map((g) => (
            <Row key={g.title} emoji={g.emoji} title={g.title} note={`${g.count} ${t('report.times')}`} />
          ))}
        </Section>
      )}

      {watched.length > 0 && (
        <Section title={t('report.episodes')}>
          {watched.map((e) => (
            <Row key={e.title} emoji={e.emoji} title={e.title} />
          ))}
        </Section>
      )}

      {read.length > 0 && (
        <Section title={t('report.books')}>
          {read.map((c) => (
            <Row key={c.title} emoji={c.emoji} title={c.title} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-body font-black text-[12px] tracking-[.08em] uppercase mb-2" style={{ color: '#42A5F5' }}>
        {title}
      </h3>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function Row({ emoji, title, note }: { emoji: string; title: string; note?: string }) {
  return (
    <li className="flex items-center gap-3 rounded-[14px] p-3" style={{ background: '#F7FAFC' }}>
      <span style={{ fontSize: 20, lineHeight: 1.2 }} aria-hidden>
        {emoji}
      </span>
      <span className="flex-1 min-w-0 font-body font-black text-[14px]" style={{ color: '#0F2E45' }}>
        {title}
      </span>
      {note && (
        <span className="font-body font-bold text-[13px] flex-none" style={{ color: '#3E6D8A' }}>
          {note}
        </span>
      )}
    </li>
  );
}
