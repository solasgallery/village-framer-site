import type {
  DesignSelection,
  MatStyle,
  MatWidthKey,
  PriceTier,
} from "./types";

/**
 * Estimate engine. Pure + deterministic so the browser (live preview) and the
 * quote API route (email to the shop) always agree.
 *
 * estimate = labor + moulding(perimeter x tier rate) + glazing(area)
 *          + mat(area + cut) + float surcharge + large-piece handling
 *
 * Calibration (mid tier, standard mat): 16x20 ~ $440, 36x48 ~ $1,130.
 * Rates are retail estimates, not shop costs — tune here, nowhere else.
 */
export const TIER_RATE_PER_INCH: Record<PriceTier, number> = {
  economy: 1.9,
  mid: 2.6,
  premium: 3.8,
  signature: 5.4,
};
export const TIER_LABEL: Record<PriceTier, string> = {
  economy: "Everyday",
  mid: "Classic",
  premium: "Premium",
  signature: "Signature",
};
const LABOR = 80;
const GLAZING_PER_SQ_IN = 0.095;
const MAT_PER_SQ_IN = 0.09;
const MAT_PREMIUM_PER_SQ_IN = 0.05;
const MAT_CUT_FEE = 25;
const FLOAT_FLAT = 60;
const FLOAT_PER_ART_SQ_IN = 0.04;
export const MAX_LONG_SIDE_IN = 72;
export const MIN_SIDE_IN = 2;

/** Long outer side above which extra handling applies. */
const LARGE_HANDLING: [number, number][] = [
  [60, 300],
  [40, 150],
];

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

export type Estimate = {
  total: number;
  /** rounded down to $10 — what we show as "from $X" */
  from: number;
  outerW: number;
  outerH: number;
  matIn: number;
};

export function estimate(sel: DesignSelection): Estimate {
  const { artW, artH, moulding, matStyle } = sel;
  const matIn = matWidthIn(sel.matWidth, artW, artH, matStyle);
  const outerW = artW + 2 * matIn;
  const outerH = artH + 2 * matIn;
  const perimeter = 2 * (outerW + outerH) + 8 * moulding.railWidthIn;
  const glazed = outerW * outerH;
  let total = LABOR;
  total += perimeter * TIER_RATE_PER_INCH[moulding.priceTier];
  total += glazed * GLAZING_PER_SQ_IN;
  if (matStyle !== "none") {
    const matArea = Math.max(0, glazed - artW * artH);
    total += matArea * MAT_PER_SQ_IN + MAT_CUT_FEE;
    if (sel.matColor.group === "Premium")
      total += matArea * MAT_PREMIUM_PER_SQ_IN;
  }
  if (matStyle === "float") total += FLOAT_FLAT + artW * artH * FLOAT_PER_ART_SQ_IN;
  const longSide = Math.max(outerW, outerH) + 2 * moulding.railWidthIn;
  for (const [threshold, fee] of LARGE_HANDLING)
    if (longSide > threshold) {
      total += fee;
      break;
    }
  total = Math.round(total / 5) * 5;
  return { total, from: Math.floor(total / 10) * 10, outerW, outerH, matIn };
}

/** Surcharge shown beside the "Float" option (for the current size). */
export function floatSurcharge(sel: DesignSelection): number {
  const base = estimate({ ...sel, matStyle: "classic" }).total;
  const flt = estimate({ ...sel, matStyle: "float" }).total;
  return Math.max(0, flt - base);
}

export const money = (n: number) =>
  "$" + Math.round(n).toLocaleString("en-US");

export const ESTIMATE_NOTE = "Estimated — final quote confirmed in the shop.";
