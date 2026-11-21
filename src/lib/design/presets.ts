/**
 * Common-size buttons on the Size step. Each pair is written width × height
 * (portrait, as framers list them) and fills exactly that: Width = first
 * number, Height = second. The button label shows the same order, so what the
 * customer taps is what lands in the fields. A landscape piece uses "Swap".
 */
export const COMMON_SIZES: readonly (readonly [number, number])[] = [
  [8, 10],
  [11, 14],
  [16, 20],
  [24, 36],
  [36, 48],
  [48, 60],
];

export function presetSize(p: readonly [number, number]): { w: number; h: number } {
  return { w: p[0], h: p[1] };
}

export function presetLabel(p: readonly [number, number]): string {
  return `${p[0]}×${p[1]}`;
}
