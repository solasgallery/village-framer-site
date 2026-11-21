"use client";
import { useRef, useState } from "react";
import { BIG_PIECE_IN, MAX_LONG_SIDE_IN, MIN_SIDE_IN } from "@/lib/design/pricing";
import ArtCanvas from "./ArtCanvas";
import type { Measured } from "./state";

import { formatInches, parseInches } from "@/lib/design/parseSize";
import { COMMON_SIZES, presetLabel, presetSize } from "@/lib/design/presets";

/** Parsed inches to 1/8-inch precision; 0 when empty or unreadable. */
const parse = (s: string) => {
  const r = parseInches(s);
  return r.ok ? r.value : 0;
};
const trim = (n: number) => formatInches(n);

const toEighth = (n: number) => Math.round(n * 8) / 8;
const COMMON_NOTE = "common-size button";
const FILLED_NOTE = "filled in from the photo’s proportions";

export default function SizeStep({
  art,
  artW,
  artH,
  rawW,
  rawH,
  noteW,
  noteH,
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
  noteW: string;
  noteH: string;
  onSize: (w: number, h: number, rawW: string, rawH: string, noteW: string, noteH: string) => void;
  onNext: () => void;
}) {
  const ratio = art.width / art.height;
  const [w, setW] = useState(artW ? rawW || trim(artW) : "");
  const [h, setH] = useState(artH ? rawH || trim(artH) : "");
  // Lock is OFF by default. When on, it may only fill a field the customer has not typed in.
  const [lock, setLock] = useState(false);
  const typedW = useRef(!!artW);
  const typedH = useRef(!!artH);
  const filledW = useRef(noteW === FILLED_NOTE);
  const filledH = useRef(noteH === FILLED_NOTE);
  // email-only notes, kept beside (never inside) the typed values
  const nW = useRef(noteW);
  const nH = useRef(noteH);
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

  // rw/rh are exactly what is in the inputs; nw/nh are email-only notes about how the value got there.
  const commit = (cw: number, ch: number, rw: string, rh: string, nw_ = "", nh_ = "") => {
    const valid =
      cw >= MIN_SIDE_IN && ch >= MIN_SIDE_IN && Math.max(cw, ch) <= MAX_LONG_SIDE_IN;
    onSize(valid ? cw : 0, valid ? ch : 0, valid ? rw : "", valid ? rh : "", valid ? nw_ : "", valid ? nh_ : "");
  };
  const FILLED = FILLED_NOTE;

  // A value the lock filled in is a suggestion: typing into it replaces it, never appends to it.
  const fromFill = (v: string, was: boolean, cur: string) =>
    was && cur && v.length > cur.length && v.startsWith(cur) ? v.slice(cur.length) : v;
  const setWidth = (raw: string) => {
    const v = fromFill(raw, filledW.current, w);
    typedW.current = v.trim() !== ""; // a cleared field counts as empty again
    filledW.current = false;
    nW.current = "";
    setW(v);
    const cw = parse(v);
    let ch = nh;
    let rh = h;
    if (lock && cw && !typedH.current) {
      ch = toEighth(cw / ratio);
      rh = trim(ch);
      setH(rh);
      filledH.current = true;
      nH.current = FILLED;
    }
    commit(cw, ch, v, rh, nW.current, nH.current);
  };
  const setHeight = (raw: string) => {
    const v = fromFill(raw, filledH.current, h);
    typedH.current = v.trim() !== ""; // a cleared field counts as empty again
    filledH.current = false;
    nH.current = "";
    setH(v);
    const ch = parse(v);
    let cw = nw;
    let rw = w;
    if (lock && ch && !typedW.current) {
      cw = toEighth(ch * ratio);
      rw = trim(cw);
      setW(rw);
      filledW.current = true;
      nW.current = FILLED;
    }
    commit(cw, ch, rw, v, nW.current, nH.current);
  };
  const toggleLock = (on: boolean) => {
    setLock(on);
    if (!on) return;
    // Turning the lock on fills a field that is empty, from the one that has a value.
    if (nw && !h.trim()) {
      const ch = toEighth(nw / ratio);
      const rh = trim(ch);
      setH(rh);
      filledH.current = true;
      nH.current = FILLED;
      commit(nw, ch, w, rh, nW.current, FILLED);
    } else if (nh && !w.trim()) {
      const cw = toEighth(nh * ratio);
      const rw = trim(cw);
      setW(rw);
      filledW.current = true;
      nW.current = FILLED;
      commit(cw, nh, rw, h, FILLED, nH.current);
    }
  };
  const preset = (c: readonly [number, number]) => {
    // Width = first number, Height = second, exactly as the button reads.
    const { w: pw, h: ph } = presetSize(c);
    typedW.current = typedH.current = true;
    filledW.current = filledH.current = false;
    nW.current = nH.current = COMMON_NOTE;
    setW(trim(pw));
    setH(trim(ph));
    commit(pw, ph, trim(pw), trim(ph), COMMON_NOTE, COMMON_NOTE);
  };

  // Landscape piece: tap a size, then swap. Keeps each field's own note with its value.
  const swap = () => {
    const [rw, rh] = [h, w];
    [typedW.current, typedH.current] = [typedH.current, typedW.current];
    [filledW.current, filledH.current] = [filledH.current, filledW.current];
    [nW.current, nH.current] = [nH.current, nW.current];
    setW(rw);
    setH(rh);
    commit(parse(rw), parse(rh), rw, rh, nW.current, nH.current);
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
                onFocus={(e) => filledW.current && e.target.select()}
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
                onFocus={(e) => filledH.current && e.target.select()}
                aria-invalid={!!problem}
                aria-describedby="size-help"
              />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" checked={lock} onChange={(e) => toggleLock(e.target.checked)} />
            Fill in the other side from my photo’s proportions (only if it’s empty)
          </label>
          <p id="size-help" className={problem ? "step-error" : "hint"} role={problem ? "alert" : undefined}>
            {problem ||
              (nw && nh
                ? `We’ll use ${trim(nw)}″ wide by ${trim(nh)}″ high (rounded to the nearest 1/8 inch).`
                : `Fractions are fine, like 16 1/4, and so are feet, like 3' 6\".`)}
          </p>
          <div className="tool-row" role="group" aria-label="Common sizes">
            {COMMON_SIZES.map((c) => (
              <button
                type="button"
                key={c.join("x")}
                className="chip"
                aria-label={`${c[0]} inches wide by ${c[1]} inches high`}
                onClick={() => preset(c)}
              >
                {presetLabel(c)}
              </button>
            ))}
            <button type="button" className="chip" disabled={!w.trim() && !h.trim()} onClick={swap}>
              Swap width and height
            </button>
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
