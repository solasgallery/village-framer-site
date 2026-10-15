"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Rect = { x: number; y: number; w: number; h: number };
type Handle = "move" | "nw" | "ne" | "sw" | "se";
const RATIOS: { label: string; value: number | null }[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "5:4", value: 5 / 4 },
  { label: "2:3", value: 2 / 3 },
  { label: "3:2", value: 3 / 2 },
];
const MIN = 40;
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

function fitRatio(W: number, H: number, ratio: number): Rect {
  let w = W;
  let h = w / ratio;
  if (h > H) {
    h = H;
    w = h * ratio;
  }
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}

/** Pointer-driven crop box over the working art canvas. */
export default function CropTool({
  source,
  onApply,
  onCancel,
}: {
  source: HTMLCanvasElement;
  onApply: (r: Rect) => void;
  onCancel: () => void;
}) {
  const W = source.width;
  const H = source.height;
  const view = useRef<HTMLCanvasElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: W, h: H });
  const [ratio, setRatio] = useState<number | null>(null);
  const drag = useRef<{ h: Handle; sx: number; sy: number; start: Rect } | null>(null);

  useEffect(() => {
    const c = view.current;
    if (!c) return;
    c.width = W;
    c.height = H;
    c.getContext("2d")!.drawImage(source, 0, 0);
  }, [source, W, H]);

  const choose = (r: number | null) => {
    setRatio(r);
    if (r) {
      const f = fitRatio(rect.w, rect.h, r);
      // keep the current centre where possible
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;
      const nr = fitRatio(W, H, r);
      const w = Math.min(nr.w, Math.max(f.w, MIN));
      const h = w / r;
      setRect({
        x: clamp(cx - w / 2, 0, W - w),
        y: clamp(cy - h / 2, 0, H - h),
        w,
        h,
      });
    }
  };

  const onDown = (h: Handle) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { h, sx: e.clientX, sy: e.clientY, start: rect };
  };
  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      const el = box.current;
      if (!d || !el) return;
      const k = W / el.getBoundingClientRect().width;
      const dx = (e.clientX - d.sx) * k;
      const dy = (e.clientY - d.sy) * k;
      const s = d.start;
      if (d.h === "move") {
        setRect({
          ...s,
          x: clamp(s.x + dx, 0, W - s.w),
          y: clamp(s.y + dy, 0, H - s.h),
        });
        return;
      }
      const west = d.h === "nw" || d.h === "sw";
      const north = d.h === "nw" || d.h === "ne";
      const ax = west ? s.x + s.w : s.x; // anchored (opposite) corner
      const ay = north ? s.y + s.h : s.y;
      let px = clamp((west ? s.x : s.x + s.w) + dx, 0, W);
      let py = clamp((north ? s.y : s.y + s.h) + dy, 0, H);
      if (ratio) {
        let w = Math.abs(px - ax);
        let h = Math.abs(py - ay);
        w = Math.max(w, h * ratio, MIN);
        const maxW = Math.min(west ? ax : W - ax, (north ? ay : H - ay) * ratio);
        w = Math.min(w, maxW);
        h = w / ratio;
        px = west ? ax - w : ax + w;
        py = north ? ay - h : ay + h;
      }
      const x = Math.min(ax, px);
      const y = Math.min(ay, py);
      setRect({
        x,
        y,
        w: Math.max(MIN, Math.abs(px - ax)),
        h: Math.max(MIN, Math.abs(py - ay)),
      });
    },
    [W, H, ratio],
  );
  const onUp = () => (drag.current = null);

  const pct = (n: number, t: number) => `${(n / t) * 100}%`;
  return (
    <div className="crop">
      <div className="crop-ratios" role="group" aria-label="Crop shape">
        {RATIOS.map((r) => (
          <button
            key={r.label}
            type="button"
            className="chip"
            aria-pressed={ratio === r.value}
            onClick={() => choose(r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="crop-outer">
      <div
        className="crop-stage"
        ref={box}
        style={{ aspectRatio: `${W} / ${H}`, width: `min(100%, ${(58 * W) / H}vh)` }}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <canvas ref={view} role="img" aria-label="Your art, ready to crop" />
        <div
          className="crop-box"
          style={{
            left: pct(rect.x, W),
            top: pct(rect.y, H),
            width: pct(rect.w, W),
            height: pct(rect.h, H),
          }}
          onPointerDown={onDown("move")}
        >
          {(["nw", "ne", "sw", "se"] as const).map((h) => (
            <button
              key={h}
              type="button"
              className={`crop-handle crop-${h}`}
              aria-label={`Resize crop from the ${
                { nw: "top-left", ne: "top-right", sw: "bottom-left", se: "bottom-right" }[h]
              } corner`}
              onPointerDown={onDown(h)}
            />
          ))}
        </div>
      </div>
      </div>
      <div className="actions" style={{ marginTop: 18 }}>
        <button
          type="button"
          className="button button-ink"
          onClick={() => onApply(rect)}
        >
          Apply crop
        </button>
        <button type="button" className="button button-line" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
