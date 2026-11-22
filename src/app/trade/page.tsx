import Image from "next/image";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { business } from "@/lib/site";
import { tradeCopy as t } from "@/data/trade-copy";

export const metadata: Metadata = meta({
  title: "Framing Trade Program for Interior Designers | Salado, TX",
  description:
    "Trade pricing on custom framing for registered interior designers: 10%, 15% or 20% off by annual framing spend. One enrollment also covers Solas Gallery trade.",
  path: "/trade",
});

const mailto = `mailto:${t.email}?subject=${encodeURIComponent("Trade enrollment")}`;

/** One trade page: the locked one-pager, then the enroll call to action. No form anywhere in the trade flow. */
export default function Trade() {
  return (
    <>
      <header className="page-intro trade-intro">
        <p className="eyebrow">{t.kicker}</p>
        <h1>{t.title}</h1>
        <p className="lede">{t.lede}</p>
        <div className="actions">
          <a href="#enroll" className="button button-ink">
            Enroll <span aria-hidden="true">↓</span>
          </a>
          <a href={t.pdf} className="text-link" download>
            Download the one-pager (PDF)
          </a>
        </div>
      </header>
      <div className="wrap">
        <div className="editorial-hero">
          <Image
            src="/images/selected/design-table-collaboration.webp"
            alt="Three framers working together at the design table"
            fill
            priority
            sizes="90vw"
          />
        </div>
      </div>
      <section className="wrap section prose trade-copy">
        <h2>{t.whoQualifies.h}</h2>
        <p>{t.whoQualifies.p}</p>

        <h2>{t.tiers.h}</h2>
        <table className="trade-table">
          <thead>
            <tr>
              {t.tiers.cols.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.tiers.rows.map((r) => (
              <tr key={r[0]}>
                <th scope="row">{r[0]}</th>
                {r.slice(1).map((v, i) => (
                  <td key={v} data-label={t.tiers.cols[i + 1]}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p>{t.tiers.note}</p>

        <h2>{t.covers.h}</h2>
        <p>{t.covers.p}</p>

        <h2>{t.howItWorks.h}</h2>
        <ol className="trade-steps">
          {t.howItWorks.steps.map(([h, p]) => (
            <li key={h}>
              <b>{h}</b> — {p}
            </li>
          ))}
        </ol>
        <p className="trade-joint">{t.howItWorks.joint}</p>

        <h2>{t.local.h}</h2>
        <p>{t.local.p}</p>
      </section>
      <section className="wrap section trade-enroll" id="enroll">
        <h2>Enroll</h2>
        <p className="trade-enroll-ways">
          <a href={mailto}>{t.email}</a>
          <span aria-hidden="true"> · </span>
          <a href={business.phoneHref}>{business.phone}</a>
        </p>
        <p>
          <a href={t.pdf} className="text-link" download>
            Download the one-pager (PDF)
          </a>
        </p>
      </section>
    </>
  );
}
