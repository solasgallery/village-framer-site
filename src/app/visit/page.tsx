import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { meta } from "@/lib/seo";
import { business } from "@/lib/site";
export const metadata: Metadata = meta({
  title: "Visit Salado Village Framer | Hours, Map and Directions",
  description:
    "Visit Salado Village Framer at 2 Rock Creek Dr Unit A, Salado, TX 76571. Open Monday to Saturday, 10am to 5pm. Call (254) 613-6123 first for large pieces.",
  path: "/visit",
});
export default function Visit() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Visit the shop</p>
        <h1>
          Come sit at
          <br />
          the design table.
        </h1>
        <p className="lede">
          Bring your artwork, your questions, and a little time to explore.
          We’ll help you see the possibilities.
        </p>
      </header>
      <div
        className="feature-photo"
        style={{ minHeight: "clamp(300px,40vw,560px)" }}
      >
        <Image
          src="/images/selected/shop-at-dusk.webp"
          alt="The Village Framer storefront and porch at dusk"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <section className="wrap section visit-details">
        <div>
          <p className="eyebrow">Find the shop</p>
          <h3>
            Village Framer
            <br />
            in Salado.
          </h3>
          <p>
            {business.streetAddress}<br />
            Salado, TX 76571
          </p>
          <a
            className="text-link"
            href="https://www.google.com/maps/dir/?api=1&destination=Salado+Village+Framer+2+Rock+Creek+Dr+Unit+A+Salado+TX+76571"
            target="_blank"
            rel="noreferrer"
          >
            Get directions ↗
          </a>
        </div>
        <div>
          <p className="eyebrow">Make a little time</p>
          <h3>
            Monday–Saturday
            <br />
            10am–5pm.
          </h3>
          <p>
            Sunday closed.
            <br />
            Coming with an oversized piece? Call first so we can discuss what to
            bring.
          </p>
          <a href="tel:+12546136123" className="text-link">
            (254) 613-6123 ↗
          </a>
        </div>
        <div>
          <p className="eyebrow">Before you visit</p>
          <h3>
            A photo is
            <br />a good beginning.
          </h3>
          <p>
            Bring approximate dimensions, a room photo if helpful, and a sense
            of your budget.
          </p>
          <Link href="/start-framing" className="text-link">
            Start framing →
          </Link>
        </div>
      </section>
      <section className="split-feature sage">
        <div className="feature-photo">
          <Image
            src="/images/selected/cherie-in-the-shop.webp"
            alt="Cherie in the Village Framer shop"
            fill
            sizes="(max-width:800px) 100vw, 50vw"
          />
        </div>
        <div className="feature-copy">
          <p className="eyebrow">Meet your framer</p>
          <h2>Experience you can talk to.</h2>
          <p>
            Cherie Flanagan has framed for thirty years and will look at your piece with you, with moulding and mat samples beside your artwork.
          </p>
          <p>
            Your framing work stays in our Salado shop, with the people you
            meet.
          </p>
          <div className="actions">
            <Link href="/contact" className="text-link">
              Contact us →
            </Link>
          </div>
        </div>
      </section>
      <section className="wrap section centered">
        <p className="eyebrow">Worth making a little time for</p>
        <h2>
          A Salado stop.
          <br />A Central Texas welcome.
        </h2>
        <p className="lede">
          Customers come to us from across Central Texas.
        </p>
        <div className="actions">
          <Link className="text-link" href="/service-area">
            Our service area →
          </Link>
        </div>
      </section>
    </>
  );
}
