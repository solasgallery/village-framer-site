import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import TradeForm from "@/components/TradeForm";

export const metadata: Metadata = meta({
  title: "Trade Application for Interior Designers | Salado, TX",
  description:
    "Apply for the Salado Village Framer trade program, a custom framing partnership for interior designers. There is no fee to apply. The shop is in Salado, Texas.",
  path: "/trade/apply",
});

export default function Apply() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Trade program</p>
        <h1>Trade application.</h1>
        <p className="lede">
          There is no fee to apply. <Link href="/trade">Back to the trade program</Link>. Solas Gallery runs its own trade
          program; <a href="https://www.solasgallery.com/trade">see the Solas Gallery trade page</a>.
        </p>
      </header>
      <section className="wrap section" style={{ paddingTop: 0, maxWidth: 760 }}>
        <TradeForm full />
      </section>
    </>
  );
}
