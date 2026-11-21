import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import TradeForm from "@/components/TradeForm";

export const metadata: Metadata = meta({
  title: "Trade Framing for Interior Designers | Salado, Texas",
  description:
    "Trade framing for interior designers from Salado Village Framer in Salado, Texas. Three tiers, no membership fee, and work done by a certified picture framer.",
  path: "/trade",
});

const services = [
  ["Custom framing", "Mouldings and mats for artwork, textiles, prints and photographs."],
  ["Conservation and archival", "Archival mats, UV-filtering glazing and reversible mounting for pieces your clients want to keep."],
  ["Shadow boxes", "Jerseys, medals, textiles and other objects that carry a story."],
  ["Mirrors and large pieces", "Custom frames for statement mirrors and big work."],
  ["Multi-piece projects", "Framing several pieces for one project? Tell us the count and sizes and we will plan it together."],
  ["Design consultation", "Material selection and project planning in the shop, with you and your client."],
];
// OPEN for Tim (unverified tiers): percentages kept from the legacy page; see logs/framer-decisions.md.
const tiers = [
  ["Associate", "15%"],
  ["Preferred", "20%"],
  ["Atelier", "25%"],
];

export default function Trade() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Trade program</p>
        <h1>Framing for interior designers.</h1>
        <p className="lede">
          Salado Village Framer is a custom frame shop in Salado, Texas. The trade program gives designers one shop for
          each project, from the first conversation to the finished piece. Cherie Flanagan, a certified picture framer
          with 30 years at the bench, guides each one, and the work never leaves the shop.
        </p>
        <a href="#apply" className="button button-ink">
          Apply <span aria-hidden="true">↓</span>
        </a>
      </header>
      <section className="wrap section prose" style={{ paddingTop: 0 }}>
        <h2>What we frame</h2>
        <ul className="trade-list">
          {services.map(([h, p]) => (
            <li key={h}>
              <b>{h}.</b> {p}
            </li>
          ))}
        </ul>
        <h2>Trade tiers</h2>
        <p>There is no membership fee. Each tier takes a percentage off custom framing.</p>
        <ul className="trade-tiers">
          {tiers.map(([n, pct]) => (
            <li key={n}>
              <span className="tier-pct">{pct}</span>
              <span className="tier-name">{n}</span>
            </li>
          ))}
        </ul>
        <h2>How it works</h2>
        <ol>
          <li>Apply below with a few details about your practice.</li>
          <li>Visit the shop at 2 Rock Creek Dr Unit A in Salado to see the mouldings and mats, and talk through what you need.</li>
          <li>Start your first project together.</li>
        </ol>
        <p>
          Questions first? Read the <Link href="/trade/faq">trade FAQ</Link>, or see the{" "}
          <Link href="/trade/apply">full application</Link>. Solas Gallery runs its own trade program;{" "}
          <a href="https://www.solasgallery.com/trade">see the Solas Gallery trade page</a>.
        </p>
      </section>
      <section className="wrap section" id="apply" style={{ paddingTop: 0, maxWidth: 760 }}>
        <h2>Apply</h2>
        <TradeForm />
      </section>
    </>
  );
}
