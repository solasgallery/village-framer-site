/**
 * Parse a tape-measure style size into inches, to quarter-inch precision.
 * Accepts: "16", "16.25", "16 1/4", "16-1/4", "16¼", "16 ¼", "1/4", "16 1/4in", '16 1/4"'.
 * Anything else returns { ok: false } so the UI can block Next with a clear message.
 */
export type ParsedInches = { ok: true; value: number } | { ok: false; reason: string };

const VULGAR: Record<string, number> = {
  "¼": 0.25, "½": 0.5, "¾": 0.75, "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875,
  "⅓": 1 / 3, "⅔": 2 / 3, "⅙": 1 / 6, "⅚": 5 / 6, "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
};

export const toQuarter = (n: number) => Math.round(n * 4) / 4;

export function parseInches(raw: string): ParsedInches {
  let s = raw
    .normalize("NFKC")
    .trim()
    .toLowerCase();
  // NFKC turns "¼" into "1⁄4" (fraction slash U+2044) — treat it as "/"
  s = s.replace(/⁄/g, "/");
  // strip unit marks at the end
  s = s.replace(/\s*(inches|inch|in\.?|["”″′'’]+)\s*$/, "").trim();
  if (!s) return { ok: false, reason: "empty" };
  // "16-1/4" / "16 - 1/4" -> "16 1/4"
  s = s.replace(/^(\d+)\s*-\s*(\d+\/)/, "$1 $2");
  s = s.replace(/\s+/g, " ");

  let m: RegExpMatchArray | null;
  let value: number;
  if ((m = s.match(/^(\d+(?:\.\d+)?)$/))) {
    value = parseFloat(m[1]);
  } else if ((m = s.match(/^\.(\d+)$/))) {
    value = parseFloat("0." + m[1]);
  } else if ((m = s.match(/^(?:(\d+) ?)?(\d+)\/(\d+)$/))) {
    const whole = m[1] ? parseInt(m[1], 10) : 0;
    const num = parseInt(m[2], 10);
    const den = parseInt(m[3], 10);
    if (!den) return { ok: false, reason: "zero denominator" };
    value = whole + num / den;
  } else if ((m = s.match(/^(\d+)? ?([¼½¾⅛⅜⅝⅞])$/))) {
    value = (m[1] ? parseInt(m[1], 10) : 0) + VULGAR[m[2]];
  } else {
    return { ok: false, reason: "unrecognised" };
  }
  if (!Number.isFinite(value)) return { ok: false, reason: "unrecognised" };
  return { ok: true, value: toQuarter(value) };
}

const FRAC: Record<number, string> = { 0.25: "1/4", 0.5: "1/2", 0.75: "3/4" };

/** 16.25 -> "16 1/4", 20 -> "20", 0.5 -> "1/2". */
export function formatInches(n: number): string {
  const q = toQuarter(n);
  const whole = Math.floor(q);
  const f = FRAC[Math.round((q - whole) * 100) / 100];
  if (!f) return String(whole);
  return whole ? `${whole} ${f}` : f;
}
