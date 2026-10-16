"use client";
import { useRef, useState } from "react";
import { ACCEPT, ArtError, cropCanvas, readArt, rotate90 } from "@/lib/design/artImage";
import { track } from "@/lib/design/track";
import ArtCanvas from "./ArtCanvas";
import CropTool from "./CropTool";

export default function UploadStep({
  art,
  onArt,
  onNext,
}: {
  art: HTMLCanvasElement | null;
  onArt: (c: HTMLCanvasElement | null) => void;
  onNext: () => void;
}) {
  const file = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const original = useRef<HTMLCanvasElement | null>(art);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [over, setOver] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [edited, setEdited] = useState(false);

  async function take(f?: File | null) {
    if (!f) return;
    setError("");
    setBusy(true);
    try {
      const r = await readArt(f);
      original.current = r.canvas;
      setEdited(false);
      setCropping(false);
      onArt(r.canvas);
      track("art_uploaded", { file_type: r.type });
    } catch (e) {
      setError(e instanceof ArtError ? e.message : "Something went wrong with that photo.");
    } finally {
      setBusy(false);
    }
  }
  const input = (ref: React.RefObject<HTMLInputElement | null>, capture?: boolean) => (
    <input
      ref={ref}
      type="file"
      accept={capture ? "image/*" : ACCEPT}
      {...(capture ? { capture: "environment" as const } : {})}
      hidden
      tabIndex={-1}
      onChange={(e) => {
        take(e.target.files?.[0]);
        e.target.value = "";
      }}
    />
  );

  if (art && cropping)
    return (
      <div className="step-body narrow">
        <h1 className="step-title">Crop your art.</h1>
        <p className="step-sub">Drag the box or its corners to frame just the piece.</p>
        <CropTool
          source={art}
          onCancel={() => setCropping(false)}
          onApply={(r) => {
            onArt(cropCanvas(art, r));
            setEdited(true);
            setCropping(false);
          }}
        />
      </div>
    );

  return (
    <div className="step-body narrow">
      <h1 className="step-title">Show us your art.</h1>
      <p className="step-sub">
        Upload a photo of the piece. It doesn’t have to be perfect — it’s just for
        designing.
      </p>
      {input(file)}
      {input(phone, true)}

      {art ? (
        <>
          <div className="art-stage">
            <ArtCanvas source={art} alt="Your uploaded artwork" />
          </div>
          <div className="tool-row" role="group" aria-label="Adjust your photo">
            <button type="button" className="chip" onClick={() => { onArt(rotate90(art, -1)); setEdited(true); }}>
              ↺ Rotate left
            </button>
            <button type="button" className="chip" onClick={() => { onArt(rotate90(art, 1)); setEdited(true); }}>
              Rotate right ↻
            </button>
            <button type="button" className="chip" onClick={() => setCropping(true)}>
              Crop
            </button>
            {edited && (
              <button
                type="button"
                className="chip"
                onClick={() => {
                  if (original.current) onArt(original.current);
                  setEdited(false);
                }}
              >
                Reset
              </button>
            )}
            <button type="button" className="chip" onClick={() => file.current?.click()}>
              Replace photo
            </button>
          </div>
          <button type="button" className="button button-ink wide" onClick={onNext}>
            Next: size it <span aria-hidden="true">→</span>
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="button button-ink wide"
            onClick={() => file.current?.click()}
            disabled={busy}
          >
            {busy ? "Opening your photo…" : "Upload photo"}
          </button>
          <div
            className={`dropzone${over ? " is-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(false);
              take(e.dataTransfer.files?.[0]);
            }}
          >
            <p>or drag and drop your photo here</p>
            <small>JPG, PNG, HEIC or TIFF</small>
          </div>
          <div className="phone-option">
            <button type="button" className="text-link" onClick={() => phone.current?.click()} disabled={busy}>
              Upload from your phone
            </button>
            <small>
              On a computer? Open saladovillageframer.com/design on your phone to
              snap a photo of your piece.
            </small>
          </div>
        </>
      )}
      <p role="alert" className={error ? "step-error" : "sr-only"}>
        {error}
      </p>
    </div>
  );
}
