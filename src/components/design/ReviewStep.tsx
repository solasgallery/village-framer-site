"use client";
import { useMemo, useState } from "react";
import { matColors, rooms } from "@/lib/design/catalog";
import { makeProxy } from "@/lib/design/frameRenderer";
import { MAT_WIDTH_LABEL, floatSurcharge, matWidthIn, money } from "@/lib/design/pricing";
import type { MatStyle, MatWidthKey } from "@/lib/design/types";
import ArtCanvas from "./ArtCanvas";
import FrameCanvas from "./FrameCanvas";
import { derived, fmtIn, findMat, selectionOf, type Design } from "./state";

type View = "studio" | "wall" | "corner";
const VIEWS: { id: View; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "wall", label: "On the wall" },
  { id: "corner", label: "Corner close-up" },
];
const MAT_STYLES: { id: MatStyle; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "none", label: "No mat" },
  { id: "float", label: "Float" },
];
const WIDTHS: MatWidthKey[] = ["standard", "thin", "wide"];
const GROUPS = ["Neutrals", "Colors", "Premium"] as const;
const quarter = (n: number) => Math.round(n * 4) / 4;

export default function ReviewStep({
  design,
  update,
  goto,
  onQuote,
}: {
  design: Design;
  update: (patch: Partial<Design>) => void;
  goto: (s: 2 | 3) => void;
  onQuote: () => void;
}) {
  const sel = selectionOf(design)!;
  const art = design.art!;
  const [view, setView] = useState<View>("studio");
  const [roomId, setRoomId] = useState(rooms[0].id);
  const [scaled, setScaled] = useState(false);
  const proxy = useMemo(() => makeProxy(art, 700), [art]);
  const d = derived(sel);
  const room = rooms.find((r) => r.id === roomId)!;
  const mat = findMat(design.matColorId);
  const noMat = design.matStyle === "none";
  const matFloat = floatSurcharge(sel);

  const common = {
    moulding: sel.moulding,
    artW: sel.artW,
    artH: sel.artH,
    matStyle: design.matStyle,
    matHex: mat.hex,
    matIn: d.matIn,
  };
  const label = {
    studio: `Studio preview of your art in ${sel.moulding.name}`,
    wall: `Your framed art hung on a ${room.name.toLowerCase()} wall`,
    corner: `Close-up of the ${sel.moulding.name} corner`,
  };
  const outW = quarter(d.outerW + 2 * sel.moulding.railWidthIn);
  const outH = quarter(d.outerH + 2 * sel.moulding.railWidthIn);

  return (
    <div className="step-body review">
      <h1 className="step-title sr-only">Review your design</h1>
      <div className="review-layout">
        <div className="review-visual">
          <div className="preview-frame">
            <FrameCanvas
              art={art}
              {...common}
              mode={view}
              room={room}
              width={1200}
              height={750}
              label={label[view]}
              className="preview-canvas"
              onScaled={setScaled}
            />
          </div>
          {view === "wall" && (
            <div className="room-row">
              <div className="tool-row" role="group" aria-label="Choose a room">
                {rooms.map((r) => (
                  <button key={r.id} type="button" className="chip" aria-pressed={roomId === r.id} onClick={() => setRoomId(r.id)}>
                    {r.name}
                  </button>
                ))}
              </div>
              <p className="hint">
                Room scenes are placeholders. Shown to scale{scaled ? " (shrunk to fit this wall)" : ""}.
              </p>
            </div>
          )}
          <ul className="thumb-strip">
            {VIEWS.map((v) => (
              <li key={v.id}>
                <button type="button" className="thumb" aria-pressed={view === v.id} onClick={() => setView(v.id)}>
                  <FrameCanvas art={proxy} {...common} mode={v.id} room={room} width={300} height={188} label={`${v.label} view`} />
                  <span>{v.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="review-options">
          <div className="opt-row opt-summary">
            <ArtCanvas source={art} alt="Your artwork" maxDim={160} className="mini-art" />
            <div>
              <span className="opt-label">Artwork</span>
              <b>{fmtIn(sel.artW)} × {fmtIn(sel.artH)}</b>
            </div>
            <button type="button" className="text-link" onClick={() => goto(2)}>Edit size</button>
          </div>
          <div className="opt-row opt-summary">
            <div>
              <span className="opt-label">Frame</span>
              <b>{sel.moulding.name}</b>
              <small>{sel.moulding.maker} · {sel.moulding.descriptor}</small>
            </div>
            <button type="button" className="text-link" onClick={() => goto(3)}>Change</button>
          </div>

          <fieldset className="opt-row">
            <legend className="opt-label">Mat style</legend>
            <div className="seg">
              {MAT_STYLES.map((s) => (
                <label key={s.id} className={design.matStyle === s.id ? "on" : ""}>
                  <input type="radio" name="matStyle" value={s.id} checked={design.matStyle === s.id} onChange={() => update({ matStyle: s.id })} />
                  {s.label}
                  {s.id === "float" && matFloat > 0 && <small> +{money(matFloat)}</small>}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="opt-row" disabled={noMat}>
            <legend className="opt-label">
              Mat color <em>{noMat ? "— no mat selected" : `— ${mat.name}`}</em>
            </legend>
            {GROUPS.map((g) => (
              <div key={g} className="swatch-group">
                <span className="swatch-title">
                  {g}
                  {g === "Premium" && <small> · adds to the estimate</small>}
                </span>
                <div className="swatches">
                  {matColors.filter((c) => c.group === g).map((c) => (
                    <label key={c.id} className={`swatch${design.matColorId === c.id ? " on" : ""}`} title={c.name}>
                      <input type="radio" name="matColor" value={c.id} checked={design.matColorId === c.id} onChange={() => update({ matColorId: c.id })} />
                      <span style={{ background: c.hex }} aria-hidden="true" />
                      <span className="sr-only">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>

          <fieldset className="opt-row" disabled={noMat}>
            <legend className="opt-label">Mat width</legend>
            <div className="seg">
              {WIDTHS.map((w) => (
                <label key={w} className={design.matWidth === w ? "on" : ""}>
                  <input type="radio" name="matWidth" value={w} checked={design.matWidth === w} onChange={() => update({ matWidth: w })} />
                  {MAT_WIDTH_LABEL[w]}
                  <small> {fmtIn(matWidthIn(w, sel.artW, sel.artH, noMat ? "classic" : design.matStyle))}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="estimate" aria-live="polite">
            <span className="opt-label">Estimated total</span>
            <p className="estimate-line">
              <b>Estimated from {money(d.from)}</b> — final quote confirmed in the shop.
            </p>
            <small>Finished size about {fmtIn(outW)} × {fmtIn(outH)}.</small>
          </div>
        </div>
      </div>
      <div className="review-bar">
        <div className="review-bar-price" aria-hidden="true">
          <small>Estimated from</small>
          <b>{money(d.from)}</b>
        </div>
        <button type="button" className="button button-ink wide" onClick={onQuote}>
          Get my quote
        </button>
      </div>
    </div>
  );
}
