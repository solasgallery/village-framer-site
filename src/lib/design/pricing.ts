import { pricing } from "@/lib/site";
import type { DesignSelection, MatStyle, MatWidthKey } from "./types";

/**
 * Geometry + an honest ballpark band. There is NO price engine: the shop has
 * not given us a rate table, so nothing here computes a per-frame or per-size
 * dollar figure. The band is built only from the two anchors in the brief
 * (src/lib/site.ts pricing): most framing starts around $350; large pieces $1,000+.
 */
export const MAX_LONG_SIDE_IN = 120;
/** Above this the flow still works, with a note that Cherie will want to see the piece. */
export const BIG_PIECE_IN = 72;
export const MIN_SIDE_IN = 2;

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
  /** Both brief anchors, shown together for every size. */
  headline: string;
  /** short form for the sticky bar */
  short: string;
};

/**
 * Same two anchors for every size. The shop has not told us where "large"
 * starts, so there is no size-based switch (gate 2, G2-02).
 */
export function ballpark(): Ballpark {
  return {
    headline: `Most framing starts around ${pricing.startsAround}. Large pieces often run ${pricing.largeFrom} and up.`,
    short: `${pricing.startsAround}+ · large ${pricing.largeFrom}+`,
  };
}

export type Layout = { outerW: number; outerH: number; matIn: number };

export function layout(sel: DesignSelection): Layout {
  const matIn = matWidthIn(sel.matWidth, sel.artW, sel.artH, sel.matStyle);
  return { outerW: sel.artW + 2 * matIn, outerH: sel.artH + 2 * matIn, matIn };
}

export const ESTIMATE_NOTE =
  "Ballpark only — Cherie gives you an exact quote after she sees the piece.";
