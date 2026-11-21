import { pricing } from "@/lib/site";
import type { DesignSelection, MatStyle, MatWidthKey } from "./types";

/**
 * Geometry + an honest ballpark band. There is NO price engine: the shop has
 * not given us a rate table, so nothing here computes a per-frame or per-size
 * dollar figure. The band is built only from the two anchors in the brief
 * (src/lib/site.ts pricing): most framing starts around $350; large pieces $1,000+.
 */
export const MAX_LONG_SIDE_IN = 72;
export const MIN_SIDE_IN = 2;

/** Art up to this size (either orientation) gets the "starts around" band. */
const SMALL_SIDES: [number, number] = [24, 36];

export const MAT_WIDTH_LABEL: Record<MatWidthKey, string> = {
  thin: "Thin",
  standard: "Standard",
  wide: "Wide",
};

const quarter = (n: number) => Math.round(n * 4) / 4;

/** Mat border in inches. Scales with the piece so big art gets a big mat. */
export function matWidthIn(
  key: MatWidthKey,
  artW: number,
  artH: number,
  style: MatStyle,
): number {
  if (style === "none") return 0;
  const standard = Math.min(4.5, Math.max(2, 0.15 * Math.min(artW, artH)));
  const factor = key === "thin" ? 0.6 : key === "wide" ? 1.5 : 1;
  return quarter(standard * factor);
}

export type Ballpark = {
  large: boolean;
  /** e.g. "Around $350 and up" */
  headline: string;
  /** short form for the sticky bar */
  short: string;
};

export function ballpark(artW: number, artH: number): Ballpark {
  const long = Math.max(artW, artH);
  const short = Math.min(artW, artH);
  const large = long > SMALL_SIDES[1] || short > SMALL_SIDES[0];
  return large
    ? { large, headline: `Often ${pricing.largeFrom} and up`, short: `Often ${pricing.largeFrom}+` }
    : { large, headline: `Around ${pricing.startsAround} and up`, short: `Around ${pricing.startsAround}+` };
}

export type Layout = { outerW: number; outerH: number; matIn: number };

export function layout(sel: DesignSelection): Layout {
  const matIn = matWidthIn(sel.matWidth, sel.artW, sel.artH, sel.matStyle);
  return { outerW: sel.artW + 2 * matIn, outerH: sel.artH + 2 * matIn, matIn };
}

export const ESTIMATE_NOTE =
  "Ballpark only — Cherie gives you an exact quote after she sees the piece.";
