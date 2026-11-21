"use client";
import { useRef, useState } from "react";
import { BIG_PIECE_IN, MAX_LONG_SIDE_IN, MIN_SIDE_IN } from "@/lib/design/pricing";
import ArtCanvas from "./ArtCanvas";
import type { Measured } from "./state";

import { formatInches, parseInches } from "@/lib/design/parseSize";

/** Parsed inches to 1/8-inch precision; 0 when empty or unreadable. */
const parse = (s: string) => {
  const r = parseInches(s);
  return r.ok ? r.value : 0;
};
const trim = (n: number) => formatInches(n);
const COMMON: [number, number][] = [[8, 10], [11, 14], [16, 20], [24, 36], [36, 48], [48, 60]];

const toEighth = (n: number) => Math.round(n * 8) / 8;

export default function SizeStep({
  art,
  artW,
  artH,
  rawW,
  rawH,
  onSize,
  onNext,
  measured,
  onMeasured,
}: {
  measured: Measured | null;
  onMeasured: (m: Measured) => void;
  art: HTMLCanvasElement;
  artW: number;
  artH: number;
  rawW: string;
  rawH: string;
  onSize: (w: number, h: number, rawW: string, rawH: string) => void;
  onNext: () => void;
}) {
  const ratio = art.width / art.height;
  const [w, setW] = useState(artW ? rawW || trim(artW) : "");
  const [h, setH] = useState(artH ? rawH || trim(artH) : "");
  // Lock is OFF by default. When on, it may only fill a field the customer has not typed in.
  const [lock, setLock] = useState(false);
  const typedW = useRef(!!artW);
  const typedH = useRef(!!artH);
  const filledW = useRef(false);
  const filledH = useRef(false);
  const nw = parse(w);
  const nh = parse(h);

  const readProblem = (label: string, raw: string) => {
    if (!raw.trim()) return "";
    const r = parseInches(raw);
    if (r.ok) return "";
    if (r.reason === "zero") return `The ${label} can’t be 0. Enter the size in inches, like 16 1/4.`;
    if (r.reason === "negative") return `The ${label} can’t be negative. Enter the size in inches, like 16 1/4.`;
    return `We couldn’t read the ${label} “${raw.trim()}”. Use inches like 16, 16.25 or 16 1/4, or feet like 3' 6".`;
  };
  const problem = (() => {
    const bad = readProblem("width", w) || readProblem("height", h);
    if (bad) return bad;
    if (!nw || !nh) return "";
    if (Math.max(nw, nh) > MAX_LONG_SIDE_IN)
      return `That’s bigger than we can plan online (${MAX_LONG_SIDE_IN}″ on the long side). Please call us and we’ll take it from there.`;
    if (nw < MIN_SIDE_IN || nh < MIN_SIDE_IN)
      return `Each side needs to be at least ${MIN_SIDE_IN}″.`;
    return "";
  })();
  const ok = nw > 0 && nh > 0 && !problem;

  const commit = (cw: number, ch: number, rw: string, rh: string) => {
    const valid =
      cw >= MIN_SIDE_IN && ch >= MIN_SIDE_IN && Math.max(cw, ch) <= MAX_LONG_SIDE_IN;
    onSize(valid ? cw : 0, valid ? ch : 0, valid ? rw : "", valid ? rh : "");
  };
  const FILLED = " (filled in from the photo’s proportions)";
  const setWidth = (v: string) => {
    typedW.current = true;
    filledW.current = false;
    setW(v);
    const cw = parse(v);
    let ch = nh;
    let rh = h;
    if (lock && cw && !typedH.current) {
      ch = toEighth(cw / ratio);
      rh = trim(ch);
      setH(rh);
      filledH.current = true;
    }
    commit(cw, ch, v, filledH.current && !typedH.current ? rh + FILLED : rh);
  };
  const setHeight = (v: string) => {
    typedH.current = true;
    filledH.current = false;
    setH(v);
    const ch = parse(v);
    let cw = nw;
    let rw = w;
    if (lock && ch && !typedW.current) {
      cw = toEighth(ch * ratio);
      rw = trim(cw);
      setW(rw);
      filledW.current = true;
    }
    commit(cw, ch, filledW.current && !typedW.current ? rw + FILLED : rw, v);
  };
  const preset = ([a, b]: [number, number]) => {
    // orient the preset like the art
    const [pw, ph] = ratio >= 1 ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
    typedW.current = typedH.current = true;
    filledW.current = filledH.current = false;
    setW(trim(pw));
    setH(trim(ph));
    commit(pw, ph, `${trim(pw)} (common-size button)`, `${trim(ph)} (common-size button)`);
  };

  return (
    <div className="step-body">
      <h1 className="step-title">How big is it?</h1>
      <p className="step-sub">Inches, width by height. Approximate is fine; we measure precisely in the shop.</p>
      <div className="size-layout">
        <div className="dim-wrap" aria-hidden={false}>
          <div className="dim-art">
            <ArtCanvas source={art} alt="Your artwork with its dimensions marked" />
          </div>
          <div className="dim-h" aria-hidden="true">
            <span>{nw ? `${trim(nw)}″` : "width"}</span>
          </div>
          <div className="dim-v" aria-hidden="true">
            <span>{nh ? `${trim(nh)}″` : "height"}</span>
          </div>
        </div>
        <div className="size-fields">
          <div className="form-row">
            <label className="field">
              Width (inches)
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                value={w}
                onChange={(e) => setWidth(e.target.value)}
                aria-invalid={!!problem}
                aria-describedby="size-help"
              />
            </label>
            <label className="field">
              Height (inches)
              <input
                type="text"
                inputMode="text"
                autoComplete="off"
                value={h}
                onChange={(e) => setHeight(e.target.value)}
                aria-invalid={!!problem}
                aria-describedby="size-help"
              />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} />
            Fill in the other side from my photo’s proportions (only if it’s empty)
          </label>
          <p id="size-help" className={problem ? "step-error" : "hint"} role={problem ? "alert" : undefined}>
            {problem ||
              (nw && nh
                ? `We’ll use ${trim(nw)}″ wide by ${trim(nh)}″ high (rounded to the nearest 1/8 inch).`
                : `Fractions are fine, like 16 1/4, and so are feet, like 3' 6\".`)}
          </p>
          <div className="tool-row" role="group" aria-label="Common sizes">
            {COMMON.map((c) => (
              <button type="button" key={c.join("x")} className="chip" onClick={() => preset(c)}>
                {c[0]}×{c[1]}
              </button>
            ))}
          </div>
          <fieldset className="measured">
            <legend className="opt-label">What did you measure? <span>(optional)</span></legend>
            <div className="seg">
              {([
                ["art", "The art itself"],
                ["frame", "Outside of its frame"],
                ["unsure", "Not sure"],
              ] as const).map(([id, label]) => (
                <label key={id} className={measured === id ? "on" : ""}>
                  <input type="radio" name="measured" checked={measured === id} onChange={() => onMeasured(id)} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <details className="measure-help">
            <summary>How to measure your piece</summary>
            <ol>
              <li>Lay the piece flat on a table. Use a hard tape measure or ruler, not a sewing tape.</li>
              <li>Measure the width first, then the height, edge to edge, in inches. Round to the nearest 1/8 inch.</li>
              <li>Measure the art only, not the border of a mat or an old frame. If it is already framed and you would rather not open it, measure the outside of the frame and tell us that above. We will sort out the rest.</li>
              <li>Canvas, objects and shadow boxes: also note how thick it is, front to back. You can add that on the last step.</li>
              <li>Not sure? Take a photo with a tape measure laid beside the piece and put it in the notes. Close is fine; we confirm every size in the shop.</li>
            </ol>
            <p>
              <a href="/guides/how-to-measure-for-framing">Read the full measuring guide</a>
            </p>
          </details>
          {ok && Math.max(nw, nh) > BIG_PIECE_IN ? (
            <p className="big-note">Big piece — Cherie will want to see it; we may suggest a consult.</p>
          ) : (
            ok && Math.max(nw, nh) >= 36 && (
              <p className="big-note">A big one — that’s exactly what we do best.</p>
            )
          )}
          <button type="button" className="button button-ink wide" disabled={!ok} onClick={onNext}>
            Next: pick a frame <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
