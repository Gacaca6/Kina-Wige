// Shapes for Imiterere n'Amabara, and the board they fit into. The board is
// framed in imigongo — the black, white and red geometric art from the east of
// Rwanda — so a shape-sorter becomes something only Kina Wige would have.

import { INK } from './Friends';

export type ShapeKind = 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart';

export const SHAPE_COLORS: Record<string, { fill: string; deep: string }> = {
  red: { fill: '#FF6B4A', deep: '#CC4A2E' },
  blue: { fill: '#35A7E8', deep: '#1D7BB3' },
  yellow: { fill: '#FFC02E', deep: '#D89A00' },
  green: { fill: '#2FBF6B', deep: '#1E8C4C' },
  purple: { fill: '#9B6BFF', deep: '#6F43C9' },
  pink: { fill: '#FF8FB8', deep: '#E0608F' },
};

/** Outline of a shape centred on 0,0, about `s` across. */
export function shapePath(kind: ShapeKind, s = 80): string {
  const h = s / 2;
  switch (kind) {
    case 'circle':
      return `M0 ${-h} A${h} ${h} 0 1 1 0 ${h} A${h} ${h} 0 1 1 0 ${-h} Z`;
    case 'square': {
      const r = s * 0.12;
      const a = h * 0.92;
      return `M${-a + r} ${-a} H${a - r} Q${a} ${-a} ${a} ${-a + r} V${a - r} Q${a} ${a} ${a - r} ${a} H${-a + r} Q${-a} ${a} ${-a} ${a - r} V${-a + r} Q${-a} ${-a} ${-a + r} ${-a} Z`;
    }
    case 'triangle': {
      const top = -h * 1.02;
      const bot = h * 0.82;
      const w = h * 1.08;
      return `M0 ${top} L${w} ${bot} L${-w} ${bot} Z`;
    }
    case 'rectangle': {
      const w = h * 1.25;
      const v = h * 0.62;
      const r = s * 0.1;
      return `M${-w + r} ${-v} H${w - r} Q${w} ${-v} ${w} ${-v + r} V${v - r} Q${w} ${v} ${w - r} ${v} H${-w + r} Q${-w} ${v} ${-w} ${v - r} V${-v + r} Q${-w} ${-v} ${-w + r} ${-v} Z`;
    }
    case 'star': {
      const pts: string[] = [];
      for (let i = 0; i < 10; i++) {
        const a = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? h * 1.08 : h * 0.5;
        pts.push(`${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r + h * 0.08).toFixed(1)}`);
      }
      return `M${pts.join(' L')} Z`;
    }
    case 'heart': {
      const k = h / 40;
      return `M0 ${36 * k} C${-50 * k} ${4 * k} ${-46 * k} ${-38 * k} ${-20 * k} ${-38 * k} C${-8 * k} ${-38 * k} 0 ${-28 * k} 0 ${-20 * k} C0 ${-28 * k} ${8 * k} ${-38 * k} ${20 * k} ${-38 * k} C${46 * k} ${-38 * k} ${50 * k} ${4 * k} 0 ${36 * k} Z`;
    }
  }
}

/** Where the face sits inside each shape. */
const FACE_Y: Record<ShapeKind, number> = { circle: 0, square: 0, triangle: 14, rectangle: 0, star: 6, heart: -6 };

export function ShapePiece({ kind, color, happy = false }: { kind: ShapeKind; color: string; happy?: boolean }) {
  const c = SHAPE_COLORS[color] ?? SHAPE_COLORS.blue;
  const d = shapePath(kind);
  const fy = FACE_Y[kind];
  return (
    <g>
      <path d={d} transform="translate(0 6)" fill={c.deep} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d={d} fill={c.fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d={shapePath(kind, 56)} transform="translate(-6 -8)" fill="#FFFFFF" opacity={0.18} />
      <circle cx={-9} cy={fy - 3} r={4} fill={INK} />
      <circle cx={9} cy={fy - 3} r={4} fill={INK} />
      <circle cx={-7.6} cy={fy - 4.6} r={1.4} fill="#FFFFFF" />
      <circle cx={10.4} cy={fy - 4.6} r={1.4} fill="#FFFFFF" />
      {happy ? (
        <path d={`M-9 ${fy + 5} q9 10 18 0 z`} fill="#E8607A" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      ) : (
        <path d={`M-7 ${fy + 6} q7 6 14 0`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
    </g>
  );
}

/** A cut-out in the board. A coloured rim means "this colour only". */
export function Hole({ kind, color }: { kind: ShapeKind; color?: string }) {
  const d = shapePath(kind, 86);
  const rim = color ? SHAPE_COLORS[color]?.fill : undefined;
  return (
    <g>
      {rim && <path d={shapePath(kind, 104)} fill={rim} stroke={INK} strokeWidth={3} strokeLinejoin="round" />}
      <path d={d} fill="#4A2E17" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d={shapePath(kind, 70)} transform="translate(3 6)" fill="#2E1B0C" opacity={0.7} />
    </g>
  );
}

/** The wooden board, framed in imigongo. */
export function Board({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const band = 18;
  const zig: string[] = [];
  const step = 18;
  // top and bottom bands: zigzag triangles
  for (let i = 0; i * step < w; i++) {
    const x0 = x + i * step;
    zig.push(`M${x0} ${y + band} L${x0 + step / 2} ${y + 3} L${x0 + step} ${y + band} Z`);
    zig.push(`M${x0} ${y + h - band} L${x0 + step / 2} ${y + h - 3} L${x0 + step} ${y + h - band} Z`);
  }
  for (let j = 1; (j + 1) * step < h - band; j++) {
    const y0 = y + j * step;
    zig.push(`M${x + band} ${y0} L${x + 3} ${y0 + step / 2} L${x + band} ${y0 + step} Z`);
    zig.push(`M${x + w - band} ${y0} L${x + w - 3} ${y0 + step / 2} L${x + w - band} ${y0 + step} Z`);
  }
  return (
    <g aria-hidden>
      <rect x={x} y={y + 8} width={w} height={h} rx={26} fill="#8A5A2E" />
      <rect x={x} y={y} width={w} height={h} rx={26} fill="#1F1A17" stroke={INK} strokeWidth={4} />
      <clipPath id="kw-board-clip">
        <rect x={x} y={y} width={w} height={h} rx={26} />
      </clipPath>
      <g clipPath="url(#kw-board-clip)">
        <path d={zig.join(' ')} fill="#F4EBDD" />
      </g>
      <rect x={x + band + 4} y={y + band + 4} width={w - 2 * band - 8} height={h - 2 * band - 8} rx={16} fill="#D69A5B" stroke="#C0392B" strokeWidth={5} />
      {[0.22, 0.48, 0.74].map((f) => (
        <path
          key={f}
          d={`M${x + band + 14} ${y + h * f} q${(w - 2 * band) / 3} -10 ${(w - 2 * band) * 0.6} 0 t${(w - 2 * band) * 0.3} 4`}
          fill="none"
          stroke="#C4874A"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/** A banana leaf that has blown over a hole — move it first (Busy Shapes' obstacles). */
export function Leaf() {
  return (
    <g>
      <path d="M-62 26 Q-30 -54 64 -30 Q34 46 -62 26 Z" fill="#3E9B43" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-56 22 Q0 -8 58 -28" fill="none" stroke="#2C7A33" strokeWidth={4} strokeLinecap="round" />
      {[-30, -8, 14, 34].map((x) => (
        <path key={x} d={`M${x} ${-x * 0.3 + 4} l-10 -22 M${x} ${-x * 0.3 + 4} l8 20`} stroke="#2C7A33" strokeWidth={2.5} strokeLinecap="round" />
      ))}
    </g>
  );
}
