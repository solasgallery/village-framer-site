"use client";
import { FormEvent, useState } from "react";
import { ListNote, ListStatus, listStatus } from "@/components/ListNote";
export default function InquiryForm({
  source = "contact",
  compact = false,
}: {
  source?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false),
    [sent, setSent] = useState<ListStatus | null>(null),
    [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 30000);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          website: data.get("website"),
          // /capture exists only to join the list: submitting it is the opt-in.
          // Everywhere else the box is unticked by default.
          newsletter: compact || data.get("news") === "on",
          source,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success)
        throw new Error(result.error || "Please try again or call the shop.");
      setSent(listStatus(result.list));
      window.dispatchEvent(
        new CustomEvent("svf-inquiry-success", { detail: { source } }),
      );
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "AbortError"
          ? e.message
          : "We could not confirm delivery. Please call (254) 613-6123 before resending.",
      );
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }
  if (sent && compact) {
    // Say only what the server reports actually happened to the list add.
    const [head, body] =
      sent === "added"
        ? ["You’re on the list.", "Thanks. We’ll email you now and then. Unsubscribe any time."]
        : sent === "preview"
          ? ["Preview: not added to the list", "This is a preview site. Nothing was added to the list."]
          : ["We have your details, but not on the list yet.", null];
    return (
      <div className="form-success" role="status">
        <p className="eyebrow">Thank you</p>
        <h2>{head}</h2>
        {body ? <p>{body}</p> : <ListNote status="failed" />}
        <a className="text-link" href="/start-framing">
          Explore a framing idea ↗
        </a>
      </div>
    );
  }
  if (sent)
    return (
      <div className="form-success" role="status">
        <p className="eyebrow">Thank you</p>
        <h2>Thanks, we got your message.</h2>
        <p>Your message is with us. We’ll use the details you provided to help plan your visit.</p>
        <ListNote status={sent} />
        <a className="text-link" href="/start-framing">
          Explore a framing idea ↗
        </a>
      </div>
    );
  return (
    // method="post": a submit before hydration must never put details in the URL.
    <form className="inquiry-form" method="post" onSubmit={submit}>
      <fieldset disabled={busy}>
        <legend className="sr-only">Your contact details</legend>
        <div className="form-row">
          <label>
            Your name
            <input name="name" required autoComplete="name" maxLength={120} />
          </label>
          <label>
            Email address
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              maxLength={254}
            />
          </label>
        </div>
        <label>
          Phone <span>(optional)</span>
          <input name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </label>
        {!compact && (
          <label>
            Tell us about your piece
            <textarea
              name="message"
              rows={5}
              maxLength={3000}
              placeholder="What are you framing? Approximate size, your ideas, and where you’re coming from…"
            />
          </label>
        )}
        {!compact && (
          <label className="check">
            <input type="checkbox" name="news" />
            Send me occasional shop news (optional)
          </label>
        )}
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave this blank
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button className="button button-ink" type="submit">
          {busy
            ? "Sending…"
            : compact
              ? "Join the list"
              : "Send your message"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <p className="form-note">
          {compact
            ? "We’ll email you now and then. Unsubscribe any time."
            : "We’ll use your details to respond to your inquiry."}{" "}
          <a href="/privacy">Privacy</a>
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
