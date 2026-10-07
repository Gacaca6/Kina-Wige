// Stroke data for Andika (tracing). Every character is drawn in a 100 × 100
// box: baseline y = 85, lowercase x-height y = 41, capitals and numbers from
// y = 15. Each stroke is an SVG path IN WRITING ORDER AND DIRECTION — the game
// checks the child follows it start to end, which is what makes this
// handwriting practice and not colouring-in.
//
// Letter forms follow simple school print. The owner asked for both lowercase
// and capitals ("do both"); the five vowels come first because they are the
// first unit of Kinyarwanda reading (inyajwi).

export type TraceSetId = 'vowels' | 'capitals' | 'numbers1' | 'numbers2';

export interface TraceChar {
  id: string;
  /** What is shown on the tile and spoken aloud by the grown-up. */
  label: string;
  strokes: string[];
  /** For numbers: how many things to count in the celebration. */
  count?: number;
}

const ring = (cx: number, cy: number, rx: number, ry: number) =>
  // Starts at the top and goes anticlockwise, the way children are taught "o".
  `M${cx} ${cy - ry} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx} ${cy + ry} ` +
  `A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} A${rx} ${ry} 0 0 0 ${cx} ${cy - ry}`;

export const TRACE_SETS: Record<TraceSetId, TraceChar[]> = {
  vowels: [
    { id: 'a', label: 'a', strokes: ['M69 52 A22 22 0 1 0 69 74', 'M72 41 V85'] },
    { id: 'e', label: 'e', strokes: ['M28 63 H72 A22 22 0 1 0 66 79'] },
    { id: 'i', label: 'i', strokes: ['M50 42 V85', 'M50 24 V25'] },
    { id: 'o', label: 'o', strokes: [ring(50, 63, 22, 22)] },
    { id: 'u', label: 'u', strokes: ['M30 41 V64 A20 20 0 0 0 70 64 V41', 'M70 41 V85'] },
  ],
  capitals: [
    { id: 'A', label: 'A', strokes: ['M50 15 L22 85', 'M50 15 L78 85', 'M33 58 H67'] },
    { id: 'E', label: 'E', strokes: ['M30 15 V85', 'M30 15 H72', 'M30 50 H64', 'M30 85 H72'] },
    { id: 'I', label: 'I', strokes: ['M50 15 V85', 'M34 15 H66', 'M34 85 H66'] },
    { id: 'O', label: 'O', strokes: [ring(50, 50, 27, 35)] },
    { id: 'U', label: 'U', strokes: ['M28 15 V60 A22 25 0 0 0 72 60 V15'] },
  ],
  numbers1: [
    { id: '1', label: '1', count: 1, strokes: ['M36 30 L54 15 V85'] },
    { id: '2', label: '2', count: 2, strokes: ['M30 32 C32 12 70 10 70 34 C70 52 40 66 28 85 H72'] },
    { id: '3', label: '3', count: 3, strokes: ['M30 24 C44 8 72 14 68 34 C66 46 52 50 44 50 C58 50 74 56 72 70 C70 90 40 92 28 78'] },
    { id: '4', label: '4', count: 4, strokes: ['M58 15 L26 62 H76', 'M60 36 V85'] },
    { id: '5', label: '5', count: 5, strokes: ['M36 15 L32 46 C46 38 72 42 72 63 C72 86 42 92 28 78', 'M36 15 H68'] },
  ],
  numbers2: [
    { id: '6', label: '6', count: 6, strokes: ['M64 18 C40 22 28 46 30 64 C32 84 66 90 70 66 C72 48 44 44 31 60'] },
    { id: '7', label: '7', count: 7, strokes: ['M28 15 H72 L42 85'] },
    { id: '8', label: '8', count: 8, strokes: ['M66 26 C60 12 34 12 34 30 C34 46 66 50 66 68 C66 88 34 88 34 68 C34 50 66 46 66 30'] },
    { id: '9', label: '9', count: 9, strokes: ['M68 34 C66 14 32 14 32 34 C32 52 66 54 68 34 V85'] },
    { id: '10', label: '10', count: 10, strokes: ['M22 30 L34 15 V85', ring(64, 50, 15, 35)] },
  ],
};

export const TRACE_SET_ORDER: TraceSetId[] = ['vowels', 'capitals', 'numbers1', 'numbers2'];
