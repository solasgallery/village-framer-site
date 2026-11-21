"use client";
import { FormEvent, useState } from "react";
import { ListNote, ListStatus, listStatus } from "@/components/ListNote";

const SPECIALIZATIONS = ["Residential", "Commercial", "Hospitality", "Mixed practice", "Staging", "Other"];
const SERVICES = ["Custom framing", "Conservation / archival", "Shadow boxes", "Multi-piece projects", "Mirrors", "Design consultation"];

/** Trade application. Posts to /api/inquiry (same honeypot, caps and rate limit as the contact form). */
export default function TradeForm({ full = false }: { full?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<ListStatus | null>(null);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const lines: string[] = [];
    const add = (label: string, val: string) => val && lines.push(`${label}: ${val}`);
    add("Firm / studio", v("firm"));
    add("Website", v("siteUrl"));
    add("Specialization", v("specialization"));
    add("Years in practice", v("years"));
    add("ASID / professional membership", v("asid"));
    add("Texas resale certificate", v("resale"));
    add("Mailing address", [v("street"), v("city"), v("state"), v("zip")].filter(Boolean).join(", "));
    add("Services of interest", fd.getAll("services").join(", "));
    add("How they heard about us", v("heard"));
    add("About their practice", v("about"));
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 30000);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          name: v("name"),
          email: v("email"),
          phone: v("phone"),
          message: lines.join("\n"),
          website: v("hp"),
          newsletter: v("news") === "on",
          source: "trade",
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) throw new Error(result.error || "Please try again or call the shop.");
      setSent(listStatus(result.list));
    } catch (err) {
      setError(
        err instanceof Error && err.name !== "AbortError"
          ? err.message
          : "We could not confirm delivery. Please call (254) 613-6123 before resending.",
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="form-success" role="status">
        <p className="eyebrow">Thank you</p>
        <h2>We received your application.</h2>
        <p>We will be in touch by email or phone.</p>
        <ListNote status={sent} />
      </div>
    );

  return (
    // method="post": a submit before hydration must never put details in the URL.
    <form className="inquiry-form" method="post" onSubmit={submit}>
      <fieldset disabled={busy}>
        <legend className="sr-only">Trade application</legend>
        <div className="form-row">
          <label>
            Full name
            <input name="name" required autoComplete="name" maxLength={120} />
          </label>
          <label>
            Firm or studio
            <input name="firm" required autoComplete="organization" maxLength={120} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" maxLength={254} />
          </label>
          <label>
            Phone <span>(optional)</span>
            <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
          </label>
        </div>
        <label>
          Website or portfolio <span>(optional)</span>
          <input name="siteUrl" type="url" placeholder="https://example.com" maxLength={200} />
        </label>
        <label>
          Primary specialization
          <select name="specialization" required defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        {full && (
          <>
            <div className="form-row">
              <label>
                Years in practice
                <select name="years" required defaultValue="">
                  <option value="" disabled>
                    Select one
                  </option>
                  {["1 to 3", "4 to 10", "11 to 20", "20 or more"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                ASID or professional membership <span>(optional)</span>
                <input name="asid" maxLength={120} />
              </label>
            </div>
            <label>
              Texas resale certificate number <span>(optional)</span>
              <input name="resale" maxLength={60} />
            </label>
            <div className="form-row">
              <label>
                Street address <span>(optional)</span>
                <input name="street" autoComplete="street-address" maxLength={120} />
              </label>
              <label>
                City <span>(optional)</span>
                <input name="city" autoComplete="address-level2" maxLength={80} />
              </label>
            </div>
            <div className="form-row">
              <label>
                State <span>(optional)</span>
                <input name="state" autoComplete="address-level1" maxLength={40} />
              </label>
              <label>
                ZIP <span>(optional)</span>
                <input name="zip" autoComplete="postal-code" maxLength={20} />
              </label>
            </div>
            <fieldset className="check-group">
              <legend>Services of interest</legend>
              {SERVICES.map((s) => (
                <label key={s} className="check-line">
                  <input type="checkbox" name="services" value={s} /> {s}
                </label>
              ))}
            </fieldset>
            <label>
              How did you hear about us? <span>(optional)</span>
              <input name="heard" maxLength={200} />
            </label>
          </>
        )}
        <label>
          Tell us about your practice
          <textarea
            name="about"
            rows={5}
            required={full}
            maxLength={2000}
            placeholder="Your studio, your clients, and what you are looking for in a framer."
          />
        </label>
        <label className="check">
          <input type="checkbox" name="news" />
          Send me occasional shop news (optional)
        </label>
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave this blank
            <input name="hp" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className="button button-ink" type="submit">
          {busy ? "Sending…" : "Submit application"} <span aria-hidden="true">↗</span>
        </button>
        <p className="form-note">
          We use your details to respond to your application. <a href="/privacy">Privacy</a>
        </p>
      </fieldset>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
