"use client";
import { useEffect, useRef } from "react";

/** Shows a working-art canvas (cropped/rotated) as an accessible image. */
export default function ArtCanvas({
  source,
  alt,
  className,
  maxDim = 900,
}: {
  source: HTMLCanvasElement;
  alt: string;
  className?: string;
  maxDim?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const s = Math.min(1, maxDim / Math.max(source.width, source.height));
    c.width = Math.max(1, Math.round(source.width * s));
    c.height = Math.max(1, Math.round(source.height * s));
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(source, 0, 0, c.width, c.height);
  }, [source, maxDim]);
  return <canvas ref={ref} role="img" aria-label={alt} className={className} />;
}
