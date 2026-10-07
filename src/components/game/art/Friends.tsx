// The Kina Wige picture library — Rwandan animals and things, drawn in Kina's
// style: flat colour, thick ink outlines (#10241B), rounded joins, no
// gradients. Every drawing sits in a 100 × 100 box centred on 0,0 (-50..50),
// so a game places it with one translate/scale.
//
// Used as maze characters and goals and inside puzzle scenes — one library,
// so the games look like one hand drew them. (Stickers are Microsoft's Fluent
// Emoji — see src/data/stickers.ts.)

export const INK = '#10241B';

const line = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Two-pass stroke: an ink outline, then the colour on top (horns, stalks). */
function Outlined({ d, color, width }: { d: string; color: string; width: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={width + 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const Eye = ({ x, y, r = 3 }: { x: number; y: number; r?: number }) => (
  <>
    <circle cx={x} cy={y} r={r} fill={INK} />
    <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.35} fill="#FFFFFF" />
  </>
);

// ── Animals ─────────────────────────────────────────────────────────────────

export function Cow() {
  // An inyambo: Rwanda's long-horned cow, the proudest animal in the country.
  return (
    <g transform="translate(-2 14) scale(0.8)">
      <path d="M-36 -2 q-12 8 -9 26" fill="none" {...line} />
      <circle cx={-45} cy={25} r={5} fill="#5A2E14" {...line} strokeWidth={3} />
      {[-30, -15, 12, 26].map((x) => (
        <g key={x}>
          <rect x={x} y={10} width={10} height={27} rx={4} fill="#9A4F24" {...line} />
          <rect x={x} y={31} width={10} height={6} rx={2} fill={INK} />
        </g>
      ))}
      <rect x={-40} y={-16} width={76} height={36} rx={18} fill="#B8612C" {...line} />
      <path d="M-22 -8 q10 -6 18 2 q4 10 -6 14 q-12 4 -14 -6 z" fill="#FFF4E2" />
      <path d="M8 20 q8 6 16 0" fill="#F2C9A8" {...line} strokeWidth={3} />
      <Outlined d="M28 -26 C 14 -36 4 -50 12 -64" color="#FFF1D6" width={6} />
      <Outlined d="M42 -26 C 56 -36 66 -50 58 -64" color="#FFF1D6" width={6} />
      <ellipse cx={20} cy={-20} rx={8} ry={4} transform="rotate(-25 20 -20)" fill="#9A4F24" {...line} strokeWidth={3} />
      <ellipse cx={50} cy={-20} rx={8} ry={4} transform="rotate(25 50 -20)" fill="#9A4F24" {...line} strokeWidth={3} />
      <ellipse cx={35} cy={-14} rx={14} ry={16} fill="#B8612C" {...line} />
      <ellipse cx={35} cy={-3} rx={11} ry={8} fill="#F2C9A8" {...line} />
      <circle cx={31} cy={-3} r={1.8} fill={INK} />
      <circle cx={39} cy={-3} r={1.8} fill={INK} />
      <Eye x={29} y={-17} />
      <Eye x={41} y={-17} />
    </g>
  );
}

export function Goat() {
  return (
    <g transform="translate(-2 6)">
      <path d="M-30 -6 l-8 -10 l3 14" fill="#F3EEE4" {...line} strokeWidth={3} />
      {[-26, -14, 8, 18].map((x) => (
        <g key={x}>
          <rect x={x} y={12} width={7} height={24} rx={3} fill="#E6DED0" {...line} strokeWidth={3} />
          <rect x={x} y={31} width={7} height={5} rx={2} fill={INK} />
        </g>
      ))}
      <rect x={-32} y={-10} width={60} height={30} rx={15} fill="#F3EEE4" {...line} />
      <path d="M-14 -10 q8 10 0 20 q-10 2 -12 -8 q2 -10 12 -12 z" fill="#8A5A3A" />
      <Outlined d="M26 -24 q-8 -14 -18 -14" color="#B9AFA0" width={4} />
      <Outlined d="M32 -24 q-4 -16 -14 -18" color="#B9AFA0" width={4} />
      <ellipse cx={17} cy={-14} rx={9} ry={3.5} transform="rotate(35 17 -14)" fill="#E6DED0" {...line} strokeWidth={3} />
      <path d="M22 -26 q14 -4 18 10 q2 12 -10 14 q-10 0 -12 -10 z" fill="#F3EEE4" {...line} />
      <path d="M32 0 l1 12 l5 -11" fill="#E6DED0" {...line} strokeWidth={3} />
      <Eye x={32} y={-16} r={2.6} />
      <circle cx={39} cy={-5} r={1.6} fill={INK} />
    </g>
  );
}

export function Chicken() {
  return (
    <g transform="translate(0 4)">
      <path d="M-30 -2 q-16 -18 -6 -32 q6 10 14 14 q-4 -16 6 -24 q4 14 8 20" fill="#2E8B57" {...line} />
      <rect x={-6} y={22} width={4} height={14} fill="#FFB020" />
      <rect x={6} y={22} width={4} height={14} fill="#FFB020" />
      <path d="M-10 36 h10 M2 36 h12" {...line} stroke="#E08A00" />
      <ellipse cx={0} cy={6} rx={30} ry={24} fill="#C9662E" {...line} />
      <path d="M-14 2 q10 16 24 4" fill="none" {...line} strokeWidth={3} />
      <circle cx={18} cy={-22} r={14} fill="#C9662E" {...line} />
      <path d="M10 -36 q2 -8 6 -2 q3 -8 7 0 q4 -6 6 2 q0 4 -6 4 h-8 q-6 0 -5 -4 z" fill="#E8344A" {...line} strokeWidth={3} />
      <path d="M30 -22 l10 4 l-10 4 z" fill="#FFC02E" {...line} strokeWidth={3} />
      <path d="M28 -12 q4 8 -2 10 q-4 -4 2 -10 z" fill="#E8344A" {...line} strokeWidth={2.5} />
      <Eye x={21} y={-25} r={2.6} />
    </g>
  );
}

export function Gorilla() {
  // Ingagi — the mountain gorilla of the Virunga volcanoes.
  return (
    <g transform="translate(0 4)">
      <ellipse cx={-30} cy={20} rx={12} ry={20} fill="#3B3F46" {...line} />
      <ellipse cx={30} cy={20} rx={12} ry={20} fill="#3B3F46" {...line} />
      <ellipse cx={0} cy={18} rx={30} ry={28} fill="#3B3F46" {...line} />
      <ellipse cx={0} cy={22} rx={17} ry={17} fill="#5B6069" />
      <ellipse cx={-30} cy={38} rx={10} ry={7} fill="#2A2D32" {...line} strokeWidth={3} />
      <ellipse cx={30} cy={38} rx={10} ry={7} fill="#2A2D32" {...line} strokeWidth={3} />
      <circle cx={-19} cy={-26} r={6} fill="#3B3F46" {...line} strokeWidth={3} />
      <circle cx={19} cy={-26} r={6} fill="#3B3F46" {...line} strokeWidth={3} />
      <path d="M-20 -26 q0 -26 20 -26 q20 0 20 26 q0 18 -20 20 q-20 -2 -20 -20 z" fill="#3B3F46" {...line} />
      <path d="M-14 -24 q14 -8 28 0 q2 16 -14 18 q-16 -2 -14 -18 z" fill="#9A8F87" {...line} strokeWidth={3} />
      <path d="M-15 -28 q7 -5 13 0 M2 -28 q7 -5 13 0" fill="none" {...line} strokeWidth={4} />
      <Eye x={-7} y={-26} r={2.6} />
      <Eye x={7} y={-26} r={2.6} />
      <ellipse cx={-3} cy={-17} rx={2} ry={1.6} fill={INK} />
      <ellipse cx={3} cy={-17} rx={2} ry={1.6} fill={INK} />
      <path d="M-5 -11 q5 3 10 0" fill="none" {...line} strokeWidth={2.5} />
    </g>
  );
}

export function Crane() {
  // Umusambi — the grey crowned crane, with its golden crown.
  return (
    <g transform="translate(-4 0)">
      <path d="M-4 22 l-4 26 M8 22 l4 26" {...line} strokeWidth={4} />
      <path d="M-14 48 h10 M8 48 h10" {...line} />
      <path d="M-30 4 q4 -22 30 -22 q26 2 26 22 q-4 18 -28 18 q-20 0 -28 -18 z" fill="#8E96A0" {...line} />
      <path d="M-30 4 q-10 10 -12 20 q10 -4 18 -8" fill="#3A3F45" {...line} strokeWidth={3} />
      <path d="M-8 -6 q12 -6 26 2 q-6 12 -26 6 z" fill="#FFFFFF" {...line} strokeWidth={3} />
      <path d="M16 -14 q6 -16 12 -24" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
      <path d="M16 -14 q6 -16 12 -24" fill="none" stroke="#8E96A0" strokeWidth={8} strokeLinecap="round" />
      <circle cx={30} cy={-38} r={9} fill="#3A3F45" {...line} />
      <path d="M30 -38 q6 -2 6 4 q-4 4 -8 0 z" fill="#FFFFFF" />
      <path d="M37 -38 l12 4 l-12 2 z" fill="#5B6069" {...line} strokeWidth={2.5} />
      <path d="M33 -30 q2 6 -2 8 q-3 -4 2 -8 z" fill="#E8344A" {...line} strokeWidth={2} />
      {[-30, -20, -10, 0, 10, 20].map((a) => (
        <path key={a} d={`M30 -46 l${Math.sin((a * Math.PI) / 180) * 14} ${-Math.cos((a * Math.PI) / 180) * 14}`} stroke="#E8B830" strokeWidth={3} strokeLinecap="round" />
      ))}
      <Eye x={28} y={-39} r={2.2} />
    </g>
  );
}

export function Elephant() {
  return (
    <g transform="translate(0 6)">
      {[-28, -14, 8, 20].map((x) => (
        <rect key={x} x={x} y={10} width={12} height={26} rx={5} fill="#8D96A3" {...line} />
      ))}
      <path d="M-38 -2 q-10 4 -8 16" fill="none" {...line} />
      <rect x={-38} y={-22} width={66} height={40} rx={20} fill="#9AA3AF" {...line} />
      <path d="M30 -10 q14 10 10 30 q-2 8 -8 6 q-4 -2 0 -8 q4 -14 -8 -20" fill="#9AA3AF" {...line} />
      <circle cx={24} cy={-16} r={16} fill="#9AA3AF" {...line} />
      <path d="M6 -26 q-18 -4 -18 14 q0 16 18 14 q6 -12 0 -28 z" fill="#B7BFCA" {...line} />
      <path d="M28 -4 q6 8 0 12" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" />
      <Eye x={28} y={-20} r={2.6} />
    </g>
  );
}

export function Lion() {
  const mane: string[] = [];
  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 * i) / 14;
    mane.push(`${Math.cos(a) * 40},${Math.sin(a) * 40}`);
  }
  return (
    <g>
      <g fill="#B8601F" {...line}>
        {mane.map((p, i) => {
          const [x, y] = p.split(',').map(Number);
          return <circle key={i} cx={x * 0.92} cy={y * 0.92} r={11} />;
        })}
      </g>
      <circle r={36} fill="#B8601F" />
      <circle cx={-18} cy={-20} r={8} fill="#E9A23B" {...line} />
      <circle cx={18} cy={-20} r={8} fill="#E9A23B" {...line} />
      <circle r={26} fill="#F2B544" {...line} />
      <ellipse cx={0} cy={10} rx={13} ry={10} fill="#FFE2A8" {...line} strokeWidth={3} />
      <path d="M-5 2 h10 l-5 6 z" fill="#7A3B1A" {...line} strokeWidth={2.5} />
      <path d="M0 8 v5 M0 13 q-5 4 -8 0 M0 13 q5 4 8 0" fill="none" {...line} strokeWidth={2.5} />
      <Eye x={-9} y={-6} />
      <Eye x={9} y={-6} />
    </g>
  );
}

export function Zebra() {
  return (
    <g transform="translate(-2 6)">
      <defs>
        <clipPath id="kw-zebra-body">
          <rect x={-36} y={-16} width={64} height={32} rx={16} />
        </clipPath>
      </defs>
      {[-30, -18, 8, 18].map((x) => (
        <g key={x}>
          <rect x={x} y={8} width={9} height={28} rx={4} fill="#FFFFFF" {...line} />
          <path d={`M${x} 18 h9 M${x} 26 h9`} stroke={INK} strokeWidth={3} />
        </g>
      ))}
      <path d="M-36 -4 q-10 6 -8 18" fill="none" {...line} />
      <rect x={-36} y={-16} width={64} height={32} rx={16} fill="#FFFFFF" />
      <g clipPath="url(#kw-zebra-body)" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round">
        {[-28, -18, -8, 2, 12, 22].map((x) => (
          <path key={x} d={`M${x} -18 q6 16 -2 36`} />
        ))}
      </g>
      <rect x={-36} y={-16} width={64} height={32} rx={16} fill="none" {...line} />
      <path d="M16 -10 l10 -26 q6 -10 14 -4 l8 20 q2 8 -6 10 l-10 2 z" fill="#FFFFFF" {...line} />
      <path d="M18 -18 l10 4 M22 -28 l10 4 M42 -6 q-4 2 -6 -2" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <path d="M24 -40 q-4 -8 2 -10 q4 4 2 10" fill="#FFFFFF" {...line} strokeWidth={3} />
      <path d="M18 -34 q-6 6 -4 16" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <ellipse cx={45} cy={-10} rx={6} ry={5} fill="#3A3F45" {...line} strokeWidth={3} />
      <Eye x={34} y={-26} r={2.4} />
    </g>
  );
}

export function Fish() {
  // Isambaza / tilapia from Lake Kivu.
  return (
    <g>
      <path d="M-30 0 l-18 -16 q4 16 0 32 z" fill="#2B9BD0" {...line} />
      <path d="M-8 -20 q10 -14 22 -2 z M-6 20 q10 10 18 0 z" fill="#2B9BD0" {...line} strokeWidth={3} />
      <ellipse cx={4} cy={0} rx={36} ry={22} fill="#56C1EA" {...line} />
      <path d="M-14 -8 q4 8 0 16 M-4 -10 q5 10 0 20 M6 -10 q5 10 0 20" fill="none" stroke="#2B9BD0" strokeWidth={3} strokeLinecap="round" />
      <path d="M18 -14 q-6 14 0 28" fill="none" {...line} strokeWidth={3} />
      <Eye x={26} y={-5} r={3.4} />
      <path d="M36 6 q-4 3 -8 1" fill="none" {...line} strokeWidth={2.5} />
    </g>
  );
}

// ── Things ──────────────────────────────────────────────────────────────────

export function Basket() {
  // Agaseke — the woven peace basket with its tall pointed lid.
  return (
    <g transform="translate(0 4)">
      <path d="M-26 10 q0 30 26 30 q26 0 26 -30 z" fill="#E7C27A" {...line} />
      <path d="M-22 20 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l4 4" fill="none" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-30 10 h60" {...line} strokeWidth={5} />
      <path d="M-26 10 L 0 -46 L 26 10 z" fill="#E7C27A" {...line} />
      <path d="M-15 -14 l5 -6 l5 6 l5 -6 l5 6 l5 -6 l5 6" fill="none" stroke="#C8352A" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-8 -30 l4 -4 l4 4 l4 -4 l4 4" fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-21 0 h42" stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={-47} r={4} fill="#C8352A" {...line} strokeWidth={3} />
    </g>
  );
}

export function Drum() {
  // Ingoma, with the laced cowhide head.
  return (
    <g transform="translate(0 4)">
      <path d="M-30 -24 L -22 36 h44 L 30 -24 z" fill="#A35A2A" {...line} />
      <path d="M-30 -24 l8 12 l8 -12 l8 12 l6 -12 l6 12 l8 -12 l8 12 l8 -12" fill="none" stroke="#F1E2C4" strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M-26 6 L -22 36 h44 L 26 6" fill="none" stroke="#7A3F1A" strokeWidth={0} />
      <path d="M-27 4 h54" stroke="#F1E2C4" strokeWidth={5} />
      <path d="M-27 4 h54" stroke={INK} strokeWidth={0.5} />
      <ellipse cx={0} cy={-24} rx={30} ry={9} fill="#F6EBD3" {...line} />
      <ellipse cx={-8} cy={-25} rx={7} ry={3} fill="#3A2A1E" />
      <ellipse cx={10} cy={-22} rx={5} ry={2} fill="#3A2A1E" />
    </g>
  );
}

export function Banana() {
  return (
    <g transform="rotate(-10)">
      <path d="M-34 10 q20 30 62 -6 q6 -6 2 -10 q-36 26 -60 6 z" fill="#FFD43B" {...line} />
      <path d="M-30 -2 q24 24 58 -16 q4 -6 -1 -9 q-30 28 -54 14 z" fill="#FFC02E" {...line} />
      <path d="M28 -27 l6 -8 l5 4 l-4 6 z" fill="#7A9A2E" {...line} strokeWidth={3} />
      <path d="M-34 10 l-6 2 M-30 -2 l-6 0" {...line} />
    </g>
  );
}

export function Avocado() {
  return (
    <g>
      <path d="M0 -42 q14 0 18 20 q22 18 12 42 q-8 20 -30 20 q-22 0 -30 -20 q-10 -24 12 -42 q4 -20 18 -20 z" fill="#4C7A2A" {...line} />
      <path d="M0 -32 q9 0 12 16 q18 14 10 34 q-6 14 -22 14 q-16 0 -22 -14 q-8 -20 10 -34 q3 -16 12 -16 z" fill="#D7EB8A" />
      <circle cx={0} cy={12} r={13} fill="#9A5B2E" {...line} />
      <circle cx={-4} cy={8} r={3.5} fill="#C78A55" />
    </g>
  );
}

export function Pineapple() {
  return (
    <g transform="translate(0 8)">
      <path d="M0 -22 q-4 -16 -16 -26 q12 2 16 12 q2 -14 0 -22 q8 8 4 22 q6 -10 16 -12 q-10 10 -12 26 z" fill="#3E9B43" {...line} />
      <ellipse cx={0} cy={10} rx={22} ry={30} fill="#F2A72E" {...line} />
      <g stroke="#B9671A" strokeWidth={3} strokeLinecap="round">
        <path d="M-18 -6 l30 30 M-14 -16 l30 30 M-20 10 l18 18 M-4 -20 l22 22" />
        <path d="M18 -6 l-30 30 M14 -16 l-30 30 M20 10 l-18 18 M4 -20 l-22 22" />
      </g>
      <ellipse cx={0} cy={10} rx={22} ry={30} fill="none" {...line} />
    </g>
  );
}

export function Churn() {
  // Igisabo — the milk gourd, for making butter.
  return (
    <g transform="translate(0 2)">
      <path d="M-6 -30 q-2 12 -14 22 q-14 12 -12 30 q4 20 32 20 q28 0 32 -20 q2 -18 -12 -30 q-12 -10 -14 -22 z" fill="#D9A45E" {...line} />
      <path d="M-28 14 q28 10 56 0" fill="none" stroke="#7A4A1E" strokeWidth={4} />
      <path d="M-26 22 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4 l6 -4 l6 4" fill="none" stroke="#7A4A1E" strokeWidth={3} strokeLinejoin="round" />
      <rect x={-8} y={-44} width={16} height={16} rx={5} fill="#E9DCC4" {...line} />
    </g>
  );
}

export function Bicycle() {
  return (
    <g transform="translate(0 8)">
      <circle cx={-24} cy={14} r={18} fill="none" {...line} strokeWidth={5} />
      <circle cx={24} cy={14} r={18} fill="none" {...line} strokeWidth={5} />
      <circle cx={-24} cy={14} r={4} fill={INK} />
      <circle cx={24} cy={14} r={4} fill={INK} />
      <path d="M-24 14 L -8 -12 L 16 -12 L 24 14 M-8 -12 L 2 14 L 16 -12 M2 14 L -24 14" fill="none" stroke="#E8344A" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M-14 -20 h14" {...line} strokeWidth={6} />
      <path d="M-8 -12 l-2 -8" {...line} />
      <path d="M16 -12 l4 -12 h8" fill="none" {...line} />
    </g>
  );
}

export function House() {
  return (
    <g transform="translate(0 4)">
      <rect x={-32} y={-8} width={64} height={46} rx={4} fill="#F2D3A0" {...line} />
      <path d="M-42 -6 L 0 -42 L 42 -6 z" fill="#C8552E" {...line} />
      <path d="M-30 -14 h60 M-20 -24 h40" stroke="#9A3A1C" strokeWidth={3} />
      <rect x={-8} y={10} width={16} height={28} rx={3} fill="#7A4A1E" {...line} />
      <rect x={-26} y={4} width={13} height={13} rx={2} fill="#9ED8F5" {...line} strokeWidth={3} />
      <rect x={13} y={4} width={13} height={13} rx={2} fill="#9ED8F5" {...line} strokeWidth={3} />
      <circle cx={4} cy={25} r={1.8} fill="#FFC02E" />
    </g>
  );
}

export function SunFace() {
  return (
    <g>
      <g stroke={INK} strokeWidth={4} fill="#FFC02E" strokeLinejoin="round">
        {Array.from({ length: 10 }, (_, i) => (
          <path key={i} d="M-7 -30 L 0 -46 L 7 -30 z" transform={`rotate(${i * 36})`} />
        ))}
      </g>
      <circle r={30} fill="#FFD43B" {...line} />
      <circle cx={-16} cy={6} r={5} fill="#FF9E6E" opacity={0.7} />
      <circle cx={16} cy={6} r={5} fill="#FF9E6E" opacity={0.7} />
      <Eye x={-9} y={-4} />
      <Eye x={9} y={-4} />
      <path d="M-9 8 q9 9 18 0" fill="none" {...line} />
    </g>
  );
}

export function Mango() {
  return (
    <g>
      <path d="M4 -40 q30 4 32 34 q2 30 -30 38 q-32 6 -38 -24 q-4 -26 16 -40 q10 -8 20 -8 z" fill="#FFB020" {...line} />
      <path d="M-20 -10 q8 -16 24 -18" fill="none" stroke="#FFE08A" strokeWidth={5} strokeLinecap="round" />
      <path d="M8 -36 q-8 22 6 50" fill="none" stroke="#E07B00" strokeWidth={3} opacity={0.6} />
      <path d="M4 -40 q6 -10 14 -10 q-2 10 -14 10 z" fill="#3E9B43" {...line} strokeWidth={3} />
    </g>
  );
}

export function Flower() {
  return (
    <g>
      <path d="M0 10 q-4 20 0 38" fill="none" stroke="#2E8B57" strokeWidth={6} strokeLinecap="round" />
      <path d="M0 34 q-16 -12 -22 -2 q10 8 22 2 z" fill="#3E9B43" {...line} strokeWidth={3} />
      <g fill="#FF6B9A" {...line}>
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={0} cy={-18} rx={10} ry={15} transform={`rotate(${i * 60})`} />
        ))}
      </g>
      <circle r={11} fill="#FFC02E" {...line} />
    </g>
  );
}
