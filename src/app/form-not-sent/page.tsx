import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { business } from "@/lib/site";

// Landing page for a form submitted before the page's script ran (G7-02). Not in the sitemap.
export const metadata: Metadata = meta({
  title: "Your Form Was Not Sent | Salado Village Framer, Salado TX",
  description:
    "Your form was not sent because the page had not finished loading. Call Salado Village Framer at (254) 613-6123 or email us and we will help with your framing.",
  path: "/form-not-sent",
  noindex: true,
});

export default function FormNotSent() {
  return (
    <section className="wrap section centered">
      <p className="eyebrow">Not sent</p>
      <h1>Your form wasn’t sent.</h1>
      <p className="lede">
        The page hadn’t finished loading, or JavaScript is turned off in your browser, so your details didn’t reach us.
        Please go back and try again once the page has loaded, or reach us directly: call{" "}
        <a href={business.phoneHref}>{business.phone}</a> or email{" "}
        <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
      <div className="actions">
        <Link href="/contact" className="button button-ink">
          Contact form
        </Link>
      </div>
    </section>
  );
}
