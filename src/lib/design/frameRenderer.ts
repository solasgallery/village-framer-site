import type { MatStyle, Room } from "./types";

/**
 * FrameRenderer — canvas compositing engine.
 *
 * Inputs: art image, moulding profile image, rail width (in), mat colour (hex),
 * mat width (in), art W x H (in). Output: a composited preview drawn into the
 * canvas at a fixed resolution (the canvas's own width/height).
 *
 * Moulding profile image convention: x runs ALONG the rail (it tiles),
 * y runs ACROSS the rail with y=0 at the OUTER edge. Four rails are tiled
 * and clipped to mitred trapezoids.
 */
export type FrameInput = {
  art: HTMLImageElement | HTMLCanvasElement;
  profile: HTMLImageElement | null;
  railIn: number;
  matHex: string;
  matIn: number;
  artW: number;
  artH: number;
  matStyle: MatStyle;
  /** colour used if the profile image has not loaded */
  fallbackRail?: string;
};

type Box = { x0: number; y0: number; ppi: number; minRailPx: number };
type View = { x0: number; y0: number; x1: number; y1: number };

const imageCache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string): Promise<HTMLImageElement> {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => {
        imageCache.delete(src);
        reject(new Error("Could not load " + src));
      };
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

/** Downscaled copy of the art, so thumbnails stay sharp and cheap. */
export function makeProxy(
  src: HTMLImageElement | HTMLCanvasElement,
  maxDim: number,
): HTMLCanvasElement {
  const w = src instanceof HTMLImageElement ? src.naturalWidth : src.width;
  const h = src instanceof HTMLImageElement ? src.naturalHeight : src.height;
  const s = Math.min(1, maxDim / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * s));
  c.height = Math.max(1, Math.round(h * s));
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

export function outerInches(f: FrameInput) {
  const w = f.artW + 2 * f.matIn + 2 * f.railIn;
  const h = f.artH + 2 * f.matIn + 2 * f.railIn;
  return { w, h };
}

function drawPiece(
  ctx: CanvasRenderingContext2D,
  f: FrameInput,
  box: Box,
  view: View,
  shadow: { color: string; blur: number; dx: number; dy: number } | null,
) {
  const { ppi } = box;
  const r = Math.max(f.railIn * ppi, box.minRailPx);
  const m = f.matIn * ppi;
  const aw = f.artW * ppi;
  const ah = f.artH * ppi;
  const Ow = aw + 2 * m + 2 * r;
  const Oh = ah + 2 * m + 2 * r;
  const { x0, y0 } = box;

  // body + drop shadow
  ctx.save();
  if (shadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.dx;
    ctx.shadowOffsetY = shadow.dy;
  }
  ctx.fillStyle = f.fallbackRail ?? "#3a2a1c";
  ctx.fillRect(x0, y0, Ow, Oh);
  ctx.restore();

  // mat field
  const mx = x0 + r;
  const my = y0 + r;
  const mw = aw + 2 * m;
  const mh = ah + 2 * m;
  ctx.fillStyle = f.matHex;
  ctx.fillRect(mx, my, mw, mh);

  const ax = mx + m;
  const ay = my + m;
  const lip = Math.max(1, (f.matStyle === "classic" ? 0.25 : 0.125) * ppi);

  if (f.matStyle === "float") {
    // art floats on the backing board with a soft shadow beneath it
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.38)";
    ctx.shadowBlur = Math.max(4, 0.35 * ppi);
    ctx.shadowOffsetX = Math.max(1, 0.06 * ppi);
    ctx.shadowOffsetY = Math.max(2, 0.14 * ppi);
    ctx.fillStyle = "#fff";
    ctx.fillRect(ax, ay, aw, ah);
    ctx.restore();
    ctx.drawImage(f.art, ax, ay, aw, ah);
  } else {
    // art runs a little under the mat / rail; an inset shadow sells the depth
    const wx = ax + lip;
    const wy = ay + lip;
    const ww = aw - 2 * lip;
    const wh = ah - 2 * lip;
    const sx = (f.art.width / aw) * lip;
    const sy = (f.art.height / ah) * lip;
    ctx.drawImage(
      f.art,
      sx,
      sy,
      f.art.width - 2 * sx,
      f.art.height - 2 * sy,
      wx,
      wy,
      ww,
      wh,
    );
    ctx.save();
    ctx.beginPath();
    ctx.rect(wx, wy, ww, wh);
    ctx.clip();
    ctx.shadowColor = "rgba(0,0,0,.45)";
    ctx.shadowBlur = Math.max(3, 0.16 * ppi);
    ctx.shadowOffsetX = Math.max(1, 0.04 * ppi);
    ctx.shadowOffsetY = Math.max(1, 0.06 * ppi);
    ctx.beginPath();
    ctx.rect(wx - 400, wy - 400, ww + 800, wh + 800);
    ctx.rect(wx, wy, ww, wh);
    ctx.fillStyle = "#000";
    ctx.fill("evenodd");
    ctx.restore();
    if (f.matStyle === "classic") {
      // bevel core: the thin light edge of the cut mat
      ctx.strokeStyle = "rgba(255,255,255,.85)";
      ctx.lineWidth = Math.max(1.2, 0.05 * ppi);
      ctx.strokeRect(wx, wy, ww, wh);
    }
  }

  // rails — tiled profile, mitred
  const tileLen = r * (256 / 96);
  const sides = [
    { n: "top", poly: [[x0, y0], [x0 + Ow, y0], [x0 + Ow - r, y0 + r], [x0 + r, y0 + r]], t: [1, 0, 0, 1, x0, y0], a: [view.x0 - x0, view.x1 - x0], len: Ow, dark: 0 },
    { n: "bottom", poly: [[x0, y0 + Oh], [x0 + Ow, y0 + Oh], [x0 + Ow - r, y0 + Oh - r], [x0 + r, y0 + Oh - r]], t: [1, 0, 0, -1, x0, y0 + Oh], a: [view.x0 - x0, view.x1 - x0], len: Ow, dark: 0.16 },
    { n: "left", poly: [[x0, y0], [x0, y0 + Oh], [x0 + r, y0 + Oh - r], [x0 + r, y0 + r]], t: [0, 1, 1, 0, x0, y0], a: [view.y0 - y0, view.y1 - y0], len: Oh, dark: 0.04 },
    { n: "right", poly: [[x0 + Ow, y0], [x0 + Ow, y0 + Oh], [x0 + Ow - r, y0 + Oh - r], [x0 + Ow - r, y0 + r]], t: [0, 1, -1, 0, x0 + Ow, y0], a: [view.y0 - y0, view.y1 - y0], len: Oh, dark: 0.12 },
  ] as const;
  sides.forEach((s, i) => {
    ctx.save();
    ctx.beginPath();
    s.poly.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.closePath();
    ctx.clip();
    ctx.transform(s.t[0], s.t[1], s.t[2], s.t[3], s.t[4], s.t[5]);
    const from = Math.max(0, s.a[0]);
    const to = Math.min(s.len, s.a[1]);
    if (f.profile) {
      const phase = (i * 0.37 * tileLen) % tileLen;
      let a = from - ((from + phase) % tileLen);
      for (; a < to; a += tileLen)
        ctx.drawImage(f.profile, a, 0, tileLen + 1, r);
    } else {
      ctx.fillStyle = f.fallbackRail ?? "#3a2a1c";
      ctx.fillRect(from, 0, to - from, r);
    }
    ctx.restore();
    if (s.dark) {
      ctx.save();
      ctx.beginPath();
      s.poly.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
      ctx.closePath();
      ctx.fillStyle = `rgba(0,0,0,${s.dark})`;
      ctx.fill();
      ctx.restore();
    }
  });
  // mitre seams
  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,.38)";
  ctx.lineWidth = Math.max(0.8, r * 0.02);
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x0 + r, y0 + r);
  ctx.moveTo(x0 + Ow, y0); ctx.lineTo(x0 + Ow - r, y0 + r);
  ctx.moveTo(x0, y0 + Oh); ctx.lineTo(x0 + r, y0 + Oh - r);
  ctx.moveTo(x0 + Ow, y0 + Oh); ctx.lineTo(x0 + Ow - r, y0 + Oh - r);
  ctx.stroke();
  ctx.restore();

  // glass: a faint diagonal sheen over mat + art
  ctx.save();
  ctx.beginPath();
  ctx.rect(mx, my, mw, mh);
  ctx.clip();
  const g = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
  g.addColorStop(0, "rgba(255,255,255,.14)");
  g.addColorStop(0.35, "rgba(255,255,255,0)");
  g.addColorStop(0.62, "rgba(255,255,255,0)");
  g.addColorStop(0.8, "rgba(255,255,255,.07)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(mx, my, mw, mh);
  ctx.restore();
}

function fitBox(
  canvasW: number,
  canvasH: number,
  f: FrameInput,
  fill: number,
  minRailPx: number,
): Box {
  const o = outerInches(f);
  const ppi = Math.min((canvasW * fill) / o.w, (canvasH * fill) / o.h);
  const Ow = o.w * ppi;
  const Oh = o.h * ppi;
  return { x0: (canvasW - Ow) / 2, y0: (canvasH - Oh) / 2, ppi, minRailPx };
}

/** Studio view: the framed piece on a soft neutral backdrop. */
export function renderStudio(
  canvas: HTMLCanvasElement,
  f: FrameInput,
  opts: { fill?: number; minRailPx?: number; background?: string } = {},
) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  const base = opts.background ?? "#ece7dc";
  bg.addColorStop(0, base);
  bg.addColorStop(1, "#dcd5c6");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const box = fitBox(W, H, f, opts.fill ?? 0.82, opts.minRailPx ?? 3);
  drawPiece(ctx, f, box, { x0: 0, y0: 0, x1: W, y1: H }, {
    color: "rgba(40,30,20,.38)",
    blur: W * 0.03,
    dx: W * 0.008,
    dy: W * 0.018,
  });
}

/** Wall view: framed piece hung to true scale on a room scene. */
export function renderWall(
  canvas: HTMLCanvasElement,
  f: FrameInput,
  room: Room,
  roomImg: HTMLImageElement,
): { scaledToFit: boolean } {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = Math.round((canvas.width * room.height) / room.width);
  if (canvas.height !== H) canvas.height = H;
  ctx.drawImage(roomImg, 0, 0, W, H);
  const k = W / room.width;
  let ppi = room.pxPerInch * k;
  const o = outerInches(f);
  // keep the piece on the wall: ~80 inches of wall above the floor line
  const maxH = 80 * room.pxPerInch * k;
  const maxW = 0.9 * W;
  let scaledToFit = false;
  if (o.h * ppi > maxH || o.w * ppi > maxW) {
    ppi = Math.min(maxH / o.h, maxW / o.w);
    scaledToFit = true;
  }
  const Ow = o.w * ppi;
  const Oh = o.h * ppi;
  const cx = room.anchor.x * k;
  let cy = room.anchor.y * k;
  cy = Math.max(cy, Oh / 2 + 24 * k);
  const box: Box = { x0: cx - Ow / 2, y0: cy - Oh / 2, ppi, minRailPx: 2 };
  drawPiece(ctx, f, box, { x0: 0, y0: 0, x1: W, y1: H }, {
    color: "rgba(30,20,10,.34)",
    blur: Math.max(6, 0.7 * ppi),
    dx: 0.18 * ppi,
    dy: 0.5 * ppi,
  });
  return { scaledToFit };
}

/** Close-up of the top-left mitred corner: rail, mat edge and art. */
export function renderCorner(canvas: HTMLCanvasElement, f: FrameInput) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  ctx.fillStyle = "#cfc8ba";
  ctx.fillRect(0, 0, W, H);
  // show the rail, the whole mat edge and a little of the art
  const ppi = Math.min(420, Math.max(40, (H * 0.86) / (f.railIn + f.matIn + 1.2)));
  const pad = H * 0.07;
  const box: Box = { x0: pad, y0: pad, ppi, minRailPx: 0 };
  drawPiece(ctx, f, box, { x0: 0, y0: 0, x1: W, y1: H }, {
    color: "rgba(30,20,10,.4)",
    blur: H * 0.03,
    dx: H * 0.008,
    dy: H * 0.014,
  });
}
