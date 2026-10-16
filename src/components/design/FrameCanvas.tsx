"use client";
import { useEffect, useRef, useState } from "react";
import {
  loadImage,
  renderCorner,
  renderStudio,
  renderWall,
  type FrameInput,
} from "@/lib/design/frameRenderer";
import type { MatStyle, Moulding, Room } from "@/lib/design/types";

export type FrameCanvasProps = {
  art: HTMLImageElement | HTMLCanvasElement;
  moulding: Moulding;
  artW: number;
  artH: number;
  matStyle: MatStyle;
  matHex: string;
  matIn: number;
  mode: "studio" | "wall" | "corner" | "thumb";
  room?: Room;
  width: number;
  height: number;
  label: string;
  className?: string;
  onScaled?: (scaled: boolean) => void;
};

const RAIL_FALLBACK = "#4a3424";

/** Live canvas composite of the customer's art in a moulding + mat. */
export default function FrameCanvas(p: FrameCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [profile, setProfile] = useState<HTMLImageElement | null>(null);
  const [roomImg, setRoomImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let live = true;
    setProfile(null);
    loadImage(p.moulding.profileImage)
      .then((i) => live && setProfile(i))
      .catch(() => live && setProfile(null));
    return () => {
      live = false;
    };
  }, [p.moulding.profileImage]);

  useEffect(() => {
    if (p.mode !== "wall" || !p.room) return;
    let live = true;
    loadImage(p.room.image)
      .then((i) => live && setRoomImg(i))
      .catch(() => live && setRoomImg(null));
    return () => {
      live = false;
    };
  }, [p.mode, p.room]);

  const { art, moulding, artW, artH, matStyle, matHex, matIn, mode, room } = p;
  const { width, height, onScaled } = p;
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (mode === "wall" && !roomImg) return;
    const f: FrameInput = {
      art,
      profile,
      railIn: moulding.railWidthIn,
      matHex,
      matIn,
      artW,
      artH,
      matStyle,
      fallbackRail: RAIL_FALLBACK,
    };
    // `height` can change for wall scenes, so reset before drawing.
    canvas.width = width;
    canvas.height = height;
    if (mode === "wall" && room && roomImg) {
      const r = renderWall(canvas, f, room, roomImg);
      onScaled?.(r.scaledToFit);
    } else if (mode === "corner") renderCorner(canvas, f);
    else
      renderStudio(canvas, f, {
        fill: mode === "thumb" ? 0.84 : 0.8,
        minRailPx: mode === "thumb" ? 4 : 3,
        background: mode === "thumb" ? "#efeae0" : undefined,
      });
  }, [art, profile, roomImg, moulding.railWidthIn, matHex, matIn, artW, artH, matStyle, mode, room, width, height, onScaled]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      role="img"
      aria-label={p.label}
      className={p.className}
    />
  );
}
