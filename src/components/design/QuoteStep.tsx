"use client";
import { FormEvent, useMemo, useRef, useState } from "react";
import { makeProxy } from "@/lib/design/frameRenderer";
import { jpegForEmail } from "@/lib/design/artImage";
import { MAT_WIDTH_LABEL, money } from "@/lib/design/pricing";
import { track } from "@/lib/design/track";
import { business } from "@/lib/content";
import ArtCanvas from "./ArtCanvas";
import FrameCanvas from "./FrameCanvas";
import { derived, fmtIn, findMat, selectionOf, type Design } from "./state";

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const phoneDigits = (s: string) => s.replace(/\D/g, "");
const phoneOk = (s: string) => {
  const d = phoneDigits(s);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
};

export default function QuoteStep({ design }: { design: Design }) {
  const sel = selectionOf(design)!;
  const art = design.art!;
  const d = derived(sel);
  const mat = findMat(design.matColorId);
  const proxy = useMemo(() => makeProxy(art, 700), [art]);
  const preview = useRef<HTMLCanvasElement | null>(null);
  const [f, setF] = useState({ name: "", email: "", phone: "", notes: "", website: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState(false);

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
      // Render the concept (studio view) + the artwork reference for the shop.
      const concept = document.createElement("canvas");
      concept.width = 1200;
      concept.height = 900;
      const { renderStudio, loadImage } = await import("@/lib/design/frameRenderer");
      const profile = await loadImage(sel.moulding.profileImage).catch(() => null);
      renderStudio(concept, {
        art,
        profile,
        railIn: sel.moulding.railWidthIn,
        matHex: mat.hex,
        matIn: d.matIn,
        artW: sel.artW,
        artH: sel.artH,
        matStyle: sel.matStyle,
        fallbackRail: "#4a3424",
      });
      const attachments = [
        { name: "framing-concept.jpg", content: jpegForEmail(concept, 1000) },
        { name: "artwork-reference.jpg", content: jpegForEmail(art, 800) },
      ];
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          email: f.email,
          phone: f.phone,
          notes: f.notes,
          website: f.website,
          design: {
            artW: sel.artW,
            artH: sel.artH,
            mouldingId: sel.moulding.id,
            matStyle: sel.matStyle,
            matWidth: sel.matWidth,
            matColorId: mat.id,
            estimate: d.total,
          },
          attachments,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setServerError(data.error || `We couldn't send your request. Please call ${business.phone}.`);
        return;
      }
      track("quote_requested", {
        value: d.total,
        currency: "USD",
        frame_id: sel.moulding.id,
        mat_style: sel.matStyle,
        art_long_side_in: Math.max(sel.artW, sel.artH),
      });
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setServerError(`We couldn't send your request. Please check your connection or call ${business.phone}.`);
    } finally {
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="step-body narrow quote-done" role="status">
        <h1 className="step-title">Thank you.</h1>
        <p className="step-sub">
          Thanks — we’ll be in touch within one business day. Bring your piece by the
          shop anytime: 2 Rock Creek Dr, Unit A, Salado.
        </p>
        <div className="actions">
          <a className="button button-ink" href={business.phoneHref}>Call {business.phone}</a>
          <a className="text-link" href="/">Back to the homepage</a>
        </div>
      </div>
    );

  const field = (
    id: "name" | "email" | "phone",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) => (
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
      {errs[id] && (
        <span className="field-error" id={`q-${id}-err`}>{errs[id]}</span>
      )}
    </label>
  );

  return (
    <div className="step-body quote">
      <h1 className="step-title">Get my quote.</h1>
      <p className="step-sub">
        Tell us where to send it. We’ll confirm the details and your final price.
      </p>
      <div className="quote-layout">
        <aside className="summary" aria-label="Your design">
          <div className="summary-preview">
            <FrameCanvas
              art={proxy}
              moulding={sel.moulding}
              artW={sel.artW}
              artH={sel.artH}
              matStyle={sel.matStyle}
              matHex={mat.hex}
              matIn={d.matIn}
              mode="studio"
              width={600}
              height={450}
              label={`Your art framed in ${sel.moulding.name}`}
              className="preview-canvas"
            />
          </div>
          <dl>
            <div><dt>Artwork</dt><dd><ArtCanvas source={art} alt="Your artwork thumbnail" maxDim={120} className="mini-art" /> {fmtIn(sel.artW)} × {fmtIn(sel.artH)}</dd></div>
            <div><dt>Frame</dt><dd>{sel.moulding.name} · {sel.moulding.maker}</dd></div>
            <div><dt>Mat</dt><dd>{sel.matStyle === "none" ? "No mat" : `${sel.matStyle === "float" ? "Float" : "Classic"} · ${mat.name} · ${MAT_WIDTH_LABEL[sel.matWidth]} (${fmtIn(d.matIn)})`}</dd></div>
            <div className="summary-total"><dt>Estimate</dt><dd><b>Estimated from {money(d.from)}</b> — final quote confirmed in the shop.</dd></div>
          </dl>
        </aside>
        <form className="inquiry-form quote-form" onSubmit={submit} noValidate>
          {field("name", "Your name", { type: "text", autoComplete: "name" })}
          {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
          {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}
          <label className="field" htmlFor="q-notes">
            Notes <span>(optional)</span>
            <textarea id="q-notes" rows={4} value={f.notes} maxLength={2000} onChange={(e) => setF({ ...f, notes: e.target.value })} />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} /></label>
          </div>
          {serverError && <p className="form-error" role="alert">{serverError}</p>}
          <button type="submit" className="button button-ink wide" disabled={busy}>
            {busy ? "Sending…" : "Send my quote request"}
          </button>
          <p className="form-note">
            This is a request, not an order — nothing is charged. By sending it you
            agree we may contact you about your framing. Our promise: every piece is
            inspected before it leaves the shop.
          </p>
        </form>
      </div>
    </div>
  );
}
