import Link from "next/link";
export default function NotFound() {
  return (
    <section className="wrap section centered">
      <p className="eyebrow">Let’s find your way</p>
      <h1>This page isn’t here.</h1>
      <p className="lede">There’s still plenty to explore in the shop.</p>
      <div className="actions">
        <Link href="/" className="button button-ink">
          Back to the homepage
        </Link>
        <Link href="/studio" className="text-link">
          Try the framing studio ↗
        </Link>
      </div>
    </section>
  );
}
