"use client";
import { useState } from "react";
import { MAX_LONG_SIDE_IN, MIN_SIDE_IN } from "@/lib/design/pricing";
import ArtCanvas from "./ArtCanvas";

const parse = (s: string) => {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
const trim = (n: number) => String(Math.round(n * 100) / 100);
const COMMON: [number, number][] = [[8, 10], [11, 14], [16, 20], [24, 36], [36, 48], [48, 60]];

export default function SizeStep({
  art,
  artW,
  artH,
  onSize,
  onNext,
}: {
  art: HTMLCanvasElement;
  artW: number;
  artH: number;
  onSize: (w: number, h: number) => void;
  onNext: () => void;
}) {
  const ratio = art.width / art.height;
  const [w, setW] = useState(artW ? trim(artW) : "");
  const [h, setH] = useState(artH ? trim(artH) : "");
  const [lock, setLock] = useState(true);
  const nw = parse(w);
  const nh = parse(h);

  const problem = (() => {
    if (!nw || !nh) return "";
    if (nw < MIN_SIDE_IN || nh < MIN_SIDE_IN)
      return `Each side needs to be at least ${MIN_SIDE_IN}″.`;
    if (Math.max(nw, nh) > MAX_LONG_SIDE_IN)
      return `We can design up to ${MAX_LONG_SIDE_IN}″ on the long side — call us for anything bigger.`;
    return "";
  })();
  const ok = nw > 0 && nh > 0 && !problem;

  const commit = (cw: number, ch: number) => {
    const valid =
      cw >= MIN_SIDE_IN && ch >= MIN_SIDE_IN && Math.max(cw, ch) <= MAX_LONG_SIDE_IN;
    onSize(valid ? cw : 0, valid ? ch : 0);
  };
  const setWidth = (v: string) => {
    setW(v);
    const cw = parse(v);
    let ch = nh;
    if (lock && cw) {
      ch = Math.round((cw / ratio) * 4) / 4;
      setH(trim(ch));
    }
    commit(cw, ch);
  };
  const setHeight = (v: string) => {
    setH(v);
    const ch = parse(v);
    let cw = nw;
    if (lock && ch) {
      cw = Math.round(ch * ratio * 4) / 4;
      setW(trim(cw));
    }
    commit(cw, ch);
  };
  const preset = ([a, b]: [number, number]) => {
    // orient the preset like the art
    const [pw, ph] = ratio >= 1 ? [Math.max(a, b), Math.min(a, b)] : [Math.min(a, b), Math.max(a, b)];
    setW(trim(pw));
    setH(trim(ph));
    setLock(false);
    commit(pw, ph);
  };

  return (
    <div className="step-body">
      <h1 className="step-title">How big is it?</h1>
      <p className="step-sub">Approximate is fine — we measure precisely in the shop.</p>
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
                inputMode="decimal"
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
                inputMode="decimal"
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
            Keep my photo’s proportions
          </label>
          <p id="size-help" className={problem ? "step-error" : "hint"} role={problem ? "alert" : undefined}>
            {problem || `Up to ${MAX_LONG_SIDE_IN}″ on the long side. Big pieces are our specialty.`}
          </p>
          <div className="tool-row" role="group" aria-label="Common sizes">
            {COMMON.map((c) => (
              <button type="button" key={c.join("x")} className="chip" onClick={() => preset(c)}>
                {c[0]}×{c[1]}
              </button>
            ))}
          </div>
          {ok && Math.max(nw, nh) >= 36 && (
            <p className="big-note">A big one — that’s exactly what we do best.</p>
          )}
          <button type="button" className="button button-ink wide" disabled={!ok} onClick={onNext}>
            Next: pick a frame <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
