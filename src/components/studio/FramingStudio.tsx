"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import "./studio.css";

const finishes = [
  { id: "walnut", label: "Walnut", color: "#654633", edge: "#38291e" },
  { id: "black", label: "Black", color: "#292a29", edge: "#111716" },
  { id: "natural", label: "Natural", color: "#c8a77c", edge: "#947550" },
  { id: "gold", label: "Gold", color: "#bda16c", edge: "#7c633c" },
];
const mats = [
  { id: "warm-white", label: "Warm white", color: "#f8f4e9" },
  { id: "ivory", label: "Ivory", color: "#e9dec6" },
  { id: "slate", label: "Slate", color: "#69716f" },
  { id: "black", label: "Black", color: "#282b2a" },
];
const budget =
  "Custom framing typically starts around $350. Larger pieces can exceed $1,000. Visit our Salado shop to explore options that suit your artwork and budget.";

type Photo = { image: HTMLImageElement; data: string };
async function readPhoto(file: File): Promise<Photo> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error(
      "Please choose a JPEG, PNG, or WebP image. For an iPhone HEIC photo, export or share a JPEG first.",
    );
  if (file.size > 25 * 1024 * 1024)
    throw new Error("Please choose an image smaller than 25 MB.");
  const url = URL.createObjectURL(file);
  try {
    const original = new Image();
    await new Promise<void>((resolve, reject) => {
      original.onload = () => resolve();
      original.onerror = () =>
        reject(
          new Error(
            "We could not open that image. Please try a different photo.",
          ),
        );
      original.src = url;
    });
    const scale = Math.min(1, 1800 / Math.max(original.width, original.height));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(original.width * scale));
    c.height = Math.max(1, Math.round(original.height * scale));
    const ctx = c.getContext("2d");
    if (!ctx)
      throw new Error(
        "Your browser could not prepare the preview. Please try another browser.",
      );
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(original, 0, 0, c.width, c.height);
    const data = c.toDataURL("image/jpeg", 0.86);
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Please try another photo."));
      image.src = data;
    });
    return { image, data };
  } finally {
    URL.revokeObjectURL(url);
  }
}
function jpegForEmail(canvas: HTMLCanvasElement): string {
  const small = document.createElement("canvas");
  const scale = Math.min(1, 1100 / Math.max(canvas.width, canvas.height));
  small.width = Math.round(canvas.width * scale);
  small.height = Math.round(canvas.height * scale);
  const ctx = small.getContext("2d");
  if (!ctx)
    throw new Error(
      "Unable to prepare your image. You can still call or email us.",
    );
  ctx.drawImage(canvas, 0, 0, small.width, small.height);
  let result = small.toDataURL("image/jpeg", 0.78);
  for (const quality of [0.65, 0.5, 0.35]) {
    if (result.length < 660000) break;
    result = small.toDataURL("image/jpeg", quality);
  }
  if (result.length > 700000)
    throw new Error(
      "This preview is too large to send. Please try a smaller photo.",
    );
  return result.split(",")[1];
}

export default function FramingStudio() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [art, setArt] = useState<Photo | null>(null);
  const [room, setRoom] = useState<Photo | null>(null);
  const [finish, setFinish] = useState("walnut");
  const [mat, setMat] = useState("warm-white");
  const [matWidth, setMatWidth] = useState(10);
  const [fillet, setFillet] = useState(false);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(42);
  const [roomSize, setRoomSize] = useState(38);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const chosenFinish = finishes.find((f) => f.id === finish)!;
  const chosenMat = mats.find((m) => m.id === mat)!;

  useEffect(() => {
    setSent(false);
  }, [
    art,
    room,
    finish,
    mat,
    matWidth,
    fillet,
    positionX,
    positionY,
    roomSize,
    width,
    height,
  ]);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = 1200;
    const H = room
      ? Math.round((W * room.image.height) / room.image.width)
      : 1000;
    c.width = W;
    c.height = Math.max(450, Math.min(1600, H));
    ctx.fillStyle = "#e9e5da";
    ctx.fillRect(0, 0, c.width, c.height);
    if (room) {
      const scale = Math.max(
        c.width / room.image.width,
        c.height / room.image.height,
      );
      const rw = room.image.width * scale;
      const rh = room.image.height * scale;
      ctx.drawImage(
        room.image,
        (c.width - rw) / 2,
        (c.height - rh) / 2,
        rw,
        rh,
      );
    }
    if (!art) {
      ctx.fillStyle = "#606b66";
      ctx.textAlign = "center";
      ctx.font = "36px Georgia";
      ctx.fillText(
        "Your artwork. A new perspective.",
        W / 2,
        c.height / 2 - 12,
      );
      ctx.font = "23px sans-serif";
      ctx.fillText("Choose a photo to begin.", W / 2, c.height / 2 + 38);
      return;
    }
    const ratio = art.image.width / art.image.height;
    const maxW = W * (room ? roomSize / 100 : 0.66);
    const maxH = c.height * (room ? 0.72 : 0.7);
    const border = 0.055;
    const margin = matWidth / 100;
    let aw = maxW / (1 + 2 * (border + margin));
    let ah = aw / ratio;
    const extra = aw * (border + margin);
    if (ah + 2 * extra > maxH) {
      const scale = maxH / (ah + 2 * extra);
      aw *= scale;
      ah *= scale;
    }
    const framePx = aw * border;
    const matPx = aw * margin;
    const fw = aw + 2 * (framePx + matPx);
    const fh = ah + 2 * (framePx + matPx);
    const x = room ? ((c.width - fw) * positionX) / 100 : (c.width - fw) / 2;
    const y = room ? ((c.height - fh) * positionY) / 100 : (c.height - fh) / 2;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.24)";
    ctx.shadowBlur = 22;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = chosenFinish.edge;
    ctx.fillRect(x, y, fw, fh);
    ctx.restore();
    const gradient = ctx.createLinearGradient(x, y, x + fw, y + fh);
    gradient.addColorStop(0, chosenFinish.color);
    gradient.addColorStop(0.5, chosenFinish.edge);
    gradient.addColorStop(1, chosenFinish.color);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, fw, fh);
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 5, y + 5, fw - 10, fh - 10);
    ctx.fillStyle = chosenMat.color;
    ctx.fillRect(x + framePx, y + framePx, fw - 2 * framePx, fh - 2 * framePx);
    const ax = x + framePx + matPx;
    const ay = y + framePx + matPx;
    if (fillet && matWidth > 0) {
      ctx.fillStyle = "#b99b58";
      ctx.fillRect(ax - 6, ay - 6, aw + 12, ah + 12);
    }
    ctx.drawImage(art.image, ax, ay, aw, ah);
    ctx.strokeStyle = "rgba(0,0,0,.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(ax, ay, aw, ah);
  }, [
    art,
    room,
    chosenFinish,
    chosenMat,
    matWidth,
    fillet,
    positionX,
    positionY,
    roomSize,
  ]);

  async function upload(event: ChangeEvent<HTMLInputElement>, isRoom = false) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setLoading(true);
    setSent(false);
    try {
      const photo = await readPhoto(file);
      if (isRoom) setRoom(photo);
      else setArt(photo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try another photo.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }
  function download() {
    if (!canvas.current || !art) return;
    const link = document.createElement("a");
    link.download = "village-framer-concept.jpg";
    link.href = canvas.current.toDataURL("image/jpeg", 0.9);
    link.click();
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || loading) return;
    if (
      [width, height].some(
        (value) =>
          value !== "" &&
          (!Number.isFinite(Number(value)) ||
            Number(value) < 1 ||
            Number(value) > 300),
      )
    ) {
      setError(
        "Please enter approximate dimensions between 1 and 300 inches, or leave them blank.",
      );
      return;
    }
    if (!art || !canvas.current) {
      setError("Please add your artwork before sending your concept.");
      return;
    }
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    setSent(false);
    try {
      const content = jpegForEmail(canvas.current);
      const thumb = document.createElement("canvas");
      const scale = Math.min(
        1,
        650 / Math.max(art.image.width, art.image.height),
      );
      thumb.width = Math.round(art.image.width * scale);
      thumb.height = Math.round(art.image.height * scale);
      thumb
        .getContext("2d")
        ?.drawImage(art.image, 0, 0, thumb.width, thumb.height);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);
      let response: Response;
      try {
        response = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            phone: form.get("phone"),
            message: form.get("message"),
            website: form.get("website"),
            source: "framing-studio",
            project: {
              frame: chosenFinish.label,
              mat: `${chosenMat.label}, ${matWidth === 0 ? "no mat" : matWidth === 10 ? "classic border" : "wide border"}`,
              fillet: fillet && matWidth > 0,
              width,
              height,
              city: form.get("city"),
            },
            attachments: [
              { name: "framing-concept.jpg", content },
              { name: "artwork-reference.jpg", content: jpegForEmail(thumb) },
            ],
          }),
        });
      } finally {
        clearTimeout(timer);
      }
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true)
        throw new Error(
          "Your request could not be confirmed. Please try again, or call (254) 613-6123.",
        );
      setSent(true);
      window.dispatchEvent(
        new CustomEvent("svf-inquiry-success", {
          detail: { source: "framing-studio" },
        }),
      );
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "AbortError"
          ? e.message
          : "We could not confirm delivery. Please call (254) 613-6123 before resending.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="studio" aria-label="Framing inspiration studio">
      <div className="studio-intro">
        <p className="studio-eyebrow">
          A starting point for something personal
        </p>
        <h1>See what your art could become.</h1>
        <p>
          Try a few framing ideas, then bring your vision to our Salado shop.
          We’ll help you find the right materials, proportions, and finish.
        </p>
      </div>
      <div className="studio-layout">
        <div className="studio-visual">
          <div className="studio-canvas-wrap">
            <canvas
              ref={canvas}
              aria-label={
                art
                  ? `Illustrative framing preview with ${chosenFinish.label} frame and ${chosenMat.label} mat`
                  : "Upload your artwork to create a framing preview"
              }
              role="img"
            />
          </div>
          <p className="studio-note">
            Illustrative finishes. Explore our full moulding selection in-store.
            Colors and proportions are approximate.
          </p>
          {room && (
            <p className="studio-note">
              Room placement is an inspiration view, not a measured installation
              plan.
            </p>
          )}
          <button
            className="studio-secondary"
            type="button"
            disabled={!art || loading || busy}
            onClick={download}
          >
            Download your concept
          </button>
        </div>
        <div className="studio-controls">
          <fieldset disabled={busy || loading}>
            <legend>1. Start with your artwork</legend>
            <label className="studio-upload">
              {art ? "Change artwork photo" : "Choose artwork photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => upload(e)}
              />
            </label>
            <p className="studio-note">
              JPEG, PNG, or WebP · up to 25 MB. Your photos stay in this browser
              until you send your concept.
            </p>
            {loading && <p role="status">Preparing your photo…</p>}
          </fieldset>
          <fieldset disabled={!art || busy || loading}>
            <legend>2. Explore the possibilities</legend>
            <span className="studio-label">Frame finish</span>
            <div className="studio-options">
              {finishes.map((f) => (
                <button
                  key={f.id}
                  className={finish === f.id ? "is-selected" : ""}
                  type="button"
                  aria-pressed={finish === f.id}
                  onClick={() => setFinish(f.id)}
                >
                  <i style={{ background: f.color }} aria-hidden="true" />
                  {f.label}
                </button>
              ))}
            </div>
            <span className="studio-label">Mat color</span>
            <div className="studio-options">
              {mats.map((m) => (
                <button
                  key={m.id}
                  className={mat === m.id ? "is-selected" : ""}
                  type="button"
                  aria-pressed={mat === m.id}
                  onClick={() => setMat(m.id)}
                >
                  <i style={{ background: m.color }} aria-hidden="true" />
                  {m.label}
                </button>
              ))}
            </div>
            <label>
              Mat border
              <select
                value={matWidth}
                onChange={(e) => setMatWidth(Number(e.target.value))}
              >
                <option value="0">No mat</option>
                <option value="10">Classic</option>
                <option value="18">Generous</option>
              </select>
            </label>
            <label className="studio-check">
              <input
                type="checkbox"
                checked={fillet}
                disabled={matWidth === 0}
                onChange={(e) => setFillet(e.target.checked)}
              />{" "}
              Add a gold fillet detail{" "}
              <span className="studio-note">(inside the mat)</span>
            </label>
            <div className="studio-dimensions">
              <label>
                Art width (inches)
                <input
                  type="number"
                  min="1"
                  max="300"
                  step="0.25"
                  placeholder="Approximate"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </label>
              <label>
                Art height (inches)
                <input
                  type="number"
                  min="1"
                  max="300"
                  step="0.25"
                  placeholder="Approximate"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </label>
            </div>
            <p className="studio-note">
              Dimensions help us prepare for your visit; they don’t change this
              preview.
            </p>
          </fieldset>
          <details className="studio-room">
            <summary>
              Try it on your wall <span>optional</span>
            </summary>
            <fieldset disabled={!art || busy || loading}>
              <label className="studio-upload">
                Choose room photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => upload(e, true)}
                />
              </label>
              {room && (
                <>
                  <label>
                    Artwork size
                    <input
                      type="range"
                      min="15"
                      max="75"
                      value={roomSize}
                      onChange={(e) => setRoomSize(Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Move left or right
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={positionX}
                      onChange={(e) => setPositionX(Number(e.target.value))}
                    />
                  </label>
                  <label>
                    Move up or down
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={positionY}
                      onChange={(e) => setPositionY(Number(e.target.value))}
                    />
                  </label>
                  <button
                    className="studio-text-button"
                    type="button"
                    onClick={() => setRoom(null)}
                  >
                    Remove room photo
                  </button>
                </>
              )}
            </fieldset>
          </details>
        </div>
      </div>
      <div className="studio-consult">
        <div>
          <p className="studio-eyebrow">Let’s make it yours</p>
          <h2>Bring this idea to life.</h2>
          <p>{budget}</p>
          <p>
            Send your concept and we’ll help plan your visit. Your preview and
            artwork reference will be included.
          </p>
          <p className="studio-note">
            Prefer to talk? <a href="tel:+12546136123">(254) 613-6123</a> ·{" "}
            <a href="mailto:info@solasgallery.com">Email the shop</a>
            <br />
            Monday–Saturday, 10–5.
          </p>
        </div>
        <form onSubmit={submit}>
          <fieldset disabled={busy || sent}>
            <legend className="studio-sr-only">Your contact details</legend>
            <label>
              Your name
              <input required name="name" autoComplete="name" maxLength={120} />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                maxLength={254}
              />
            </label>
            <div className="studio-dimensions">
              <label>
                Phone (optional)
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={40}
                />
              </label>
              <label>
                City (optional)
                <input
                  name="city"
                  autoComplete="address-level2"
                  maxLength={100}
                />
              </label>
            </div>
            <label>
              Tell us about your piece
              <textarea
                name="message"
                rows={3}
                maxLength={3000}
                placeholder="What matters to you? Where will it hang?"
              />
            </label>
            <div className="studio-honey" aria-hidden="true">
              <label>
                Leave this blank
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <button
              className="studio-primary"
              type="submit"
              disabled={!art || busy || loading || sent}
            >
              {busy ? "Sending your concept…" : "Send my concept to the shop"}
            </button>
            {!art && (
              <p className="studio-note">
                Add an artwork photo above to send a concept.
              </p>
            )}
          </fieldset>
          {sent && (
            <div className="studio-success" role="status">
              <strong>Your concept is with us.</strong>
              <p>
                Thank you. We’ll contact you using the details you provided to
                help plan your visit.
              </p>
              <button
                type="button"
                className="studio-text-button"
                onClick={() => setSent(false)}
              >
                Start another request
              </button>
            </div>
          )}
        </form>
      </div>
      {error && (
        <div className="studio-error" role="alert">
          {error}
          <button
            type="button"
            className="studio-text-button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}
    </section>
  );
}
