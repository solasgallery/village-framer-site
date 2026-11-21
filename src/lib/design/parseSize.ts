/**
 * Parse a tape-measure style size into inches, to 1/8-inch precision.
 * Accepts: "16", "16.25", "16 1/4", "16-1/4", "16¼", "16 ¼", "1/4", "16 1/4in", '16 1/4"',
 * and feet: "3'", "3 ft", "3 feet", "3' 6\"", "3 ft 6 in", "3'6 1/2".
 * Anything else returns { ok: false } so the UI can block Next with a clear message.
 * Zero and negative values are rejected with their own reasons.
 */
export type ParsedInches =
  | { ok: true; value: number }
  | { ok: false; reason: "empty" | "zero" | "negative" | "unrecognised" | "zero denominator" };

const VULGAR: Record<string, number> = {
  "¼": 0.25, "½": 0.5, "¾": 0.75, "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
  "⅓": 1 / 3, "⅔": 2 / 3, "⅙": 1 / 6, "⅚": 5 / 6, "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
};

export const toEighth = (n: number) => Math.round(n * 8) / 8;
/** @deprecated kept for older imports; precision is now 1/8 inch. */
export const toQuarter = toEighth;

type Part = { ok: true; value: number } | { ok: false; reason: "unrecognised" | "zero denominator" };

/** An inch amount with no unit: "16", "16.25", "16 1/4", ".5", "1/4", "16¼". */
function plainInches(s: string): Part {
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d+(?:\.\d*)?)$/))) return { ok: true, value: parseFloat(m[1]) };
  if ((m = s.match(/^\.(\d+)$/))) return { ok: true, value: parseFloat("0." + m[1]) };
  if ((m = s.match(/^(?:(\d+) ?)?(\d+)\/(\d+)$/))) {
    const den = parseInt(m[3], 10);
    if (!den) return { ok: false, reason: "zero denominator" };
    // "16 5/4" is not a tape-measure reading; a bare "5/4" is left alone
    if (m[1] && parseInt(m[2], 10) >= den) return { ok: false, reason: "unrecognised" };
    return { ok: true, value: (m[1] ? parseInt(m[1], 10) : 0) + parseInt(m[2], 10) / den };
  }
  if ((m = s.match(/^(\d+)? ?([¼½¾⅛⅜⅝⅞])$/))) return { ok: true, value: (m[1] ? parseInt(m[1], 10) : 0) + VULGAR[m[2]] };
  return { ok: false, reason: "unrecognised" };
}

const stripInchUnit = (s: string) => s.replace(/\s*(inches|inch|in\.?|["”″]+|'')\s*$/, "").trim();

export function parseInches(raw: string): ParsedInches {
  let s = raw.normalize("NFKC").trim().toLowerCase();
  // NFKC turns "¼" into "1⁄4" (fraction slash U+2044) — treat it as "/"
  s = s.replace(/⁄/g, "/").replace(/[′’‘]/g, "'").replace(/''/g, '"');
  if (!s) return { ok: false, reason: "empty" };
  if (/^-\s*[\d.]/.test(s)) return { ok: false, reason: "negative" };

  let feet = 0;
  // feet: 3' / 3 ft / 3 feet / 3' 6" / 3ft 6in
  const f = s.match(/^(\d+(?:\.\d+)?)\s*(?:'|ft\.?|feet|foot)\s*(.*)$/);
  if (f) {
    feet = parseFloat(f[1]) * 12;
    s = f[2].trim();
    if (!s) return finish(feet);
  }
  s = stripInchUnit(s);
  if (!s) return { ok: false, reason: "empty" };
  s = s.replace(/^(\d+)\s*-\s*(\d+\/)/, "$1 $2").replace(/\s+/g, " ");
  const p = plainInches(s);
  if (!p.ok) return p;
  return finish(feet + p.value);
}

function finish(inches: number): ParsedInches {
  if (!Number.isFinite(inches)) return { ok: false, reason: "unrecognised" };
  const v = toEighth(inches);
  if (v <= 0) return { ok: false, reason: "zero" };
  return { ok: true, value: v };
}

const FRAC: Record<number, string> = { 0.125: "1/8", 0.25: "1/4", 0.375: "3/8", 0.5: "1/2", 0.625: "5/8", 0.75: "3/4", 0.875: "7/8" };

/** 16.25 -> "16 1/4", 20.375 -> "20 3/8", 20 -> "20", 0.5 -> "1/2". */
export function formatInches(n: number): string {
  const q = toEighth(n);
  const whole = Math.floor(q);
  const f = FRAC[Math.round((q - whole) * 1000) / 1000];
  if (!f) return String(whole);
  return whole ? `${whole} ${f}` : f;
}
