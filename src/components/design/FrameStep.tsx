"use client";
import { useMemo, useState } from "react";
import { colorFamilies, defaultMat, mouldings } from "@/lib/design/catalog";
import { makeProxy } from "@/lib/design/frameRenderer";
import { formatInches } from "@/lib/design/parseSize";
import { matWidthIn } from "@/lib/design/pricing";
import FrameCanvas from "./FrameCanvas";

export default function FrameStep({
  art,
  artW,
  artH,
  onPick,
}: {
  art: HTMLCanvasElement;
  artW: number;
  artH: number;
  onPick: (id: string) => void;
}) {
  const [family, setFamily] = useState("All");
  const proxy = useMemo(() => makeProxy(art, 520), [art]);
  const matIn = matWidthIn("standard", artW, artH, "classic");
  const shown = mouldings.filter(
    (m) => family === "All" || m.colorFamily === family,
  );

  const group = (
    label: string,
    items: readonly string[],
    value: string,
    set: (v: never) => void,
  ) => (
    <div className="filter-group" role="group" aria-label={label}>
      {items.map((it) => (
        <button
          key={it}
          type="button"
          className="chip"
          aria-pressed={value === it}
          onClick={() => set(it as never)}
        >
          {it}
        </button>
      ))}
    </div>
  );

  return (
    <div className="step-body">
      <h1 className="step-title">Pick your frame.</h1>
      <p className="step-sub">
        These are drawn sample swatches (illustrations, not photos) of the kinds of mouldings we frame with, shown with your art and a mat.
        Cherie will show you the actual mouldings in the shop.
      </p>
      <div className="filters">
        {group("Color", colorFamilies, family, setFamily)}
      </div>
      <p className="hint" aria-live="polite">
        {shown.length} sample{shown.length === 1 ? "" : "s"} for your {formatInches(artW)}×{formatInches(artH)}″ piece
      </p>
      <ul className="frame-grid">
        {shown.map((m) => {
          return (
            <li key={m.id}>
              <button type="button" className="frame-card" onClick={() => onPick(m.id)}>
                <FrameCanvas
                  art={proxy}
                  moulding={m}
                  artW={artW}
                  artH={artH}
                  matStyle="classic"
                  matHex={defaultMat.hex}
                  matIn={matIn}
                  mode="thumb"
                  width={420}
                  height={420}
                  label={`Your art with a sample moulding: ${m.name}`}
                />
                <span className="frame-name">{m.name}</span>
                <span className="frame-desc">Drawn sample · about {m.railWidthIn}″ wide</span>
              </button>
            </li>
          );
        })}
      </ul>
      {!shown.length && (
        <p className="hint">
          No samples match those filters.{" "}
          <button type="button" className="text-link" onClick={() => { setFamily("All"); }}>
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}
