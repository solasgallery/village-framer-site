"use client";
import type { Delivery, Design } from "./state";

const OPTIONS: { id: Delivery; title: string; text: string; next: string }[] = [
  {
    id: "dropoff",
    title: "Drop it off",
    text: "Bring the piece to the shop in Salado. We look at it with you, show you real mouldings and mats beside it, and confirm the price before we start.",
    next: "Best for most projects, and for anything you would rather not mail.",
  },
  {
    id: "ship",
    title: "Ship it to us",
    text: "Can’t make the drive? Send your request and we will reply with how to pack and send the piece.",
    next: "Please don’t ship anything until you have heard back from us.",
  },
  {
    id: "consult",
    title: "Book a consult first",
    text: "Talk it through before you commit. A design consult is a conversation about the piece, the wall and your budget.",
    next: "Tell us your best days and times on the next step.",
  },
];

export default function DeliveryStep({
  design,
  onPick,
  onNext,
}: {
  design: Design;
  onPick: (d: Delivery) => void;
  onNext: () => void;
}) {
  return (
    <div className="step-body narrow">
      <h1 className="step-title">How would you like to get started?</h1>
      <p className="step-sub">No payment, no commitment. This just tells us what to expect.</p>
      <fieldset className="delivery-list">
        <legend className="sr-only">Choose how to get your piece to us</legend>
        {OPTIONS.map((o) => (
          <label key={o.id} className={`delivery-card${design.delivery === o.id ? " on" : ""}`}>
            <input type="radio" name="delivery" checked={design.delivery === o.id} onChange={() => onPick(o.id)} />
            <span>
              <b>{o.title}</b>
              <span className="d-text">{o.text}</span>
              <small>{o.next}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <button type="button" className="button button-ink wide" disabled={!design.delivery} onClick={onNext}>
        Next: your details <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
