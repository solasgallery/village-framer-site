"use client";
import { useMemo, useState } from "react";
import { colorFamilies, defaultMat, mouldings } from "@/lib/design/catalog";
import { makeProxy } from "@/lib/design/frameRenderer";
import { TIER_LABEL, estimate, matWidthIn, money } from "@/lib/design/pricing";
import type { PriceTier } from "@/lib/design/types";
import FrameCanvas from "./FrameCanvas";

const MAKERS = ["All", "Roma", "Larson-Juhl"] as const;
const TIERS: ("All" | PriceTier)[] = ["All", "economy", "mid", "premium", "signature"];

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
  const [maker, setMaker] = useState<(typeof MAKERS)[number]>("All");
  const [tier, setTier] = useState<(typeof TIERS)[number]>("All");
  const proxy = useMemo(() => makeProxy(art, 520), [art]);
  const matIn = matWidthIn("standard", artW, artH, "classic");
  const shown = mouldings.filter(
    (m) =>
      (family === "All" || m.colorFamily === family) &&
      (maker === "All" || m.maker === maker) &&
      (tier === "All" || m.priceTier === tier),
  );

  const group = (
    label: string,
    items: readonly string[],
    value: string,
    set: (v: never) => void,
    text: (v: string) => string = (v) => v,
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
          {text(it)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="step-body">
      <h1 className="step-title">Pick your frame.</h1>
      <p className="step-sub">
        Every frame below is your art, shown in that moulding with a mat.
      </p>
      <div className="filters">
        {group("Color", colorFamilies, family, setFamily)}
        {group("Maker", MAKERS, maker, setMaker)}
        {group("Style level", TIERS, tier, setTier, (v) =>
          v === "All" ? "All styles" : TIER_LABEL[v as PriceTier],
        )}
      </div>
      <p className="hint" aria-live="polite">
        {shown.length} frame{shown.length === 1 ? "" : "s"} · prices are estimates for
        a {artW}×{artH}″ piece
      </p>
      <ul className="frame-grid">
        {shown.map((m) => {
          const from = estimate({
            artW,
            artH,
            moulding: m,
            matStyle: "classic",
            matWidth: "standard",
            matColor: defaultMat,
          }).from;
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
                  label={`Your art framed in ${m.name}`}
                />
                <span className="frame-name">{m.name}</span>
                <span className="frame-desc">{m.descriptor}</span>
                <span className="frame-meta">
                  <span>{m.maker}</span>
                  <b>from {money(from)}</b>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {!shown.length && (
        <p className="hint">
          No frames match those filters.{" "}
          <button type="button" className="text-link" onClick={() => { setFamily("All"); setMaker("All"); setTier("All"); }}>
            Clear filters
          </button>
        </p>
      )}
      <p className="hint">Estimated — final quote confirmed in the shop.</p>
    </div>
  );
}
