"use client";
import { FormEvent, useMemo, useState } from "react";
import { makeProxy } from "@/lib/design/frameRenderer";
import { jpegBlob } from "@/lib/design/artImage";
import { ESTIMATE_NOTE, MAT_WIDTH_LABEL } from "@/lib/design/pricing";
import { track } from "@/lib/design/track";
import { business } from "@/lib/site";
import ArtCanvas from "./ArtCanvas";
import FrameCanvas from "./FrameCanvas";
import { derived, fmtIn, findMat, selectionOf, type Design } from "./state";

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const phoneOk = (s: string) => {
  const d = s.replace(/\D/g, "");
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};
const NEXT: Record<string, string[]> = {
  dropoff: [
    "Cherie looks at your photo and replies by email, usually within one business day.",
    "Bring the piece to the shop, Monday to Saturday, 10 to 5. Call first if it is large.",
    "Cherie will confirm the details with you before any work starts.",
  ],
  ship: [
    "Cherie replies by email, usually within one business day, about how to get the piece to her.",
    "Please wait for her reply before you ship anything.",
    "Cherie will confirm the details with you before any work starts.",
  ],
  consult: [
    "Cherie replies by email, usually within one business day, to set a time for your design consult.",
    "Have the piece, a photo of the wall and a budget in mind if you can.",
    "Cherie will confirm the details with you before any work starts.",
  ],
};
const LABEL = { dropoff: "Drop off at the shop", ship: "Ship to us", consult: "Book a design consult" } as const;

export type SentInfo = { ref: string; testMode: boolean; confirmationSent: boolean; firstName: string; email: string; delivery: keyof typeof NEXT };

export function Confirmation({ info }: { info: SentInfo }) {
  return (
    <div className="step-body narrow quote-done" role="status">
      <p className="eyebrow">Request received</p>
      <h1 className="step-title">Thank you, {info.firstName}.</h1>
      <p className="step-sub">
        Your photo and details are with us. Reference <b>{info.ref}</b>.{" "}
        {info.confirmationSent
          ? `We sent a copy to ${info.email}. If it doesn't arrive, Cherie still has your request.`
          : "We couldn't send your copy. Cherie still has your request."}
      </p>
      <h2 className="next-title">What happens next</h2>
      <ol className="next-steps">
        {NEXT[info.delivery].map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ol>
      <div className="actions">
        <a className="button button-ink" href={business.phoneHref}>Call {business.phone}</a>
        <a className="button button-line" href="/start-framing">Start another request</a>
        <a className="text-link" href="/">Back to the homepage</a>
      </div>
    </div>
  );
}

export default function DetailsStep({ design, onDone }: { design: Design; onDone: (info: SentInfo) => void }) {
  const sel = selectionOf(design)!;
  const art = design.art!;
  const d = derived(sel);
  const mat = findMat(design.matColorId);
  const proxy = useMemo(() => makeProxy(art, 700), [art]);
  const [f, setF] = useState({ name: "", email: "", phone: "", notes: "", website: "", news: false });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const delivery = design.delivery!;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = "Please enter your name.";
    if (!EMAIL.test(f.email.trim())) e.email = "Please enter a valid email address, like name@example.com.";
    if (!phoneOk(f.phone)) e.phone = "Please enter a 10-digit phone number, like (254) 613-6123.";
    setErrs(e);
    return e;
  };

  async function submit(ev: FormEvent) {
    ev.preventDefault();
    setServerError("");
    const e = validate();
    if (Object.keys(e).length) {
      document.getElementById(`q-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setBusy(true);
    try {
      const concept = document.createElement("canvas");
      concept.width = 1200;
      concept.height = 900;
      const { renderStudio, loadImage } = await import("@/lib/design/frameRenderer");
      const profile = await loadImage(sel.moulding.profileImage).catch(() => null);
      renderStudio(concept, {
        art, profile, railIn: sel.moulding.railWidthIn, matHex: mat.hex, matIn: d.matIn,
        artW: sel.artW, artH: sel.artH, matStyle: sel.matStyle, fallbackRail: "#4a3424",
      });
      const photo = await jpegBlob(art, 1800, 1_300_000);
      const conceptBlob = await jpegBlob(concept, 1000, 350_000);
      const fd = new FormData();
      fd.append("photo", photo, "photo.jpg");
      fd.append("concept", conceptBlob, "concept.jpg");
      fd.append(
        "data",
        JSON.stringify({
          name: f.name, email: f.email, phone: f.phone, notes: f.notes, website: f.website,
          newsletter: f.news,
          delivery,
          measured: design.measured,
          design: {
            artW: sel.artW, artH: sel.artH, rawW: design.rawW, rawH: design.rawH, noteW: design.noteW, noteH: design.noteH, mouldingId: sel.moulding.id, matStyle: sel.matStyle,
            matWidth: sel.matWidth, matColorId: mat.id,
          },
        }),
      );
      const res = await fetch("/api/start-framing", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setServerError(data.error || `We couldn't send your request. Please call ${business.phone}.`);
        return;
      }
      track("quote_requested", {
        frame_id: sel.moulding.id, delivery,
        art_long_side_in: Math.max(sel.artW, sel.artH),
      });
      onDone({
        ref: data.ref, testMode: !!data.testMode, confirmationSent: data.confirmationSent === true,
        firstName: f.name.trim().split(" ")[0], email: f.email.trim(), delivery,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(`We couldn't send your request. Please check your connection or call ${business.phone}.`);
    } finally {
      setBusy(false);
    }
  }

  const field = (id: "name" | "email" | "phone", label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className="field" htmlFor={`q-${id}`}>
      {label}
      <input
        id={`q-${id}`}
        value={f[id]}
        onChange={(e) => setF({ ...f, [id]: e.target.value })}
        onBlur={validate}
        aria-invalid={!!errs[id]}
        aria-describedby={errs[id] ? `q-${id}-err` : undefined}
        required
        {...props}
      />
      {errs[id] && <span className="field-error" id={`q-${id}-err`}>{errs[id]}</span>}
    </label>
  );

  return (
    <div className="step-body quote">
      <h1 className="step-title">Where should we reach you?</h1>
      <p className="step-sub">So Cherie knows where to reply.</p>
      <div className="quote-layout">
        <aside className="summary" aria-label="Your request">
          <div className="summary-preview">
            <FrameCanvas
              art={proxy} moulding={sel.moulding} artW={sel.artW} artH={sel.artH} matStyle={sel.matStyle}
              matHex={mat.hex} matIn={d.matIn} mode="studio" width={600} height={450}
              label={`Your art with a sample moulding: ${sel.moulding.name}`} className="preview-canvas"
            />
          </div>
          <p className="hint" style={{ padding: "0 16px" }}>Illustration — drawn sample frame, not a photo of a real moulding.</p>
          <dl>
            <div><dt>Artwork</dt><dd><ArtCanvas source={art} alt="Your artwork thumbnail" maxDim={120} className="mini-art" /> {fmtIn(sel.artW)} × {fmtIn(sel.artH)}</dd></div>
            <div><dt>Frame</dt><dd>{sel.moulding.name} (sample)</dd></div>
            <div><dt>Mat</dt><dd>{sel.matStyle === "none" ? "No mat" : `${sel.matStyle === "float" ? "Float" : "Classic"} · ${mat.name} · ${MAT_WIDTH_LABEL[sel.matWidth]} (${fmtIn(d.matIn)})`}</dd></div>
            <div><dt>Plan</dt><dd>{LABEL[delivery]}</dd></div>
            <div className="summary-total"><dt>Ballpark</dt><dd><b>{d.band.headline}</b> {ESTIMATE_NOTE}</dd></div>
          </dl>
        </aside>
        <form className="inquiry-form quote-form" onSubmit={submit} noValidate>
          {field("name", "Your name", { type: "text", autoComplete: "name" })}
          {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
          {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
          <label className="field" htmlFor="q-notes">
            Anything we should know <span>(optional)</span>
            <textarea id="q-notes" rows={4} value={f.notes} maxLength={2000}
              placeholder={delivery === "consult" ? "Your best days and times, the wall it’s for, thickness of the piece…" : "Thickness of the piece, the wall it’s for, a deadline…"}
              onChange={(e) => setF({ ...f, notes: e.target.value })} />
          </label>
          <label className="check">
            <input type="checkbox" checked={f.news} onChange={(e) => setF({ ...f, news: e.target.checked })} />
            Send me occasional shop news (optional)
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} /></label>
          </div>
          {serverError && <p className="form-error" role="alert">{serverError}</p>}
          <button type="submit" className="button button-ink wide" disabled={busy}>
            {busy ? "Sending your photo…" : "Send my request"}
          </button>
          <p className="form-note">
            Your photo is stored privately and only used to answer this request. This is a request, not an order.
          </p>
        </form>
      </div>
    </div>
  );
}
