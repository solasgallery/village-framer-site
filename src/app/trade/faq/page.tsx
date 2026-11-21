import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";

export const metadata: Metadata = meta({
  title: "Trade Program FAQ for Interior Designers | Salado, TX",
  description:
    "Answers for interior designers about the Salado Village Framer trade program: who qualifies, the tiers, trade pricing, multi-piece projects and how to apply.",
  path: "/trade/faq",
});

// OPEN for Tim (unverified tiers): see logs/framer-decisions.md.
const faq: [string, string][] = [
  ["Who qualifies for the trade program?", "Licensed interior designers, registered architects and design professionals with an active practice. Professional credentials strengthen an application, though the program is not limited to ASID members."],
  ["What are the tiers?", "Associate, Preferred and Atelier, at 15%, 20% and 25% off custom framing."],
  ["Is there a cost to join?", "No membership fee. The trade program is a partnership, not a subscription."],
  ["What does the trade percentage cover?", "Custom framing. Rates correspond to your tier."],
  ["How does the application work?", "Submit your application online. We review each one, get back to you by email or phone, and set up a visit to the shop so you can see mouldings and materials in person."],
  ["Can I bring my clients to the shop?", "Yes. Call ahead and bring your client to look at mouldings and mats in person."],
  ["Do you handle multi-piece projects?", "Yes. Tell us the number of pieces and their sizes when you apply."],
  ["What about conservation and archival framing?", "Conservation framing means archival mats, UV-filtering glazing and reversible mounting, done by a certified picture framer. It suits heirlooms, fine art and documents worth keeping."],
  ["Where is the shop?", "2 Rock Creek Dr Unit A, Salado, Texas. Call (254) 613-6123 to talk through a project."],
];

export default function TradeFaq() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Trade program</p>
        <h1>Trade program questions.</h1>
        <p className="lede">
          Quick answers for designers. <Link href="/trade">Back to the trade program</Link>.
        </p>
      </header>
      <section className="wrap section prose" style={{ paddingTop: 0 }}>
        {faq.map(([q, a]) => (
          <details key={q} className="faq-item">
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <p style={{ marginTop: 32 }}>
          <Link href="/trade/apply" className="button button-ink">
            Apply <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>
    </>
  );
}
